import { RedisDataClient } from './RedisDataClient';
import { DataClient } from '../../domain/DataClient';
import { Occupation } from '../../domain/occupations/Occupation';
import { Training } from '../../domain/training/Training';

// Mock dependencies
const mockRedisClient = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
  expire: jest.fn(),
  keys: jest.fn(),
  getClient: jest.fn(() => ({
    sadd: jest.fn(),
    smembers: jest.fn(),
    sinter: jest.fn(),
  })),
};

const mockFallbackClient: jest.Mocked<DataClient> = {
  findOccupationsByCip: jest.fn(),
  findSocDefinitionBySoc: jest.fn(),
  findCipDefinitionBySoc2018: jest.fn(),
  findCipDefinitionByCip: jest.fn(),
  findOutcomeDefinition: jest.fn(),
  find2018OccupationsBySoc2010: jest.fn(),
  find2010OccupationsBySoc2018: jest.fn(),
  findLocalExceptionsBySoc: jest.fn(),
  getLocalExceptionsByCip: jest.fn(),
  getLocalExceptionsBySoc: jest.fn(),
  getOccupationsInDemand: jest.fn(),
  getCIPsInDemand: jest.fn(),
  getEducationTextBySoc: jest.fn(),
  getSalaryEstimateBySoc: jest.fn(),
  getOESOccupationBySoc: jest.fn(),
  getNeighboringOccupations: jest.fn(),
};

