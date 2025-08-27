import { DataClient } from '../../domain/DataClient';
import { Training } from '../../domain/training/Training';
import {
  LocalException,
  SocDefinition,
  CipDefinition,
  EducationText,
  SalaryEstimate,
  NullableOccupation,
  OutcomeDefinition,
} from '../../domain/training/Program';
import { Occupation } from '../../domain/occupations/Occupation';
import * as Sentry from '@sentry/node';

export interface RedisIndexConfig {
  trainingsByCategory: string;
  trainingsByLocation: string;
  trainingsByKeyword: string;
  trainingsByCip: string;
  trainingsBySoc: string;
  trainingsByProvider: string;
  searchIndex: string;
  programDetails: string;
}

export class RedisDataClient implements DataClient {
  private redisClient: RedisClient;
  private fallbackClient: DataClient;
  private indexes: RedisIndexConfig;
  private defaultTTL = 3600; // 1 hour
  private searchCacheTTL = 900; // 15 minutes

  constructor(redisClient: RedisClient, fallbackClient: DataClient) {
    this.redisClient = redisClient;
    this.fallbackClient = fallbackClient;
    this.indexes = {
      trainingsByCategory: 'idx:trainings:category:',
      trainingsByLocation: 'idx:trainings:location:',
      trainingsByKeyword: 'idx:trainings:keyword:',
      trainingsByCip: 'idx:trainings:cip:',
      trainingsBySoc: 'idx:trainings:soc:',
      trainingsByProvider: 'idx:trainings:provider:',
      searchIndex: 'idx:search:',
      programDetails: 'program:',
    };
  }

