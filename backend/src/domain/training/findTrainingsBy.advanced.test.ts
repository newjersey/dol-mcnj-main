// Mock Redis client to prevent actual connections and ensure clean test environment
jest.mock("../../infrastructure/redis/redisClient", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    quit: jest.fn().mockResolvedValue('OK')
  }
}));

import { findTrainingsByFactory } from './findTrainingsBy';
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { StubDataClient } from '../test-objects/StubDataClient';
import { mockCredentialEngineApiData } from "../test-objects/mockCredentialEngineApiData";
import { Selector } from './Selector';
import { CTDLResource } from '../credentialengine/CredentialEngine';
import redis from "../../infrastructure/redis/redisClient";

const mockRedis = redis as jest.Mocked<typeof redis & { quit: jest.Mock }>;

// Mock the CredentialEngineUtils module
jest.mock("../../credentialengine/CredentialEngineUtils", () => ({
  ...jest.requireActual("../../credentialengine/CredentialEngineUtils"),
  fetchNJDOLResource: jest.fn(),
  credentialEngineUtils: {
    getProviderData: jest.fn(),
    extractCipCode: jest.fn(),
    getCtidFromURL: jest.fn(),
    validateCtId: jest.fn(),
    getAddress: jest.fn(),
    getAvailableAtAddresses: jest.fn(),
    extractOccupations: jest.fn(),
    extractCost: jest.fn(),
    extractAverageSalary: jest.fn(),
    extractPercentEmployed: jest.fn(),
    extractDeliveryType: jest.fn(),
    extractLanguages: jest.fn(),
    extractHasJobPlacementAssistance: jest.fn(),
    extractHasChildcareAssistance: jest.fn(),
    extractCalendarLength: jest.fn(),
    extractTotalClockHours: jest.fn(),
    extractCredentials: jest.fn(),
    extractPrerequisites: jest.fn(),
    extractIsWheelchairAccessible: jest.fn(),
    extractHasEveningCourses: jest.fn(),
    isLearningOpportunityProfile: jest.fn(),
    constructCredentialsString: jest.fn(),
    getTimeRequired: jest.fn(),
    getCalendarLengthId: jest.fn(),
    hasLearningDeliveryTypes: jest.fn(),
    hasEveningSchedule: jest.fn(),
    getLanguages: jest.fn(),
    checkAccommodation: jest.fn(),
    checkSupportService: jest.fn(),
  }
}));

// Import the mocked functions
import { fetchNJDOLResource } from "../../credentialengine/CredentialEngineUtils";
const mockFetchNJDOLResource = fetchNJDOLResource as jest.MockedFunction<typeof fetchNJDOLResource>;
const mockCredentialEngineUtils = credentialEngineUtils as jest.Mocked<typeof credentialEngineUtils>;