describe('RedisDataClient', () => {
  let redisDataClient: RedisDataClient;

  beforeEach(() => {
    jest.clearAllMocks();
    redisDataClient = new RedisDataClient(mockRedisClient, mockFallbackClient);
  });

  describe('Cache Operations', () => {
    it('should cache and retrieve occupation data', async () => {
      const mockOccupations: Occupation[] = [
        { soc: '11-1011', title: 'Chief Executives' },
        { soc: '11-1021', title: 'General and Operations Managers' },
      ];

      // Test cache miss - should fetch from fallback and cache
      mockRedisClient.get.mockResolvedValue(null);
      mockFallbackClient.findOccupationsByCip.mockResolvedValue(mockOccupations);
      mockRedisClient.set.mockResolvedValue('OK');

      const result1 = await redisDataClient.findOccupationsByCip('11.0101');

      expect(mockRedisClient.get).toHaveBeenCalledWith('occupations:cip:11.0101');
      expect(mockFallbackClient.findOccupationsByCip).toHaveBeenCalledWith('11.0101');
      expect(mockRedisClient.set).toHaveBeenCalled();
      expect(result1).toEqual(mockOccupations);

      // Test cache hit - should return cached data without fallback call
      mockRedisClient.get.mockResolvedValue(JSON.stringify(mockOccupations));
      jest.clearAllMocks();

      const result2 = await redisDataClient.findOccupationsByCip('11.0101');

      expect(mockRedisClient.get).toHaveBeenCalledWith('occupations:cip:11.0101');
      expect(mockFallbackClient.findOccupationsByCip).not.toHaveBeenCalled();
      expect(result2).toEqual(mockOccupations);
    });

    it('should handle cache errors gracefully', async () => {
      const mockOccupations: Occupation[] = [
        { soc: '11-1011', title: 'Chief Executives' },
      ];

      // Redis get fails, should still fetch from fallback
      mockRedisClient.get.mockRejectedValue(new Error('Redis error'));
      mockFallbackClient.findOccupationsByCip.mockResolvedValue(mockOccupations);

      const result = await redisDataClient.findOccupationsByCip('11.0101');

      expect(mockFallbackClient.findOccupationsByCip).toHaveBeenCalledWith('11.0101');
      expect(result).toEqual(mockOccupations);
    });

    it('should propagate fallback errors', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      mockFallbackClient.findOccupationsByCip.mockRejectedValue(new Error('Database error'));

      await expect(redisDataClient.findOccupationsByCip('11.0101')).rejects.toThrow('Database error');
    });
  });

  describe('Training Indexing', () => {
    const mockTraining = {
      ctid: 'training-1',
      name: 'Software Development',
      provider: {
        ctid: 'provider-1',
        name: 'Tech University',
        addresses: [{ city: 'Newark' }],
      },
      occupations: [{ soc: '15-1131', title: 'Computer Programmers' }],
    } as Training;

    it('should index training by category', async () => {
      const mockClient = mockRedisClient.getClient();
      mockClient.sadd.mockResolvedValue(1);

      await redisDataClient.indexTrainingByCategory(mockTraining, ['technology', 'programming']);

      expect(mockClient.sadd).toHaveBeenCalledWith('idx:trainings:category:technology', 'training-1');
      expect(mockClient.sadd).toHaveBeenCalledWith('idx:trainings:category:programming', 'training-1');
    });

    it('should index training by location', async () => {
      const mockClient = mockRedisClient.getClient();
      mockClient.sadd.mockResolvedValue(1);

      await redisDataClient.indexTrainingByLocation(mockTraining, ['Newark', 'NJ']);

      expect(mockClient.sadd).toHaveBeenCalledWith('idx:trainings:location:newark', 'training-1');
      expect(mockClient.sadd).toHaveBeenCalledWith('idx:trainings:location:nj', 'training-1');
    });

    it('should index training by keywords', async () => {
      const mockClient = mockRedisClient.getClient();
      mockClient.sadd.mockResolvedValue(1);

      await redisDataClient.indexTrainingByKeywords(mockTraining, ['software', 'development']);

      expect(mockClient.sadd).toHaveBeenCalledWith('idx:trainings:keyword:software', 'training-1');
      expect(mockClient.sadd).toHaveBeenCalledWith('idx:trainings:keyword:development', 'training-1');
    });

    it('should index training by CIP code', async () => {
      const mockClient = mockRedisClient.getClient();
      mockClient.sadd.mockResolvedValue(1);

      await redisDataClient.indexTrainingByCip(mockTraining, ['11.0701']);

      expect(mockClient.sadd).toHaveBeenCalledWith('idx:trainings:cip:11.0701', 'training-1');
    });

    it('should index training by SOC code', async () => {
      const mockClient = mockRedisClient.getClient();
      mockClient.sadd.mockResolvedValue(1);

      await redisDataClient.indexTrainingBySoc(mockTraining, ['15-1131']);

      expect(mockClient.sadd).toHaveBeenCalledWith('idx:trainings:soc:15-1131', 'training-1');
    });

    it('should index training by provider', async () => {
      const mockClient = mockRedisClient.getClient();
      mockClient.sadd.mockResolvedValue(1);

      await redisDataClient.indexTrainingByProvider(mockTraining, 'provider-1');

      expect(mockClient.sadd).toHaveBeenCalledWith('idx:trainings:provider:provider-1', 'training-1');
    });
  });

  describe('Training Search', () => {
    it('should search trainings by category', async () => {
      const mockClient = mockRedisClient.getClient();
      mockClient.smembers.mockResolvedValue(['training-1', 'training-2']);

      const result = await redisDataClient.searchTrainingsByCategory('technology');

      expect(mockClient.smembers).toHaveBeenCalledWith('idx:trainings:category:technology');
      expect(result).toEqual(['training-1', 'training-2']);
    });

    it('should search trainings by location', async () => {
      const mockClient = mockRedisClient.getClient();
      mockClient.smembers.mockResolvedValue(['training-1']);

      const result = await redisDataClient.searchTrainingsByLocation('Newark');

      expect(mockClient.smembers).toHaveBeenCalledWith('idx:trainings:location:newark');
      expect(result).toEqual(['training-1']);
    });

    it('should search trainings by keyword', async () => {
      const mockClient = mockRedisClient.getClient();
      mockClient.smembers.mockResolvedValue(['training-1', 'training-3']);

      const result = await redisDataClient.searchTrainingsByKeyword('programming');

      expect(mockClient.smembers).toHaveBeenCalledWith('idx:trainings:keyword:programming');
      expect(result).toEqual(['training-1', 'training-3']);
    });

    it('should perform combined search with intersection', async () => {
      const mockClient = mockRedisClient.getClient();
      mockClient.sinter.mockResolvedValue(['training-1']);

      const result = await redisDataClient.searchTrainings({
        keywords: ['programming'],
        location: 'Newark',
        category: 'technology',
      });

      expect(mockClient.sinter).toHaveBeenCalledWith(
        'idx:trainings:keyword:programming',
        'idx:trainings:location:newark',
        'idx:trainings:category:technology'
      );
      expect(result).toEqual(['training-1']);
    });

    it('should handle single criteria search', async () => {
      const mockClient = mockRedisClient.getClient();
      mockClient.smembers.mockResolvedValue(['training-1', 'training-2']);

      const result = await redisDataClient.searchTrainings({
        keywords: ['programming'],
      });

      expect(mockClient.smembers).toHaveBeenCalledWith('idx:trainings:keyword:programming');
      expect(result).toEqual(['training-1', 'training-2']);
    });

    it('should return empty array for empty search criteria', async () => {
      const result = await redisDataClient.searchTrainings({});

      expect(result).toEqual([]);
    });
  });

  describe('Training Data Retrieval', () => {
    it('should retrieve training by ID from cache', async () => {
      const mockTraining = { ctid: 'training-1', name: 'Test Training' };
      mockRedisClient.get.mockResolvedValue(JSON.stringify(mockTraining));

      const result = await redisDataClient.getTrainingById('training-1');

      expect(mockRedisClient.get).toHaveBeenCalledWith('training:training-1');
      expect(result).toEqual(mockTraining);
    });

    it('should return null if training not found in cache', async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await redisDataClient.getTrainingById('training-1');

      expect(result).toBeNull();
    });

    it('should retrieve multiple trainings by IDs', async () => {
      const mockTraining1 = { ctid: 'training-1', name: 'Training 1' };
      const mockTraining2 = { ctid: 'training-2', name: 'Training 2' };

      mockRedisClient.get
        .mockResolvedValueOnce(JSON.stringify(mockTraining1))
        .mockResolvedValueOnce(JSON.stringify(mockTraining2))
        .mockResolvedValueOnce(null);

      const result = await redisDataClient.getTrainingsByIds(['training-1', 'training-2', 'training-3']);

      expect(result).toEqual([mockTraining1, mockTraining2]);
      expect(result).toHaveLength(2);
    });
  });

  describe('Error Handling in Search Operations', () => {
    it('should handle search errors gracefully', async () => {
      const mockClient = mockRedisClient.getClient();
      mockClient.smembers.mockRejectedValue(new Error('Redis search error'));

      const result = await redisDataClient.searchTrainingsByCategory('technology');

      expect(result).toEqual([]);
    });

    it('should handle indexing errors gracefully', async () => {
      const mockClient = mockRedisClient.getClient();
      mockClient.sadd.mockRejectedValue(new Error('Redis indexing error'));

      const mockTraining = { ctid: 'training-1', name: 'Test Training' } as Training;

      // Should not throw error
      await expect(
        redisDataClient.indexTrainingByCategory(mockTraining, ['technology'])
      ).resolves.not.toThrow();
    });
  });
});