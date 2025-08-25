import { DataClient } from '../../domain/DataClient';
import { RedisDataClient } from './RedisDataClient';
import { FindTrainingsBy } from '../../domain/types';
import { Selector } from '../../domain/training/Selector';
import * as Sentry from '@sentry/node';

export interface CacheWarmingConfig {
  batchSize: number;
  delayBetweenBatches: number;
  criticalDataTTL: number;
  enableAutoWarming: boolean;
  warmingSchedule: string; // cron-like schedule
}

export class CacheWarmingService {
  private redisDataClient: RedisDataClient;
  private postgresDataClient: DataClient;
  private findTrainingsBy: FindTrainingsBy;
  private config: CacheWarmingConfig;
  private isWarming = false;

  constructor(
    redisDataClient: RedisDataClient,
    postgresDataClient: DataClient,
    findTrainingsBy: FindTrainingsBy,
    config?: Partial<CacheWarmingConfig>
  ) {
    this.redisDataClient = redisDataClient;
    this.postgresDataClient = postgresDataClient;
    this.findTrainingsBy = findTrainingsBy;
    this.config = {
      batchSize: 100,
      delayBetweenBatches: 1000, // 1 second
      criticalDataTTL: 7200, // 2 hours
      enableAutoWarming: false,
      warmingSchedule: '0 2 * * *', // Daily at 2 AM
      ...config,
    };
  }

  public async warmCriticalData(): Promise<void> {
    if (this.isWarming) {
      console.log('Cache warming already in progress, skipping...');
      return;
    }

    this.isWarming = true;
    console.log('Starting cache warming for critical data...');

    try {
      await Promise.all([
        this.warmInDemandData(),
        this.warmCipDefinitions(),
        this.warmLocalExceptions(),
        this.warmOccupationData(),
      ]);

      console.log('Cache warming for critical data completed successfully');
    } catch (error) {
      console.error('Cache warming failed:', error);
      Sentry.captureException(error);
    } finally {
      this.isWarming = false;
    }
  }

  private async warmInDemandData(): Promise<void> {
    try {
      console.log('Warming in-demand occupations and CIPs...');
      
      // Warm in-demand occupations
      await this.redisDataClient.getOccupationsInDemand();
      
      // Warm in-demand CIPs
      await this.redisDataClient.getCIPsInDemand();
      
      console.log('In-demand data warmed successfully');
    } catch (error) {
      console.error('Failed to warm in-demand data:', error);
      Sentry.captureException(error);
    }
  }

  private async warmCipDefinitions(): Promise<void> {
    try {
      console.log('Warming CIP definitions...');
      
      // Get all in-demand CIPs first
      const inDemandCIPs = await this.postgresDataClient.getCIPsInDemand();
      
      // Warm CIP definitions for in-demand programs
      for (const cip of inDemandCIPs) {
        if (cip.cipcode) {
          await this.redisDataClient.findCipDefinitionByCip(cip.cipcode);
          await this.redisDataClient.findOccupationsByCip(cip.cipcode);
        }
      }
      
      console.log(`Warmed ${inDemandCIPs.length} CIP definitions`);
    } catch (error) {
      console.error('Failed to warm CIP definitions:', error);
      Sentry.captureException(error);
    }
  }

  private async warmLocalExceptions(): Promise<void> {
    try {
      console.log('Warming local exceptions...');
      
      // Warm local exceptions data
      await this.redisDataClient.getLocalExceptionsByCip();
      await this.redisDataClient.getLocalExceptionsBySoc();
      
      console.log('Local exceptions warmed successfully');
    } catch (error) {
      console.error('Failed to warm local exceptions:', error);
      Sentry.captureException(error);
    }
  }

  private async warmOccupationData(): Promise<void> {
    try {
      console.log('Warming occupation data...');
      
      // Get in-demand occupations
      const inDemandOccupations = await this.postgresDataClient.getOccupationsInDemand();
      
      // Warm occupation-related data
      for (const occupation of inDemandOccupations) {
        if (occupation.soc) {
          await Promise.all([
            this.redisDataClient.findSocDefinitionBySoc(occupation.soc),
            this.redisDataClient.getEducationTextBySoc(occupation.soc),
            this.redisDataClient.getSalaryEstimateBySoc(occupation.soc),
            this.redisDataClient.getOESOccupationBySoc(occupation.soc),
            this.redisDataClient.getNeighboringOccupations(occupation.soc),
          ]);
        }
      }
      
      console.log(`Warmed data for ${inDemandOccupations.length} occupations`);
    } catch (error) {
      console.error('Failed to warm occupation data:', error);
      Sentry.captureException(error);
    }
  }