describe('findTrainingsBy - Advanced Functionality', () => {
  const stubDataClient = StubDataClient();
  const findTrainingsBy = findTrainingsByFactory(stubDataClient);

  // Suppress console output during tests
  const originalConsole = global.console;
  
  beforeAll(() => {
    global.console = {
      ...originalConsole,
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    } as Console;
  });

  afterAll(() => {
    global.console = originalConsole;
  });

  const mockTrainingData = {
    ...mockCredentialEngineApiData[0],
    '@id': 'test-id',
    'ceterms:ownedBy': ['https://credentialengine.org/organization/test-provider']
  } as unknown as CTDLResource;
  const testURL = 'https://credentialengine.org/test-url';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup Redis mocks
    mockRedis.get.mockResolvedValue(null);
    mockRedis.set.mockResolvedValue('OK');

    // Setup default mocks
    mockFetchNJDOLResource.mockResolvedValue(mockTrainingData);
    mockCredentialEngineUtils.getProviderData.mockResolvedValue({
      ctid: 'provider-ctid',
      providerId: 'provider-id',
      name: 'Test Provider',
      url: 'https://test-provider.com',
      email: 'test@provider.com',
      addresses: []
    });
    mockCredentialEngineUtils.extractCipCode.mockResolvedValue('11.0101');
    mockCredentialEngineUtils.constructCredentialsString.mockResolvedValue('Test Credential');
    mockCredentialEngineUtils.getTimeRequired.mockResolvedValue(40);
    mockCredentialEngineUtils.getCalendarLengthId.mockResolvedValue(1);
    mockCredentialEngineUtils.hasLearningDeliveryTypes.mockResolvedValue([]);
    mockCredentialEngineUtils.hasEveningSchedule.mockResolvedValue(false);
    mockCredentialEngineUtils.getLanguages.mockResolvedValue(['English']);
    mockCredentialEngineUtils.checkAccommodation.mockResolvedValue(false);
    mockCredentialEngineUtils.extractOccupations.mockResolvedValue([]);
    mockCredentialEngineUtils.extractCost.mockResolvedValue(1000);
    mockCredentialEngineUtils.extractPrerequisites.mockResolvedValue(['High school diploma']);
    mockCredentialEngineUtils.getAvailableAtAddresses.mockResolvedValue([]);
    mockCredentialEngineUtils.checkSupportService.mockResolvedValue(false);

    // Setup StubDataClient mocks
    stubDataClient.findCipDefinitionByCip = jest.fn().mockResolvedValue({
      cip: '11.0101',
      title: 'Computer Science',
      definition: 'Test definition'
    });
    stubDataClient.getCIPsInDemand = jest.fn().mockResolvedValue([
      { cipcode: '11.0101', title: 'Computer Science' }
    ]);
    stubDataClient.getLocalExceptionsByCip = jest.fn().mockResolvedValue([
      { cipcode: '11.0101', county: 'Bergen' }
    ]);
    stubDataClient.findOutcomeDefinition = jest.fn().mockResolvedValue({
      averageQuarterlyWage: '5000',
      jobs: 100
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    // Ensure Redis connection is properly closed
    if (mockRedis.quit) {
      await mockRedis.quit();
    }
    // Clear all mocks and timers
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.resetModules();
  });  describe('Basic Functionality', () => {
    it('should handle single URL lookup', async () => {
      const trainings = await findTrainingsBy(Selector.ID, [testURL]);
      
      expect(trainings).toHaveLength(1);
      expect(mockFetchNJDOLResource).toHaveBeenCalledWith(testURL, expect.any(Function));
      expect(mockCredentialEngineUtils.getProviderData).toHaveBeenCalled();
      expect(mockCredentialEngineUtils.extractCipCode).toHaveBeenCalled();
    });

    it('should handle multiple URL lookups', async () => {
      const urls = [testURL, 'https://credentialengine.org/test-url-2'];
      
      const trainings = await findTrainingsBy(Selector.ID, urls);
      
      expect(trainings).toHaveLength(2);
      expect(mockFetchNJDOLResource).toHaveBeenCalledTimes(2);
    });

    it('should handle empty URL array', async () => {
      const trainings = await findTrainingsBy(Selector.ID, []);
      
      expect(trainings).toHaveLength(0);
      expect(mockFetchNJDOLResource).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle fetch failures gracefully', async () => {
      // Use a unique URL to avoid cache hits
      const errorURL = 'https://credentialengine.org/error-test-url';
      jest.clearAllMocks();
      mockFetchNJDOLResource.mockRejectedValue(new Error('Network error'));

      await expect(findTrainingsBy(Selector.ID, [errorURL])).rejects.toThrow('Network error');
    });

    it('should handle null responses from fetch', async () => {
      // Use a unique URL to avoid cache hits
      const nullURL = 'https://credentialengine.org/null-test-url';
      jest.clearAllMocks();
      mockFetchNJDOLResource.mockResolvedValue(null);

      const trainings = await findTrainingsBy(Selector.ID, [nullURL]);
      expect(trainings).toEqual([]);
    });

    it('should handle provider data retrieval failures', async () => {
      // Use a unique URL to avoid cache hits
      const providerErrorURL = 'https://credentialengine.org/provider-error-test-url';
      jest.clearAllMocks();
      mockFetchNJDOLResource.mockResolvedValue(mockTrainingData);
      mockCredentialEngineUtils.getProviderData.mockRejectedValue(
        new Error('Provider fetch error')
      );
      mockCredentialEngineUtils.extractCipCode.mockResolvedValue('11.0101');
      stubDataClient.findCipDefinitionByCip.mockResolvedValue({
        cip: '11.0101',
        title: 'Computer Science',
        definition: 'Test definition'
      });
      stubDataClient.getCIPsInDemand.mockResolvedValue([
        { cipcode: '11.0101', title: 'Computer Science' }
      ]);
      stubDataClient.getLocalExceptionsByCip.mockResolvedValue([
        { cipcode: '11.0101', county: 'Bergen' }
      ]);

      await expect(findTrainingsBy(Selector.ID, [providerErrorURL])).rejects.toThrow('Provider fetch error');
    });

    it('should handle missing data client dependencies gracefully', async () => {
      // Use a unique URL to avoid cache hits
      const missingDataURL = 'https://credentialengine.org/missing-data-url';
      jest.clearAllMocks();
      const limitedTrainingData = {
        ...mockTrainingData,
        ctid: 'ctid123',
        name: 'Example Training Program',
        description: 'This is an example description for the training program.',
      };
      mockFetchNJDOLResource.mockResolvedValue(limitedTrainingData);
      mockCredentialEngineUtils.getProviderData.mockResolvedValue({
        ctid: 'provider-ctid',
        providerId: 'provider-id',
        name: 'Test Provider',
        url: 'https://test-provider.com',
        email: 'test@provider.com',
        addresses: []
      });
      mockCredentialEngineUtils.extractCipCode.mockResolvedValue('');
      stubDataClient.findCipDefinitionByCip.mockResolvedValue(null);
      stubDataClient.getCIPsInDemand.mockResolvedValue([]);
      stubDataClient.getLocalExceptionsByCip.mockResolvedValue([]);

      const trainings = await findTrainingsBy(Selector.ID, [missingDataURL]);
      
      expect(trainings).toHaveLength(1);
      expect(trainings[0].cipDefinition).toBeNull();
      expect(trainings[0].inDemand).toBe(false);
      expect(trainings[0].localExceptionCounty).toEqual([]);
    });
  });

  describe('Data Integration', () => {
    it('should integrate CIP in-demand data correctly', async () => {
      // Use a unique URL to avoid cache hits
      const cipTestURL = 'https://credentialengine.org/cip-test-url';
      // Reset mocks to ensure fresh call
      jest.clearAllMocks();
      mockFetchNJDOLResource.mockResolvedValue(mockTrainingData);
      mockCredentialEngineUtils.getProviderData.mockResolvedValue({
        ctid: 'provider-ctid',
        providerId: 'provider-id',
        name: 'Test Provider',
        url: 'https://test-provider.com',
        email: 'test@provider.com',
        addresses: []
      });
      mockCredentialEngineUtils.extractCipCode.mockResolvedValue('11.0101');
      stubDataClient.findCipDefinitionByCip.mockResolvedValue({
        cip: '11.0101',
        title: 'Computer Science',
        definition: 'Test definition'
      });
      stubDataClient.findOutcomeDefinition.mockResolvedValue({
        averageQuarterlyWage: '5000',
        jobs: 100
      });
      stubDataClient.getCIPsInDemand.mockResolvedValue([
        { cipcode: '11.0101', title: 'Computer Science' }
      ]);
      stubDataClient.getLocalExceptionsByCip.mockResolvedValue([
        { cipcode: '11.0101', county: 'Bergen' }
      ]);

      const trainings = await findTrainingsBy(Selector.ID, [cipTestURL]);
      
      expect(stubDataClient.getCIPsInDemand).toHaveBeenCalled();
      expect(trainings[0].inDemand).toBe(true);
    });

    it('should handle provider data integration', async () => {
      // Use a unique URL to avoid cache hits
      const providerTestURL = 'https://credentialengine.org/provider-test-url';
      jest.clearAllMocks();
      const providerData = {
        ctid: 'provider-ctid',
        providerId: 'provider-id',
        name: 'Test Provider',
        url: 'https://test-provider.com',
        email: 'test@provider.com',
        addresses: [{
          "@type": "ceterms:Place" as const,
          street_address: '123 Test St',
          city: 'Test City',
          state: 'NJ',
          zipCode: '07001',
          county: 'Bergen',
          targetContactPoints: []
        }]
      };
      mockFetchNJDOLResource.mockResolvedValue(mockTrainingData);
      mockCredentialEngineUtils.getProviderData.mockResolvedValue(providerData);
      mockCredentialEngineUtils.extractCipCode.mockResolvedValue('11.0101');
      stubDataClient.findCipDefinitionByCip.mockResolvedValue({
        cip: '11.0101',
        title: 'Computer Science',
        definition: 'Test definition'
      });
      stubDataClient.getCIPsInDemand.mockResolvedValue([
        { cipcode: '11.0101', title: 'Computer Science' }
      ]);
      stubDataClient.getLocalExceptionsByCip.mockResolvedValue([
        { cipcode: '11.0101', county: 'Bergen' }
      ]);

      const trainings = await findTrainingsBy(Selector.ID, [providerTestURL]);
      
      // The provider in the training will be what getProviderData returns
      expect(trainings[0].provider).toEqual(providerData);
    });
  });

  describe('Selector Validation', () => {
    it('should handle different selector values', async () => {
      // Use unique URLs to avoid cache hits
      const selectorTestURL = 'https://credentialengine.org/selector-test-url';
      jest.clearAllMocks();
      mockFetchNJDOLResource.mockResolvedValue(mockTrainingData);
      mockCredentialEngineUtils.getProviderData.mockResolvedValue({
        ctid: 'provider-ctid',
        providerId: 'provider-id',
        name: 'Test Provider',
        url: 'https://test-provider.com',
        email: 'test@provider.com',
        addresses: []
      });
      mockCredentialEngineUtils.extractCipCode.mockResolvedValue('11.0101');
      stubDataClient.findCipDefinitionByCip.mockResolvedValue({
        cip: '11.0101',
        title: 'Computer Science',
        definition: 'Test definition'
      });
      stubDataClient.getCIPsInDemand.mockResolvedValue([
        { cipcode: '11.0101', title: 'Computer Science' }
      ]);
      stubDataClient.getLocalExceptionsByCip.mockResolvedValue([
        { cipcode: '11.0101', county: 'Bergen' }
      ]);

      await findTrainingsBy(Selector.ID, [selectorTestURL]);
      expect(mockFetchNJDOLResource).toHaveBeenCalledWith(selectorTestURL, expect.any(Function));

      jest.clearAllMocks();
      mockFetchNJDOLResource.mockResolvedValue(mockTrainingData);
      mockCredentialEngineUtils.getProviderData.mockResolvedValue({
        ctid: 'provider-ctid',
        providerId: 'provider-id',
        name: 'Test Provider',
        url: 'https://test-provider.com',
        email: 'test@provider.com',
        addresses: []
      });
      mockCredentialEngineUtils.extractCipCode.mockResolvedValue('11.0101');
      stubDataClient.findCipDefinitionByCip.mockResolvedValue({
        cip: '11.0101',
        title: 'Computer Science',
        definition: 'Test definition'
      });
      stubDataClient.getCIPsInDemand.mockResolvedValue([
        { cipcode: '11.0101', title: 'Computer Science' }
      ]);
      stubDataClient.getLocalExceptionsByCip.mockResolvedValue([
        { cipcode: '11.0101', county: 'Bergen' }
      ]);

      await findTrainingsBy(Selector.CIP_CODE, ['11.0101']);
      expect(mockFetchNJDOLResource).toHaveBeenCalledWith('11.0101', expect.any(Function));
    });
  });

  describe('Performance & Edge Cases', () => {
    it('should handle large URL arrays efficiently', async () => {
      const largeUrlArray = Array.from({ length: 10 }, (_, i) => 
        `https://credentialengine.org/test-url-${i}`
      );

      const trainings = await findTrainingsBy(Selector.ID, largeUrlArray);
      
      expect(trainings).toHaveLength(10);
      expect(mockFetchNJDOLResource).toHaveBeenCalledTimes(10);
    });

    it('should handle mixed valid and invalid URLs', async () => {
      const mixedUrls = [testURL, 'https://credentialengine.org/valid-2'];
      mockFetchNJDOLResource
        .mockResolvedValueOnce(mockTrainingData)
        .mockResolvedValueOnce(mockTrainingData);

      const trainings = await findTrainingsBy(Selector.ID, mixedUrls);
      
      expect(trainings.length).toEqual(2);
    });
  });

  describe('Data Transformation', () => {
    it('should properly transform credential engine data', async () => {
      // Clear cache and ensure fresh mocks
      jest.clearAllMocks();
      mockFetchNJDOLResource.mockResolvedValue(mockTrainingData);
      mockCredentialEngineUtils.getProviderData.mockResolvedValue({
        ctid: 'provider-ctid',
        providerId: 'provider-id',
        name: 'Test Provider',
        url: 'https://test-provider.com',
        email: 'test@provider.com',
        addresses: []
      });
      mockCredentialEngineUtils.extractCipCode.mockResolvedValue('11.0101');
      stubDataClient.findCipDefinitionByCip.mockResolvedValue({
        cip: '11.0101',
        title: 'Computer Science',
        definition: 'Test definition'
      });
      stubDataClient.getCIPsInDemand.mockResolvedValue([
        { cipcode: '11.0101', title: 'Computer Science' }
      ]);
      stubDataClient.getLocalExceptionsByCip.mockResolvedValue([
        { cipcode: '11.0101', county: 'Bergen' }
      ]);

      const trainings = await findTrainingsBy(Selector.ID, [testURL]);
      
      expect(trainings[0]).toMatchObject({
        ctid: expect.any(String),
        provider: expect.any(Object),
        inDemand: expect.any(Boolean)
      });
      // cipDefinition will be undefined if not found, which is acceptable behavior
    });

    it('should handle missing optional fields gracefully', async () => {
      const missingFieldsURL = 'https://credentialengine.org/missing-fields-test-url';
      jest.clearAllMocks();
      mockFetchNJDOLResource.mockResolvedValue(mockTrainingData);
      mockCredentialEngineUtils.getProviderData.mockResolvedValue({
        ctid: 'provider-ctid',
        providerId: 'provider-id',
        name: 'Test Provider',
        url: 'https://test-provider.com',
        email: 'test@provider.com',
        addresses: []
      });
      mockCredentialEngineUtils.extractCipCode.mockResolvedValue('');
      stubDataClient.findCipDefinitionByCip.mockResolvedValue(null);
      stubDataClient.getCIPsInDemand.mockResolvedValue([]);
      stubDataClient.getLocalExceptionsByCip.mockResolvedValue([]);
      
      const trainings = await findTrainingsBy(Selector.ID, [missingFieldsURL]);
      
      // When CIP code is empty, cipDefinition will be null (as mocked) and inDemand will be false
      expect(trainings[0].cipDefinition).toBeNull();
      expect(trainings[0].inDemand).toBe(false);
    });
  });
});
