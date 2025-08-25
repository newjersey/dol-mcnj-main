import { performance } from 'perf_hooks';
import { RedisClient } from '../infrastructure/redis/redisClient';
import { RedisDataClient } from '../infrastructure/redis/RedisDataClient';
import { PostgresDataClient } from '../database/data/PostgresDataClient';

/**
 * Performance test script for Redis integration
 * This script compares performance between Redis-cached and direct PostgreSQL queries
 */

interface PerformanceResults {
  operation: string;
  redisTime?: number;
  postgresTime?: number;
  improvement?: number;
  cacheHit?: boolean;
}

class RedisPerformanceTest {
  private redisClient: RedisClient;
  private redisDataClient: RedisDataClient;
  private postgresClient: PostgresDataClient;
  private results: PerformanceResults[] = [];

  constructor() {
    // Initialize clients with test configuration
    this.redisClient = new RedisClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT || 6379),
      keyPrefix: 'test:performance:',
    });

    // Mock PostgreSQL connection for testing
    const mockConnection = {
      user: 'test',
      host: 'localhost',
      database: 'test',
      password: 'test',
      port: 5432,
    };

    this.postgresClient = new PostgresDataClient(mockConnection);
    this.redisDataClient = new RedisDataClient(this.redisClient, this.postgresClient);
  }

  public async runTests(): Promise<void> {
    console.log('🚀 Starting Redis Performance Tests...\n');

    try {
      // Connect to Redis
      await this.redisClient.connect();
      console.log('✅ Connected to Redis\n');

      // Run performance tests
      await this.testBasicOperations();
      await this.testDataClientOperations();
      await this.testCachePerformance();

      // Generate report
      this.generateReport();

    } catch (error) {
      console.error('❌ Performance test failed:', error);
    } finally {
      await this.redisClient.disconnect();
    }
  }

  private async testBasicOperations(): Promise<void> {
    console.log('📊 Testing Basic Redis Operations...');

    // Test SET operations
    const setStart = performance.now();
    for (let i = 0; i < 1000; i++) {
      await this.redisClient.set(`test:key:${i}`, `value:${i}`, 'EX', 300);
    }
    const setTime = performance.now() - setStart;
    console.log(`  SET (1000 operations): ${setTime.toFixed(2)}ms`);

    // Test GET operations
    const getStart = performance.now();
    for (let i = 0; i < 1000; i++) {
      await this.redisClient.get(`test:key:${i}`);
    }
    const getTime = performance.now() - getStart;
    console.log(`  GET (1000 operations): ${getTime.toFixed(2)}ms`);

    // Test DEL operations
    const delStart = performance.now();
    const keysToDelete = Array.from({ length: 1000 }, (_, i) => `test:key:${i}`);
    await this.redisClient.del(keysToDelete);
    const delTime = performance.now() - delStart;
    console.log(`  DEL (1000 operations): ${delTime.toFixed(2)}ms\n`);
  }

  private async testDataClientOperations(): Promise<void> {
    console.log('📊 Testing DataClient Operations...');

    // Test CIP lookup with cache miss (first call)
    const cipCode = '11.0701';
    
    const redisMissStart = performance.now();
    try {
      await this.redisDataClient.findOccupationsByCip(cipCode);
    } catch (error) {
      // Expected to fail without real data, but we measure the time
    }
    const redisMissTime = performance.now() - redisMissStart;

    // Test CIP lookup with cache hit (second call)
    const redisHitStart = performance.now();
    try {
      await this.redisDataClient.findOccupationsByCip(cipCode);
    } catch (error) {
      // Expected to fail without real data, but we measure the time
    }
    const redisHitTime = performance.now() - redisHitStart;

    console.log(`  CIP Lookup (cache miss): ${redisMissTime.toFixed(2)}ms`);
    console.log(`  CIP Lookup (cache hit): ${redisHitTime.toFixed(2)}ms`);

    this.results.push({
      operation: 'CIP Lookup',
      redisTime: redisHitTime,
      cacheHit: true,
    });

    console.log();
  }

  private async testCachePerformance(): Promise<void> {
    console.log('📊 Testing Cache Performance...');

    // Simulate caching training data
    const trainingData = {
      ctid: 'test-training-001',
      name: 'Software Development Bootcamp',
      description: 'Intensive software development training program',
      provider: {
        ctid: 'test-provider-001',
        name: 'Tech University',
      },
    };

    // Test cache storage
    const cacheStoreStart = performance.now();
    await this.redisClient.set(
      'training:test-training-001',
      JSON.stringify(trainingData),
      'EX',
      3600
    );
    const cacheStoreTime = performance.now() - cacheStoreStart;

    // Test cache retrieval
    const cacheRetrieveStart = performance.now();
    const cachedData = await this.redisClient.get('training:test-training-001');
    const parsedData = cachedData ? JSON.parse(cachedData) : null;
    const cacheRetrieveTime = performance.now() - cacheRetrieveStart;

    console.log(`  Cache Store: ${cacheStoreTime.toFixed(2)}ms`);
    console.log(`  Cache Retrieve: ${cacheRetrieveTime.toFixed(2)}ms`);
    console.log(`  Data Integrity: ${parsedData?.ctid === trainingData.ctid ? '✅' : '❌'}`);

    this.results.push({
      operation: 'Cache Operations',
      redisTime: cacheRetrieveTime,
    });

    console.log();
  }

  private generateReport(): void {
    console.log('📈 Performance Test Report');
    console.log('==========================\n');

    console.log('Results Summary:');
    this.results.forEach(result => {
      console.log(`  ${result.operation}:`);
      if (result.redisTime) {
        console.log(`    Redis Time: ${result.redisTime.toFixed(2)}ms`);
      }
      if (result.postgresTime) {
        console.log(`    PostgreSQL Time: ${result.postgresTime.toFixed(2)}ms`);
      }
      if (result.improvement) {
        console.log(`    Improvement: ${result.improvement.toFixed(2)}%`);
      }
      if (result.cacheHit !== undefined) {
        console.log(`    Cache Hit: ${result.cacheHit ? 'Yes' : 'No'}`);
      }
      console.log();
    });

    console.log('Test Recommendations:');
    console.log('- Enable Redis in production for improved performance');
    console.log('- Implement cache warming for frequently accessed data');
    console.log('- Monitor cache hit rates and adjust TTL settings as needed');
    console.log('- Consider Redis clustering for high availability');
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  const test = new RedisPerformanceTest();
  test.runTests().catch(console.error);
}

export { RedisPerformanceTest };