  public async warmTrainingData(trainingIds?: string[]): Promise<void> {
    if (this.isWarming) {
      console.log('Cache warming already in progress, skipping training data warming...');
      return;
    }

    try {
      console.log('Starting training data cache warming...');
      
      let idsToWarm: string[] = [];
      
      if (trainingIds && trainingIds.length > 0) {
        idsToWarm = trainingIds;
      } else {
        // If no specific IDs provided, we would need to get popular/recent training IDs
        // For now, we'll skip this and only warm when specific IDs are provided
        console.log('No training IDs provided for warming');
        return;
      }

      // Process in batches
      for (let i = 0; i < idsToWarm.length; i += this.config.batchSize) {
        const batch = idsToWarm.slice(i, i + this.config.batchSize);
        
        try {
          // Get training data and cache it
          const trainings = await this.findTrainingsBy(Selector.ID, batch);
          
          for (const training of trainings) {
            // Index training data in Redis
            const categories = []; // Would extract from training data
            const locations: string[] = [];
            
            // Get locations from availableAt addresses
            if (training.availableAt && training.availableAt.length > 0) {
              training.availableAt.forEach(address => {
                if (address.city) locations.push(address.city);
                if (address.county) locations.push(address.county);
                if (address.state) locations.push(address.state);
              });
            }
            
            const keywords = training.name ? training.name.split(' ') : [];
            const cipCodes = training.cipDefinition?.cipcode ? [training.cipDefinition.cipcode] : [];
            const socCodes = training.occupations?.map(o => o.soc) || [];
            const providerId = training.provider?.ctid || '';

            await Promise.all([
              this.redisDataClient.indexTrainingByCategory(training, categories),
              this.redisDataClient.indexTrainingByLocation(training, locations),
              this.redisDataClient.indexTrainingByKeywords(training, keywords),
              this.redisDataClient.indexTrainingByCip(training, cipCodes),
              this.redisDataClient.indexTrainingBySoc(training, socCodes),
              providerId ? this.redisDataClient.indexTrainingByProvider(training, providerId) : Promise.resolve(),
            ]);
          }
          
          console.log(`Warmed batch of ${batch.length} trainings (${i + batch.length}/${idsToWarm.length})`);
          
          // Delay between batches to avoid overwhelming the system
          if (i + this.config.batchSize < idsToWarm.length) {
            await new Promise(resolve => setTimeout(resolve, this.config.delayBetweenBatches));
          }
        } catch (error) {
          console.error(`Failed to warm training batch starting at index ${i}:`, error);
          Sentry.captureException(error);
        }
      }
      
      console.log(`Completed training data warming for ${idsToWarm.length} trainings`);
    } catch (error) {
      console.error('Training data cache warming failed:', error);
      Sentry.captureException(error);
    }
  }

  public async warmSearchData(popularQueries: string[]): Promise<void> {
    try {
      console.log('Warming search data for popular queries...');
      
      for (const query of popularQueries) {
        try {
          // Pre-warm common search combinations
          const searchQueries = [
            { keywords: [query] },
            { keywords: [query], location: 'Newark' },
            { keywords: [query], location: 'Jersey City' },
            { keywords: [query], location: 'Paterson' },
            { keywords: [query], location: 'Elizabeth' },
          ];

          for (const searchQuery of searchQueries) {
            await this.redisDataClient.searchTrainings(searchQuery);
          }
          
          // Add delay between queries
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Failed to warm search data for query: ${query}`, error);
        }
      }
      
      console.log(`Warmed search data for ${popularQueries.length} popular queries`);
    } catch (error) {
      console.error('Search data cache warming failed:', error);
      Sentry.captureException(error);
    }
  }

  public getWarmingStatus(): { isWarming: boolean; config: CacheWarmingConfig } {
    return {
      isWarming: this.isWarming,
      config: this.config,
    };
  }

  public async scheduleWarming(): Promise<void> {
    if (!this.config.enableAutoWarming) {
      console.log('Auto cache warming is disabled');
      return;
    }

    console.log(`Scheduling cache warming with schedule: ${this.config.warmingSchedule}`);
    
    // In a production environment, you would integrate with a job scheduler like node-cron
    // For now, we'll just set up a simple interval
    setInterval(async () => {
      try {
        await this.warmCriticalData();
      } catch (error) {
        console.error('Scheduled cache warming failed:', error);
        Sentry.captureException(error);
      }
    }, 24 * 60 * 60 * 1000); // Run daily
  }

  public async clearCache(pattern?: string): Promise<void> {
    try {
      const keysToDelete = pattern 
        ? await this.redisDataClient['redisClient'].keys(pattern)
        : await this.redisDataClient['redisClient'].keys('*');
      
      if (keysToDelete.length > 0) {
        await this.redisDataClient['redisClient'].del(...keysToDelete);
        console.log(`Cleared ${keysToDelete.length} cache keys`);
      } else {
        console.log('No cache keys found to clear');
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
      Sentry.captureException(error);
    }
  }
}