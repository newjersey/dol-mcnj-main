import { getTrainingData } from '../searchFunctions';
import { Client } from '../../domain/Client';
import { DeliveryType, CalendarLength, TrainingData } from '../../domain/Training';
import { Error } from '../../domain/Error';
import { buildTrainingResult } from '../../test-objects/factories';

// Mock Client
const mockClient: jest.Mocked<Client> = {
  getTrainingsByQuery: jest.fn(),
  getTrainingById: jest.fn(),
  getInDemandOccupations: jest.fn(),
  getOccupationDetailBySoc: jest.fn(),
  getAllCertificates: jest.fn(),
  getContentfulCPW: jest.fn(),
  getContentfulFAQ: jest.fn(),
  getContentfulTPR: jest.fn(),
  getContentfulFRP: jest.fn(),
  getContentfulGNav: jest.fn(),
  getContentfulMNav: jest.fn(),
  getContentfulFootNav1: jest.fn(),
  getContentfulFootNav2: jest.fn(),
  getJobCount: jest.fn(),
};

// Mock console methods to avoid test noise
const originalConsole = global.console;

describe('searchFunctions - Advanced Functionality', () => {
  beforeAll(() => {
    global.console = {
      ...originalConsole,
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as Console;
  });

  afterAll(() => {
    global.console = originalConsole;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock sessionStorage to return null (no cached data) for all tests
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('getTrainingData - Advanced Query Handling', () => {
    const mockTrainingData: TrainingData = {
      data: [
        buildTrainingResult({
          name: 'Advanced Nursing Program',
          deliveryTypes: [DeliveryType.BlendedDelivery],
          calendarLength: CalendarLength.SIX_TO_TWELVE_MONTHS,
          inDemand: true,
          totalCost: 15000,
        }),
      ],
      meta: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false,
        nextPage: null,
        previousPage: null,
      },
    };

    // Mock state setters
    const setIsError = jest.fn();
    const setLoading = jest.fn();
    const setMetaData = jest.fn();
    const setTrainings = jest.fn();

    it('should handle complex search queries with multiple parameters', async () => {
      mockClient.getTrainingsByQuery.mockImplementation((query, observer) => {
        // Call synchronously to match test expectations
        setTimeout(() => observer.onSuccess(mockTrainingData), 0);
      });

      getTrainingData(
        mockClient,
        'nursing AND clinical',
        setIsError,
        setLoading,
        setMetaData,
        setTrainings,
        '51.3801', // cipCode
        ['online', 'blended'], // classFormat
        [CalendarLength.SIX_TO_TWELVE_MONTHS], // completeIn
        'Bergen', // county
        true, // inDemand
        10, // itemsPerPage
        ['en'], // languages
        20000, // maxCost
        25, // miles
        1, // pageNum
        ['placement'], // services
        '29-1141', // socCode
        'best_match', // sortBy
        '07630' // zipCode
      );

      // Wait for async callback
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockClient.getTrainingsByQuery).toHaveBeenCalledWith(
        'nursing AND clinical',
        expect.any(Object),
        '51.3801',
        ['online', 'blended'],
        [CalendarLength.SIX_TO_TWELVE_MONTHS],
        'Bergen',
        true,
        10,
        ['en'],
        20000,
        25,
        1,
        ['placement'],
        '29-1141',
        'best_match',
        '07630'
      );
      expect(setLoading).toHaveBeenCalledWith(false);
    });

    it('should handle CIP code searches with proper formatting', () => {
      mockClient.getTrainingsByQuery.mockImplementation((query, observer) => {
        observer.onSuccess(mockTrainingData);
      });

      getTrainingData(
        mockClient,
        '51.3801', // CIP code format
        setIsError,
        setLoading,
        setMetaData,
        setTrainings,
        '51.3801', // cipCode
        undefined, // classFormat
        undefined, // completeIn
        undefined, // county
        undefined, // inDemand
        undefined, // itemsPerPage
        undefined, // languages
        undefined, // maxCost
        undefined, // miles
        undefined, // pageNum
        undefined, // services
        undefined, // socCode
        undefined, // sortBy
        undefined // zipCode
      );

      expect(mockClient.getTrainingsByQuery).toHaveBeenCalledWith(
        '51.3801',
        expect.any(Object),
        '51.3801',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });

    it('should handle SOC code searches with proper formatting', () => {
      mockClient.getTrainingsByQuery.mockImplementation((query, observer) => {
        observer.onSuccess(mockTrainingData);
      });

      getTrainingData(
        mockClient,
        '29-1141', // SOC code format
        setIsError,
        setLoading,
        setMetaData,
        setTrainings,
        undefined, // cipCode
        undefined, // classFormat
        undefined, // completeIn
        undefined, // county
        undefined, // inDemand
        undefined, // itemsPerPage
        undefined, // languages
        undefined, // maxCost
        undefined, // miles
        undefined, // pageNum
        undefined, // services
        '29-1141', // socCode
        undefined, // sortBy
        undefined // zipCode
      );

      expect(mockClient.getTrainingsByQuery).toHaveBeenCalledWith(
        '29-1141',
        expect.any(Object),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        '29-1141',
        undefined,
        undefined
      );
    });

    it('should handle search errors gracefully', () => {
      const testError = Error.SYSTEM_ERROR;
      mockClient.getTrainingsByQuery.mockImplementation((query, observer) => {
        observer.onError(testError);
      });

      getTrainingData(
        mockClient,
        'test query',
        setIsError,
        setLoading,
        setMetaData,
        setTrainings
      );

      expect(setIsError).toHaveBeenCalledWith(true);
      expect(setLoading).toHaveBeenCalledWith(false);
    });

    it('should handle empty search results', async () => {
      const emptyData: TrainingData = {
        data: [],
        meta: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
          nextPage: null,
          previousPage: null,
        },
      };

      mockClient.getTrainingsByQuery.mockImplementation((query, observer) => {
        // Call the callback synchronously to simulate API response
        setTimeout(() => observer.onSuccess(emptyData), 0);
      });

      getTrainingData(
        mockClient,
        'nonexistent program',
        setIsError,
        setLoading,
        setMetaData,
        setTrainings,
        undefined, // cipCode
        undefined, // classFormat
        undefined, // completeIn
        undefined, // county
        undefined, // inDemand
        undefined, // itemsPerPage
        undefined, // languages
        undefined, // maxCost
        undefined, // miles
        undefined, // pageNum
        undefined, // services
        undefined, // socCode
        undefined, // sortBy
        undefined // zipCode
      );

      // Wait for async callback
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(setTrainings).toHaveBeenCalledWith([]);
      expect(setMetaData).toHaveBeenCalledWith(emptyData.meta);
      expect(setLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('Edge Cases and Performance', () => {
    const setIsError = jest.fn();
    const setLoading = jest.fn();
    const setMetaData = jest.fn();
    const setTrainings = jest.fn();

    it('should handle very long search queries', () => {
      const longQuery = 'a'.repeat(1000);
      const mockData: TrainingData = {
        data: [],
        meta: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
          nextPage: null,
          previousPage: null,
        },
      };

      mockClient.getTrainingsByQuery.mockImplementation((query, observer) => {
        observer.onSuccess(mockData);
      });

      getTrainingData(
        mockClient,
        longQuery,
        setIsError,
        setLoading,
        setMetaData,
        setTrainings
      );

      expect(mockClient.getTrainingsByQuery).toHaveBeenCalledWith(
        longQuery,
        expect.any(Object),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });

    it('should handle all delivery type combinations', () => {
      const mockData: TrainingData = {
        data: [
          buildTrainingResult({
            deliveryTypes: [DeliveryType.OnlineOnly, DeliveryType.InPerson, DeliveryType.BlendedDelivery],
          }),
        ],
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
          nextPage: null,
          previousPage: null,
        },
      };

      mockClient.getTrainingsByQuery.mockImplementation((query, observer) => {
        observer.onSuccess(mockData);
      });

      getTrainingData(
        mockClient,
        'healthcare',
        setIsError,
        setLoading,
        setMetaData,
        setTrainings,
        undefined, // cipCode
        ['online', 'inperson', 'blended'], // classFormat
        [CalendarLength.THREE_TO_FIVE_MONTHS, CalendarLength.SIX_TO_TWELVE_MONTHS], // completeIn
        'All', // county
        true, // inDemand
        20, // itemsPerPage
        ['en', 'es'], // languages
        25000, // maxCost
        50, // miles
        1, // pageNum
        ['placement', 'childcare'], // services
        '51.0000', // socCode
        'best_match', // sortBy
        '07630' // zipCode
      );

      expect(mockClient.getTrainingsByQuery).toHaveBeenCalledWith(
        'healthcare',
        expect.any(Object),
        undefined,
        ['online', 'inperson', 'blended'],
        [CalendarLength.THREE_TO_FIVE_MONTHS, CalendarLength.SIX_TO_TWELVE_MONTHS],
        'All',
        true,
        20,
        ['en', 'es'],
        25000,
        50,
        1,
        ['placement', 'childcare'],
        '51.0000',
        'best_match',
        '07630'
      );
    });

    it('should handle calendar length edge cases', () => {
      const mockData: TrainingData = {
        data: [
          buildTrainingResult({
            calendarLength: CalendarLength.LESS_THAN_ONE_DAY,
          }),
          buildTrainingResult({
            calendarLength: CalendarLength.MORE_THAN_FOUR_YEARS,
          }),
        ],
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
          nextPage: null,
          previousPage: null,
        },
      };

      mockClient.getTrainingsByQuery.mockImplementation((query, observer) => {
        observer.onSuccess(mockData);
      });

      getTrainingData(
        mockClient,
        'short and long programs',
        setIsError,
        setLoading,
        setMetaData,
        setTrainings,
        undefined, // cipCode
        undefined, // classFormat
        [CalendarLength.LESS_THAN_ONE_DAY, CalendarLength.MORE_THAN_FOUR_YEARS] // completeIn
      );

      expect(setTrainings).toHaveBeenCalledWith(mockData.data);
    });
  });
});
