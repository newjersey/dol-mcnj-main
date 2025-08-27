import { RedisClient } from './redisClient';
import * as Sentry from '@sentry/node';

export interface RedisMetrics {
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'reconnecting';
  memoryUsage: number; // in bytes
  keyCount: number;
  hitRate: number; // percentage
  missRate: number; // percentage
  operationsPerSecond: number;
  avgResponseTime: number; // in milliseconds
  errorCount: number;
  lastHealthCheck: Date;
}

export interface RedisPerformanceData {
  timestamp: Date;
  operation: string;
  duration: number;
  success: boolean;
  error?: string;
}

export class RedisMonitoringService {
  private redisClient: RedisClient;
  private metrics: RedisMetrics;
  private performanceData: RedisPerformanceData[] = [];
  private maxPerformanceEntries = 1000;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  constructor(redisClient: RedisClient) {
    this.redisClient = redisClient;
    this.metrics = {
      connectionStatus: 'disconnected',
      memoryUsage: 0,
      keyCount: 0,
      hitRate: 0,
      missRate: 0,
      operationsPerSecond: 0,
      avgResponseTime: 0,
      errorCount: 0,
      lastHealthCheck: new Date(),
    };
  }

  public startMonitoring(intervalMs = 30000): void {
    if (this.isMonitoring) {
      console.log('Redis monitoring is already running');
      return;
    }

    this.isMonitoring = true;
    console.log(`Starting Redis monitoring with interval: ${intervalMs}ms`);

    this.monitoringInterval = setInterval(async () => {
      try {
        await this.collectMetrics();
      } catch (error) {
        console.error('Failed to collect Redis metrics:', error);
        Sentry.captureException(error);
      }
    }, intervalMs);

    // Initial metrics collection
    this.collectMetrics();
  }

  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('Redis monitoring stopped');
  }

  private async collectMetrics(): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Check connection status
      const isHealthy = await this.redisClient.healthCheck();
      this.metrics.connectionStatus = isHealthy ? 'connected' : 'disconnected';
      this.metrics.lastHealthCheck = new Date();

      if (!isHealthy) {
        console.warn('Redis health check failed, skipping detailed metrics collection');
        return;
      }

      // Get Redis INFO command data
      const info = await this.redisClient.getClient().info();
      const infoLines = info.split('\r\n');
      const infoData: Record<string, string> = {};

      infoLines.forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          infoData[key] = value;
        }
      });

      // Extract memory usage
      this.metrics.memoryUsage = parseInt(infoData.used_memory || '0');

      // Get key count using DBSIZE
      try {
        this.metrics.keyCount = await this.redisClient.getClient().dbsize();
      } catch (error) {
        console.error('Failed to get key count:', error);
      }

      // Calculate hit/miss rates from performance data
      this.calculateHitMissRates();

      // Calculate operations per second
      this.calculateOperationsPerSecond();

      // Calculate average response time
      this.calculateAverageResponseTime();

      // Update error count
      this.updateErrorCount();

      const endTime = Date.now();
      console.log(`Redis metrics collection completed in ${endTime - startTime}ms`);

    } catch (error) {
      console.error('Error collecting Redis metrics:', error);
      this.metrics.errorCount++;
      Sentry.captureException(error);
    }
  }

  private calculateHitMissRates(): void {
    const recentData = this.getRecentPerformanceData(300000); // Last 5 minutes
    const totalOperations = recentData.length;

    if (totalOperations === 0) {
      this.metrics.hitRate = 0;
      this.metrics.missRate = 0;
      return;
    }

    const hits = recentData.filter(data => 
      data.operation.startsWith('get') && data.success
    ).length;

    const misses = recentData.filter(data => 
      data.operation.startsWith('get') && !data.success
    ).length;

    const getOperations = hits + misses;
    if (getOperations > 0) {
      this.metrics.hitRate = (hits / getOperations) * 100;
      this.metrics.missRate = (misses / getOperations) * 100;
    }
  }

  private calculateOperationsPerSecond(): void {
    const recentData = this.getRecentPerformanceData(60000); // Last 1 minute
    this.metrics.operationsPerSecond = recentData.length / 60;
  }

  private calculateAverageResponseTime(): void {
    const recentData = this.getRecentPerformanceData(300000); // Last 5 minutes
    
    if (recentData.length === 0) {
      this.metrics.avgResponseTime = 0;
      return;
    }

    const totalTime = recentData.reduce((sum, data) => sum + data.duration, 0);
    this.metrics.avgResponseTime = totalTime / recentData.length;
  }

  private updateErrorCount(): void {
    const recentData = this.getRecentPerformanceData(3600000); // Last 1 hour
    this.metrics.errorCount = recentData.filter(data => !data.success).length;
  }

  private getRecentPerformanceData(timeWindowMs: number): RedisPerformanceData[] {
    const cutoffTime = new Date(Date.now() - timeWindowMs);
    return this.performanceData.filter(data => data.timestamp >= cutoffTime);
  }

  public recordOperation(operation: string, duration: number, success: boolean, error?: string): void {
    const performanceEntry: RedisPerformanceData = {
      timestamp: new Date(),
      operation,
      duration,
      success,
      error,
    };

    this.performanceData.push(performanceEntry);

    // Maintain performance data size limit
    if (this.performanceData.length > this.maxPerformanceEntries) {
      this.performanceData = this.performanceData.slice(-this.maxPerformanceEntries);
    }

    // Log slow operations
    if (duration > 1000) { // Operations taking more than 1 second
      console.warn(`Slow Redis operation detected: ${operation} took ${duration}ms`, { operation, duration, success, error });
    }

    // Log errors
    if (!success && error) {
      console.error(`Redis operation failed: ${operation}`, { operation, duration, error });
    }
  }

  public getMetrics(): RedisMetrics {
    return { ...this.metrics };
  }

  public getPerformanceData(timeWindowMs?: number): RedisPerformanceData[] {
    if (timeWindowMs) {
      return this.getRecentPerformanceData(timeWindowMs);
    }
    return [...this.performanceData];
  }

  public getHealthStatus(): { 
    status: 'healthy' | 'degraded' | 'unhealthy'; 
    details: Record<string, any> 
  } {
    const status = this.redisClient.getStatus();
    
    let healthStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    const details: Record<string, any> = {
      connectionStatus: this.metrics.connectionStatus,
      isHealthy: status.isHealthy,
      connectionAttempts: status.connectionAttempts,
      memoryUsage: this.metrics.memoryUsage,
      keyCount: this.metrics.keyCount,
      avgResponseTime: this.metrics.avgResponseTime,
      hitRate: this.metrics.hitRate,
      errorCount: this.metrics.errorCount,
      lastHealthCheck: this.metrics.lastHealthCheck,
    };

    // Determine health status based on various factors
    if (!status.isHealthy || this.metrics.connectionStatus !== 'connected') {
      healthStatus = 'unhealthy';
    } else if (
      this.metrics.avgResponseTime > 500 || // Response time > 500ms
      this.metrics.hitRate < 80 || // Hit rate < 80%
      this.metrics.errorCount > 10 // More than 10 errors in the last hour
    ) {
      healthStatus = 'degraded';
    }

    details.healthStatus = healthStatus;
    
    return { status: healthStatus, details };
  }

  public async generateReport(): Promise<string> {
    const metrics = this.getMetrics();
    const healthStatus = this.getHealthStatus();
    const recentPerformance = this.getRecentPerformanceData(3600000); // Last hour

    const report = `
Redis Monitoring Report
=====================
Generated: ${new Date().toISOString()}

Connection Status: ${metrics.connectionStatus}
Health Status: ${healthStatus.status}
Last Health Check: ${metrics.lastHealthCheck.toISOString()}

Performance Metrics:
- Memory Usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB
- Key Count: ${metrics.keyCount}
- Hit Rate: ${metrics.hitRate.toFixed(2)}%
- Miss Rate: ${metrics.missRate.toFixed(2)}%
- Operations/Second: ${metrics.operationsPerSecond.toFixed(2)}
- Average Response Time: ${metrics.avgResponseTime.toFixed(2)}ms
- Error Count (last hour): ${metrics.errorCount}

Recent Performance (last hour):
- Total Operations: ${recentPerformance.length}
- Successful Operations: ${recentPerformance.filter(p => p.success).length}
- Failed Operations: ${recentPerformance.filter(p => !p.success).length}
- Slowest Operation: ${Math.max(...recentPerformance.map(p => p.duration), 0).toFixed(2)}ms

Recommendations:
${this.generateRecommendations(metrics, healthStatus)}
`;

    return report;
  }

  private generateRecommendations(metrics: RedisMetrics, healthStatus: any): string {
    const recommendations: string[] = [];

    if (healthStatus.status === 'unhealthy') {
      recommendations.push('- Check Redis connection and server status');
      recommendations.push('- Verify network connectivity and firewall settings');
    }

    if (metrics.avgResponseTime > 100) {
      recommendations.push('- Consider optimizing Redis queries or increasing server resources');
    }

    if (metrics.hitRate < 90) {
      recommendations.push('- Review cache key expiration policies and cache warming strategies');
    }

    if (metrics.memoryUsage > 1024 * 1024 * 1024) { // > 1GB
      recommendations.push('- Monitor memory usage and consider implementing cache eviction policies');
    }

    if (metrics.errorCount > 5) {
      recommendations.push('- Investigate recent Redis errors and connection issues');
    }

    if (recommendations.length === 0) {
      recommendations.push('- No issues detected, Redis performance is optimal');
    }

    return recommendations.join('\n');
  }

  public async alertOnThresholds(): Promise<void> {
    const healthStatus = this.getHealthStatus();
    
    if (healthStatus.status === 'unhealthy') {
      const alert = {
        severity: 'critical',
        message: 'Redis is unhealthy',
        details: healthStatus.details,
        timestamp: new Date(),
      };
      
      console.error('CRITICAL ALERT: Redis is unhealthy', alert);
      Sentry.captureMessage('Redis is unhealthy', 'error');
    } else if (healthStatus.status === 'degraded') {
      const alert = {
        severity: 'warning',
        message: 'Redis performance is degraded',
        details: healthStatus.details,
        timestamp: new Date(),
      };
      
      console.warn('WARNING: Redis performance is degraded', alert);
      Sentry.captureMessage('Redis performance is degraded', 'warning');
    }
  }
}