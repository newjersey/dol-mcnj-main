import { credentialEngineAPI } from '../../credentialengine/CredentialEngineAPI';
import { redisClient } from './redisClient';
import * as Sentry from '@sentry/node';

/**
 * Enhanced caching service for Credential Engine API calls
 * Provides intelligent caching with fallback to direct API calls when Redis is unavailable
 */
export class CredentialEngineCacheService {
  // Cache TTL values (in seconds)
  private readonly SEARCH_RESULTS_TTL = 1800; // 30 minutes for search results
  private readonly RESOURCE_DATA_TTL = 7200; // 2 hours for resource data (changes infrequently)
  private readonly GRAPH_DATA_TTL = 7200; // 2 hours for graph data
  private readonly ENVELOPE_DATA_TTL = 7200; // 2 hours for envelope data

  // Cache key prefixes
  private readonly CACHE_PREFIX = 'ce_api:';
  private readonly SEARCH_PREFIX = `${this.CACHE_PREFIX}search:`;
  private readonly RESOURCE_PREFIX = `${this.CACHE_PREFIX}resource:`;
  private readonly GRAPH_PREFIX = `${this.CACHE_PREFIX}graph:`;
  private readonly ENVELOPE_PREFIX = `${this.CACHE_PREFIX}envelope:`;

  /**
   * Cached version of credentialEngineAPI.getResults
   * Caches search query results with intelligent key generation
   */
  public async getResults(query: object, skip: number, take: number = 10): Promise<any> {
    const cacheKey = this.generateSearchCacheKey(query, skip, take);
    
    try {
      // Try to get from cache first
      const cachedResult = await this.getCachedData(cacheKey);
      if (cachedResult) {
        console.log(`✅ Cache hit for CE search query: ${cacheKey}`);
        return cachedResult;
      }

      // Cache miss - fetch from API
      console.log(`⭕ Cache miss for CE search query: ${cacheKey}`);
      const result = await credentialEngineAPI.getResults(query, skip, take);
      
      // Store in cache
      await this.setCachedData(cacheKey, result, this.SEARCH_RESULTS_TTL);
      
      return result;
    } catch (error) {
      console.error(`Error in cached getResults for key: ${cacheKey}`, error);
      Sentry.captureException(error);
      
      // Fallback to direct API call if caching fails
      return await credentialEngineAPI.getResults(query, skip, take);
    }
  }

  /**
   * Cached version of credentialEngineAPI.getResourceByCTID
   * Caches resource data by CTID with longer TTL since this data changes infrequently
   */
  public async getResourceByCTID(ctid: string): Promise<any> {
    const cacheKey = `${this.RESOURCE_PREFIX}${ctid}`;
    
    try {
      // Try to get from cache first
      const cachedResult = await this.getCachedData(cacheKey);
      if (cachedResult) {
        console.log(`✅ Cache hit for CE resource CTID: ${ctid}`);
        return cachedResult;
      }

      // Cache miss - fetch from API
      console.log(`⭕ Cache miss for CE resource CTID: ${ctid}`);
      const result = await credentialEngineAPI.getResourceByCTID(ctid);
      
      // Store in cache
      await this.setCachedData(cacheKey, result, this.RESOURCE_DATA_TTL);
      
      return result;
    } catch (error) {
      console.error(`Error in cached getResourceByCTID for CTID: ${ctid}`, error);
      Sentry.captureException(error);
      
      // Fallback to direct API call if caching fails
      return await credentialEngineAPI.getResourceByCTID(ctid);
    }
  }

  /**
   * Cached version of credentialEngineAPI.getGraphByCTID
   * Caches graph data by CTID
   */
  public async getGraphByCTID(ctid: string): Promise<any> {
    const cacheKey = `${this.GRAPH_PREFIX}${ctid}`;
    
    try {
      // Try to get from cache first
      const cachedResult = await this.getCachedData(cacheKey);
      if (cachedResult) {
        console.log(`✅ Cache hit for CE graph CTID: ${ctid}`);
        return cachedResult;
      }

      // Cache miss - fetch from API
      console.log(`⭕ Cache miss for CE graph CTID: ${ctid}`);
      const result = await credentialEngineAPI.getGraphByCTID(ctid);
      
      // Store in cache
      await this.setCachedData(cacheKey, result, this.GRAPH_DATA_TTL);
      
      return result;
    } catch (error) {
      console.error(`Error in cached getGraphByCTID for CTID: ${ctid}`, error);
      Sentry.captureException(error);
      
      // Fallback to direct API call if caching fails
      return await credentialEngineAPI.getGraphByCTID(ctid);
    }
  }