  // Helper methods for Redis operations
  private async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to get cached data for key: ${key}`, error);
      Sentry.captureException(error);
      return null;
    }
  }

  private async setCachedData<T>(key: string, data: T, ttl: number = this.defaultTTL): Promise<void> {
    try {
      await this.redisClient.set(key, JSON.stringify(data), 'EX', ttl);
    } catch (error) {
      console.error(`Failed to set cached data for key: ${key}`, error);
      Sentry.captureException(error);
    }
  }

  // Training indexing methods
  public async indexTrainingByCategory(training: Training, categories: string[]): Promise<void> {
    try {
      const trainingId = training.ctid || '';
      if (!trainingId) {
        console.warn('Training has no ctid, skipping indexing');
        return;
      }
      
      for (const category of categories) {
        const key = `${this.indexes.trainingsByCategory}${category.toLowerCase()}`;
        await this.redisClient.getClient().sadd(key, trainingId);
        await this.redisClient.expire(key, this.defaultTTL);
      }
      
      // Store full training data
      await this.setCachedData(`training:${trainingId}`, training);
    } catch (error) {
      console.error('Failed to index training by category:', error);
      Sentry.captureException(error);
    }
  }

  public async indexTrainingByLocation(training: Training, locations: string[]): Promise<void> {
    try {
      const trainingId = training.ctid || '';
      if (!trainingId) {
        console.warn('Training has no ctid, skipping indexing');
        return;
      }
      
      for (const location of locations) {
        const key = `${this.indexes.trainingsByLocation}${location.toLowerCase()}`;
        await this.redisClient.getClient().sadd(key, trainingId);
        await this.redisClient.expire(key, this.defaultTTL);
      }
    } catch (error) {
      console.error('Failed to index training by location:', error);
      Sentry.captureException(error);
    }
  }

  public async indexTrainingByKeywords(training: Training, keywords: string[]): Promise<void> {
    try {
      const trainingId = training.ctid || '';
      if (!trainingId) {
        console.warn('Training has no ctid, skipping indexing');
        return;
      }
      
      for (const keyword of keywords) {
        const key = `${this.indexes.trainingsByKeyword}${keyword.toLowerCase()}`;
        await this.redisClient.getClient().sadd(key, trainingId);
        await this.redisClient.expire(key, this.defaultTTL);
      }
    } catch (error) {
      console.error('Failed to index training by keywords:', error);
      Sentry.captureException(error);
    }
  }

  public async indexTrainingByCip(training: Training, cipCodes: string[]): Promise<void> {
    try {
      const trainingId = training.ctid || '';
      if (!trainingId) {
        console.warn('Training has no ctid, skipping indexing');
        return;
      }
      
      for (const cipCode of cipCodes) {
        const key = `${this.indexes.trainingsByCip}${cipCode}`;
        await this.redisClient.getClient().sadd(key, trainingId);
        await this.redisClient.expire(key, this.defaultTTL);
      }
    } catch (error) {
      console.error('Failed to index training by CIP codes:', error);
      Sentry.captureException(error);
    }
  }

  public async indexTrainingBySoc(training: Training, socCodes: string[]): Promise<void> {
    try {
      const trainingId = training.ctid || '';
      if (!trainingId) {
        console.warn('Training has no ctid, skipping indexing');
        return;
      }
      
      for (const socCode of socCodes) {
        const key = `${this.indexes.trainingsBySoc}${socCode}`;
        await this.redisClient.getClient().sadd(key, trainingId);
        await this.redisClient.expire(key, this.defaultTTL);
      }
    } catch (error) {
      console.error('Failed to index training by SOC codes:', error);
      Sentry.captureException(error);
    }
  }

  public async indexTrainingByProvider(training: Training, providerId: string): Promise<void> {
    try {
      const trainingId = training.ctid || '';
      if (!trainingId) {
        console.warn('Training has no ctid, skipping indexing');
        return;
      }
      
      const key = `${this.indexes.trainingsByProvider}${providerId}`;
      await this.redisClient.getClient().sadd(key, trainingId);
      await this.redisClient.expire(key, this.defaultTTL);
    } catch (error) {
      console.error('Failed to index training by provider:', error);
      Sentry.captureException(error);
    }
  }

  // Search methods using Redis indexes
  public async searchTrainingsByCategory(category: string): Promise<string[]> {
    try {
      const key = `${this.indexes.trainingsByCategory}${category.toLowerCase()}`;
      return await this.redisClient.getClient().smembers(key);
    } catch (error) {
      console.error(`Failed to search trainings by category: ${category}`, error);
      Sentry.captureException(error);
      return [];
    }
  }

  public async searchTrainingsByLocation(location: string): Promise<string[]> {
    try {
      const key = `${this.indexes.trainingsByLocation}${location.toLowerCase()}`;
      return await this.redisClient.getClient().smembers(key);
    } catch (error) {
      console.error(`Failed to search trainings by location: ${location}`, error);
      Sentry.captureException(error);
      return [];
    }
  }

  public async searchTrainingsByKeyword(keyword: string): Promise<string[]> {
    try {
      const key = `${this.indexes.trainingsByKeyword}${keyword.toLowerCase()}`;
      return await this.redisClient.getClient().smembers(key);
    } catch (error) {
      console.error(`Failed to search trainings by keyword: ${keyword}`, error);
      Sentry.captureException(error);
      return [];
    }
  }

  public async searchTrainingsByCip(cipCode: string): Promise<string[]> {
    try {
      const key = `${this.indexes.trainingsByCip}${cipCode}`;
      return await this.redisClient.getClient().smembers(key);
    } catch (error) {
      console.error(`Failed to search trainings by CIP code: ${cipCode}`, error);
      Sentry.captureException(error);
      return [];
    }
  }

  public async searchTrainingsBySoc(socCode: string): Promise<string[]> {
    try {
      const key = `${this.indexes.trainingsBySoc}${socCode}`;
      return await this.redisClient.getClient().smembers(key);
    } catch (error) {
      console.error(`Failed to search trainings by SOC code: ${socCode}`, error);
      Sentry.captureException(error);
      return [];
    }
  }

  public async searchTrainingsByProvider(providerId: string): Promise<string[]> {
    try {
      const key = `${this.indexes.trainingsByProvider}${providerId}`;
      return await this.redisClient.getClient().smembers(key);
    } catch (error) {
      console.error(`Failed to search trainings by provider: ${providerId}`, error);
      Sentry.captureException(error);
      return [];
    }
  }

  // Training data retrieval
  public async getTrainingById(ctid: string): Promise<Training | null> {
    try {
      const cached = await this.getCachedData<Training>(`training:${ctid}`);
      if (cached) {
        return cached;
      }
      
      // Fallback to primary data source
      console.log(`Training ${ctid} not found in cache, falling back to primary data source`);
      return null;
    } catch (error) {
      console.error(`Failed to get training by ID: ${ctid}`, error);
      Sentry.captureException(error);
      return null;
    }
  }

  public async getTrainingsByIds(ctids: string[]): Promise<Training[]> {
    try {
      const trainings: Training[] = [];
      const missingIds: string[] = [];

      // Try to get from Redis first
      for (const ctid of ctids) {
        const training = await this.getTrainingById(ctid);
        if (training) {
          trainings.push(training);
        } else {
          missingIds.push(ctid);
        }
      }

      // If we have missing trainings, we would need to fetch from primary source
      // For now, return what we found in Redis
      return trainings;
    } catch (error) {
      console.error('Failed to get trainings by IDs:', error);
      Sentry.captureException(error);
      return [];
    }
  }

  // Combined search method
  public async searchTrainings(query: {
    keywords?: string[];
    category?: string;
    location?: string;
    cipCode?: string;
    socCode?: string;
    providerId?: string;
  }): Promise<string[]> {
    try {
      const searchKeys: string[] = [];

      if (query.keywords) {
        for (const keyword of query.keywords) {
          searchKeys.push(`${this.indexes.trainingsByKeyword}${keyword.toLowerCase()}`);
        }
      }

      if (query.category) {
        searchKeys.push(`${this.indexes.trainingsByCategory}${query.category.toLowerCase()}`);
      }

      if (query.location) {
        searchKeys.push(`${this.indexes.trainingsByLocation}${query.location.toLowerCase()}`);
      }

      if (query.cipCode) {
        searchKeys.push(`${this.indexes.trainingsByCip}${query.cipCode}`);
      }

      if (query.socCode) {
        searchKeys.push(`${this.indexes.trainingsBySoc}${query.socCode}`);
      }

      if (query.providerId) {
        searchKeys.push(`${this.indexes.trainingsByProvider}${query.providerId}`);
      }

      if (searchKeys.length === 0) {
        return [];
      }

      // Use SINTER to find intersection of all search criteria
      if (searchKeys.length === 1) {
        return await this.redisClient.getClient().smembers(searchKeys[0]);
      } else {
        return await this.redisClient.getClient().sinter(...searchKeys);
      }
    } catch (error) {
      console.error('Failed to search trainings:', error);
      Sentry.captureException(error);
      return [];
    }
  }

  // DataClient interface implementation with Redis caching and fallback
  public async findOccupationsByCip(cip: string): Promise<Occupation[]> {
    const key = `occupations:cip:${cip}`;
    
    try {
      const cached = await this.getCachedData<Occupation[]>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error(`Redis cache miss for findOccupationsByCip: ${cip}`, error);
    }

    // Fallback to primary data source
    try {
      const result = await this.fallbackClient.findOccupationsByCip(cip);
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error(`Fallback failed for findOccupationsByCip: ${cip}`, error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async findSocDefinitionBySoc(soc: string): Promise<SocDefinition> {
    const key = `soc:definition:${soc}`;
    
    try {
      const cached = await this.getCachedData<SocDefinition>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error(`Redis cache miss for findSocDefinitionBySoc: ${soc}`, error);
    }

    try {
      const result = await this.fallbackClient.findSocDefinitionBySoc(soc);
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error(`Fallback failed for findSocDefinitionBySoc: ${soc}`, error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async findCipDefinitionBySoc2018(soc: string): Promise<CipDefinition[]> {
    const key = `cip:definition:soc2018:${soc}`;
    
    try {
      const cached = await this.getCachedData<CipDefinition[]>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error(`Redis cache miss for findCipDefinitionBySoc2018: ${soc}`, error);
    }

    try {
      const result = await this.fallbackClient.findCipDefinitionBySoc2018(soc);
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error(`Fallback failed for findCipDefinitionBySoc2018: ${soc}`, error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async findCipDefinitionByCip(cip: string): Promise<CipDefinition[]> {
    const key = `cip:definition:${cip}`;
    
    try {
      const cached = await this.getCachedData<CipDefinition[]>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error(`Redis cache miss for findCipDefinitionByCip: ${cip}`, error);
    }

    try {
      const result = await this.fallbackClient.findCipDefinitionByCip(cip);
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error(`Fallback failed for findCipDefinitionByCip: ${cip}`, error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async findOutcomeDefinition(cip: string, providerId: string): Promise<OutcomeDefinition> {
    const key = `outcome:${cip}:${providerId}`;
    
    try {
      const cached = await this.getCachedData<OutcomeDefinition>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error(`Redis cache miss for findOutcomeDefinition: ${cip}, ${providerId}`, error);
    }

    try {
      const result = await this.fallbackClient.findOutcomeDefinition(cip, providerId);
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error(`Fallback failed for findOutcomeDefinition: ${cip}, ${providerId}`, error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async find2018OccupationsBySoc2010(soc2010: string): Promise<Occupation[]> {
    const key = `occupations:2018:soc2010:${soc2010}`;
    
    try {
      const cached = await this.getCachedData<Occupation[]>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error(`Redis cache miss for find2018OccupationsBySoc2010: ${soc2010}`, error);
    }

    try {
      const result = await this.fallbackClient.find2018OccupationsBySoc2010(soc2010);
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error(`Fallback failed for find2018OccupationsBySoc2010: ${soc2010}`, error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async find2010OccupationsBySoc2018(soc2018: string): Promise<Occupation[]> {
    const key = `occupations:2010:soc2018:${soc2018}`;
    
    try {
      const cached = await this.getCachedData<Occupation[]>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error(`Redis cache miss for find2010OccupationsBySoc2018: ${soc2018}`, error);
    }

    try {
      const result = await this.fallbackClient.find2010OccupationsBySoc2018(soc2018);
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error(`Fallback failed for find2010OccupationsBySoc2018: ${soc2018}`, error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async findLocalExceptionsBySoc(soc: string): Promise<LocalException[]> {
    const key = `localexceptions:soc:${soc}`;
    
    try {
      const cached = await this.getCachedData<LocalException[]>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error(`Redis cache miss for findLocalExceptionsBySoc: ${soc}`, error);
    }

    try {
      const result = await this.fallbackClient.findLocalExceptionsBySoc(soc);
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error(`Fallback failed for findLocalExceptionsBySoc: ${soc}`, error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async getLocalExceptionsByCip(): Promise<LocalException[]> {
    const key = 'localexceptions:cip:all';
    
    try {
      const cached = await this.getCachedData<LocalException[]>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error('Redis cache miss for getLocalExceptionsByCip', error);
    }

    try {
      const result = await this.fallbackClient.getLocalExceptionsByCip();
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error('Fallback failed for getLocalExceptionsByCip', error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async getLocalExceptionsBySoc(): Promise<LocalException[]> {
    const key = 'localexceptions:soc:all';
    
    try {
      const cached = await this.getCachedData<LocalException[]>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error('Redis cache miss for getLocalExceptionsBySoc', error);
    }

    try {
      const result = await this.fallbackClient.getLocalExceptionsBySoc();
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error('Fallback failed for getLocalExceptionsBySoc', error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async getOccupationsInDemand(): Promise<NullableOccupation[]> {
    const key = 'occupations:indemand';
    
    try {
      const cached = await this.getCachedData<NullableOccupation[]>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error('Redis cache miss for getOccupationsInDemand', error);
    }

    try {
      const result = await this.fallbackClient.getOccupationsInDemand();
      await this.setCachedData(key, result, 1800); // Cache for 30 minutes
      return result;
    } catch (error) {
      console.error('Fallback failed for getOccupationsInDemand', error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async getCIPsInDemand(): Promise<CipDefinition[]> {
    const key = 'cips:indemand';
    
    try {
      const cached = await this.getCachedData<CipDefinition[]>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error('Redis cache miss for getCIPsInDemand', error);
    }

    try {
      const result = await this.fallbackClient.getCIPsInDemand();
      await this.setCachedData(key, result, 1800); // Cache for 30 minutes
      return result;
    } catch (error) {
      console.error('Fallback failed for getCIPsInDemand', error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async getEducationTextBySoc(soc: string): Promise<EducationText> {
    const key = `education:soc:${soc}`;
    
    try {
      const cached = await this.getCachedData<EducationText>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error(`Redis cache miss for getEducationTextBySoc: ${soc}`, error);
    }

    try {
      const result = await this.fallbackClient.getEducationTextBySoc(soc);
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error(`Fallback failed for getEducationTextBySoc: ${soc}`, error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async getSalaryEstimateBySoc(soc: string): Promise<SalaryEstimate> {
    const key = `salary:soc:${soc}`;
    
    try {
      const cached = await this.getCachedData<SalaryEstimate>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error(`Redis cache miss for getSalaryEstimateBySoc: ${soc}`, error);
    }

    try {
      const result = await this.fallbackClient.getSalaryEstimateBySoc(soc);
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error(`Fallback failed for getSalaryEstimateBySoc: ${soc}`, error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async getOESOccupationBySoc(soc: string): Promise<Occupation> {
    const key = `oes:occupation:soc:${soc}`;
    
    try {
      const cached = await this.getCachedData<Occupation>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error(`Redis cache miss for getOESOccupationBySoc: ${soc}`, error);
    }

    try {
      const result = await this.fallbackClient.getOESOccupationBySoc(soc);
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error(`Fallback failed for getOESOccupationBySoc: ${soc}`, error);
      Sentry.captureException(error);
      throw error;
    }
  }

  public async getNeighboringOccupations(soc: string): Promise<Occupation[]> {
    const key = `occupations:neighboring:${soc}`;
    
    try {
      const cached = await this.getCachedData<Occupation[]>(key);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error(`Redis cache miss for getNeighboringOccupations: ${soc}`, error);
    }

    try {
      const result = await this.fallbackClient.getNeighboringOccupations(soc);
      await this.setCachedData(key, result);
      return result;
    } catch (error) {
      console.error(`Fallback failed for getNeighboringOccupations: ${soc}`, error);
      Sentry.captureException(error);
      throw error;
    }
  }
}