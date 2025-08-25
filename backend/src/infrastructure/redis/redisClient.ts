import Redis, { Cluster } from 'ioredis';
import * as Sentry from '@sentry/node';

export interface RedisConfig {
  host?: string;
  port?: number;
  password?: string;
  tls?: boolean;
  clusterMode?: boolean;
  clusterNodes?: Array<{ host: string; port: number }>;
  retryDelayOnFailover?: number;
  enableReadyCheck?: boolean;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
  keepAlive?: number;
  family?: number;
  keyPrefix?: string;
  db?: number;
}

export class RedisClient {
  private client!: Redis | Cluster;
  private config: RedisConfig;
  private isHealthy = false;
  private connectionAttempts = 0;
  private maxConnectionAttempts = 5;

  constructor(config?: RedisConfig) {
    this.config = {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD,
      tls: process.env.REDIS_TLS === 'true',
      clusterMode: process.env.REDIS_CLUSTER_MODE === 'true',
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      family: 4,
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'mycareernj:',
      db: Number(process.env.REDIS_DB || 0),
      ...config,
    };

    this.initializeClient();
    this.setupEventHandlers();
  }

  private initializeClient(): void {
    try {
      if (this.config.clusterMode && this.config.clusterNodes) {
        // Redis Cluster configuration for high availability
        this.client = new Redis.Cluster(this.config.clusterNodes, {
          redisOptions: {
            password: this.config.password,
            tls: this.config.tls ? {} : undefined,
            enableReadyCheck: this.config.enableReadyCheck,
            maxRetriesPerRequest: this.config.maxRetriesPerRequest,
            lazyConnect: this.config.lazyConnect,
            keepAlive: this.config.keepAlive,
            family: this.config.family,
            keyPrefix: this.config.keyPrefix,
          },
        });
      } else {
        // Single Redis instance configuration
        this.client = new Redis({
          host: this.config.host,
          port: this.config.port,
          password: this.config.password,
          tls: this.config.tls ? {} : undefined,
          enableReadyCheck: this.config.enableReadyCheck,
          maxRetriesPerRequest: this.config.maxRetriesPerRequest,
          lazyConnect: this.config.lazyConnect,
          keepAlive: this.config.keepAlive,
          family: this.config.family,
          keyPrefix: this.config.keyPrefix,
          db: this.config.db,
        });
      }
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      Sentry.captureException(error);
      throw error;
    }
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      console.log('Redis client connected');
      this.connectionAttempts = 0;
    });

    this.client.on('ready', () => {
      console.log('Redis client ready');
      this.isHealthy = true;
    });

    this.client.on('error', (error) => {
      console.error('Redis client error:', error);
      this.isHealthy = false;
      Sentry.captureException(error);
      
      this.connectionAttempts++;
      if (this.connectionAttempts >= this.maxConnectionAttempts) {
        console.error(`Max Redis connection attempts (${this.maxConnectionAttempts}) reached`);
      }
    });

    this.client.on('close', () => {
      console.log('Redis client connection closed');
      this.isHealthy = false;
    });

    this.client.on('reconnecting', () => {
      console.log('Redis client reconnecting...');
      this.isHealthy = false;
    });

    this.client.on('end', () => {
      console.log('Redis client connection ended');
      this.isHealthy = false;
    });
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log('Redis client connected successfully');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
      console.log('Redis client disconnected successfully');
    } catch (error) {
      console.error('Failed to disconnect Redis client:', error);
      Sentry.captureException(error);
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      this.isHealthy = result === 'PONG';
      return this.isHealthy;
    } catch (error) {
      console.error('Redis health check failed:', error);
      this.isHealthy = false;
      return false;
    }
  }

  public getStatus(): { isHealthy: boolean; connectionAttempts: number } {
    return {
      isHealthy: this.isHealthy,
      connectionAttempts: this.connectionAttempts,
    };
  }

  public getClient(): Redis | Cluster {
    return this.client;
  }

  // Wrapper methods with error handling and fallback
  public async get(key: string): Promise<string | null> {
    try {
      if (!this.isHealthy) {
        await this.healthCheck();
      }
      return await this.client.get(key);
    } catch (error) {
      console.error(`Redis GET operation failed for key: ${key}`, error);
      Sentry.captureException(error);
      return null;
    }
  }

  public async set(key: string, value: string, expireMode?: 'EX' | 'PX', duration?: number): Promise<'OK' | null> {
    try {
      if (!this.isHealthy) {
        await this.healthCheck();
      }
      
      if (expireMode === 'EX' && duration) {
        return await this.client.setex(key, duration, value);
      } else if (expireMode === 'PX' && duration) {
        return await this.client.psetex(key, duration, value);
      }
      return await this.client.set(key, value);
    } catch (error) {
      console.error(`Redis SET operation failed for key: ${key}`, error);
      Sentry.captureException(error);
      return null;
    }
  }

  public async del(keys: string | string[]): Promise<number> {
    try {
      if (!this.isHealthy) {
        await this.healthCheck();
      }
      if (Array.isArray(keys)) {
        return await this.client.del(...keys);
      } else {
        return await this.client.del(keys);
      }
    } catch (error) {
      console.error(`Redis DEL operation failed for key(s): ${keys}`, error);
      Sentry.captureException(error);
      return 0;
    }
  }

  public async exists(key: string): Promise<number> {
    try {
      if (!this.isHealthy) {
        await this.healthCheck();
      }
      return await this.client.exists(key);
    } catch (error) {
      console.error(`Redis EXISTS operation failed for key: ${key}`, error);
      Sentry.captureException(error);
      return 0;
    }
  }

  public async expire(key: string, seconds: number): Promise<number> {
    try {
      if (!this.isHealthy) {
        await this.healthCheck();
      }
      return await this.client.expire(key, seconds);
    } catch (error) {
      console.error(`Redis EXPIRE operation failed for key: ${key}`, error);
      Sentry.captureException(error);
      return 0;
    }
  }

  public async keys(pattern: string): Promise<string[]> {
    try {
      if (!this.isHealthy) {
        await this.healthCheck();
      }
      return await this.client.keys(pattern);
    } catch (error) {
      console.error(`Redis KEYS operation failed for pattern: ${pattern}`, error);
      Sentry.captureException(error);
      return [];
    }
  }
}

// Create and export a singleton instance
const redisClient = new RedisClient();

// Export both the class and the singleton instance
export { redisClient };
export default redisClient.getClient();