  /**
   * Cached version of credentialEngineAPI.getEnvelopeByCTID
   * Caches envelope data by CTID
   */
  public async getEnvelopeByCTID(ctid: string): Promise<any> {
    const cacheKey = `${this.ENVELOPE_PREFIX}${ctid}`;
    
    try {
      // Try to get from cache first
      const cachedResult = await this.getCachedData(cacheKey);
      if (cachedResult) {
        console.log(`✅ Cache hit for CE envelope CTID: ${ctid}`);
        return cachedResult;
      }

      // Cache miss - fetch from API
      console.log(`⭕ Cache miss for CE envelope CTID: ${ctid}`);
      const result = await credentialEngineAPI.getEnvelopeByCTID(ctid);
      
      // Store in cache
      await this.setCachedData(cacheKey, result, this.ENVELOPE_DATA_TTL);
      
      return result;
    } catch (error) {
      console.error(`Error in cached getEnvelopeByCTID for CTID: ${ctid}`, error);
      Sentry.captureException(error);
      
      // Fallback to direct API call if caching fails
      return await credentialEngineAPI.getEnvelopeByCTID(ctid);
    }
  }

  /**
   * Bulk cache warming for frequently accessed resources
   * Pre-loads commonly accessed CTIDs into cache
   */
  public async warmCache(ctids: string[]): Promise<void> {
    console.log(`🔥 Warming credential engine cache for ${ctids.length} CTIDs...`);
    
    const promises = ctids.map(async (ctid) => {
      try {
        // Warm resource cache
        await this.getResourceByCTID(ctid);
        
        // Warm envelope cache
        await this.getEnvelopeByCTID(ctid);
        
        console.log(`✅ Warmed cache for CTID: ${ctid}`);
      } catch (error) {
        console.error(`❌ Failed to warm cache for CTID: ${ctid}`, error);
      }
    });

    await Promise.allSettled(promises);
    console.log(`🔥 Cache warming completed for credential engine data`);
  }

  /**
   * Clear all credential engine cache entries
   * Useful for cache invalidation when needed
   */
  public async clearCache(): Promise<void> {
    try {
      const keys = await redisClient.getClient().keys(`${this.CACHE_PREFIX}*`);
      if (keys.length > 0) {
        await redisClient.getClient().del(...keys);
        console.log(`🗑️ Cleared ${keys.length} credential engine cache entries`);
      }
    } catch (error) {
      console.error('Error clearing credential engine cache:', error);
      Sentry.captureException(error);
    }
  }

  /**
   * Get cache statistics for monitoring
   */
  public async getCacheStats(): Promise<{
    totalKeys: number;
    searchKeys: number;
    resourceKeys: number;
    graphKeys: number;
    envelopeKeys: number;
  }> {
    try {
      const [totalKeys, searchKeys, resourceKeys, graphKeys, envelopeKeys] = await Promise.all([
        redisClient.getClient().keys(`${this.CACHE_PREFIX}*`),
        redisClient.getClient().keys(`${this.SEARCH_PREFIX}*`),
        redisClient.getClient().keys(`${this.RESOURCE_PREFIX}*`),
        redisClient.getClient().keys(`${this.GRAPH_PREFIX}*`),
        redisClient.getClient().keys(`${this.ENVELOPE_PREFIX}*`),
      ]);

      return {
        totalKeys: totalKeys.length,
        searchKeys: searchKeys.length,
        resourceKeys: resourceKeys.length,
        graphKeys: graphKeys.length,
        envelopeKeys: envelopeKeys.length,
      };
    } catch (error) {
      console.error('Error getting credential engine cache stats:', error);
      return {
        totalKeys: 0,
        searchKeys: 0,
        resourceKeys: 0,
        graphKeys: 0,
        envelopeKeys: 0,
      };
    }
  }

  // Private helper methods

  /**
   * Generate a consistent cache key for search queries
   */
  private generateSearchCacheKey(query: object, skip: number, take: number): string {
    // Create a hash of the query object for consistent caching
    const queryString = JSON.stringify(query);
    const queryHash = this.simpleHash(queryString);
    return `${this.SEARCH_PREFIX}${queryHash}_${skip}_${take}`;
  }

  /**
   * Simple hash function for generating consistent cache keys
   */
  private simpleHash(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get data from Redis cache
   */
  private async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to get cached data for key: ${key}`, error);
      return null;
    }
  }

  /**
   * Set data in Redis cache with TTL
   */
  private async setCachedData<T>(key: string, data: T, ttl: number): Promise<void> {
    try {
      await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
    } catch (error) {
      console.error(`Failed to set cached data for key: ${key}`, error);
    }
  }
}

// Export singleton instance
export const credentialEngineCacheService = new CredentialEngineCacheService();