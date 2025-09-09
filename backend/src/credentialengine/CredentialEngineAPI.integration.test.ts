import { credentialEngineAPI } from './CredentialEngineAPI';
import { searchAPI, getRecordAPI } from './CredentialEngineConfig';

jest.mock('./CredentialEngineConfig', () => ({
  searchAPI: {
    request: jest.fn(),
  },
  getRecordAPI: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
  })),
}));

const mockedSearchAPI = searchAPI as jest.Mocked<typeof searchAPI>;
const mockedGetRecordAPI = getRecordAPI as jest.Mocked<typeof getRecordAPI>;

describe('credentialEngineAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getResults', () => {
    const mockQuery = {
      "@type": {
        "search:value": "ceterms:LearningOpportunityProfile",
        "search:matchType": "search:subClassOf"
      },
      "ceterms:lifeCycleStatusType": {
        "ceterms:targetNode": "lifeCycle:Active"
      },
      "search:recordPublishedBy": "ce-cc992a07-6e17-42e5-8ed1-5b016e743e9d",
      "search:termGroup": {
        "search:operator": "search:orTerms",
        "ceterms:name": {
          "search:value": "nursing",
          "search:matchType": "search:contains"
        }
      }
    };

    it('should successfully fetch search results', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              "ceterms:ctid": "ce-test-123",
              "ceterms:name": { "en-US": "Test Program" },
              "ceterms:description": { "en-US": "Test Description" }
            }
          ],
          extra: {
            TotalResults: 1
          }
        }
      };

      mockedSearchAPI.request.mockResolvedValueOnce(mockResponse);

      const result = await credentialEngineAPI.getResults(mockQuery, 0, 10);

      expect(mockedSearchAPI.request).toHaveBeenCalledWith({
        url: '/assistant/search/ctdl',
        method: 'post',
        data: {
          Query: mockQuery,
          Skip: 0,
          Take: 10,
          Sort: "^search:relevance"
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors gracefully and return fallback data', async () => {
      mockedSearchAPI.request.mockRejectedValueOnce(new Error('API Error'));

      const result = await credentialEngineAPI.getResults(mockQuery, 0, 10);

      expect(result).toEqual({
        data: { data: [], extra: { TotalResults: 0 } },
        status: 503,
        statusText: 'Service Unavailable',
        headers: {},
        config: {},
      });
    });

    it('should use default take value when not provided', async () => {
      const mockResponse = {
        data: { data: [], extra: { TotalResults: 0 } }
      };

      mockedSearchAPI.request.mockResolvedValueOnce(mockResponse);

      await credentialEngineAPI.getResults(mockQuery, 0);

      expect(mockedSearchAPI.request).toHaveBeenCalledWith({
        url: '/assistant/search/ctdl',
        method: 'post',
        data: {
          Query: mockQuery,
          Skip: 0,
          Take: 10, // Default take value
          Sort: "^search:relevance"
        },
      });
    });
  });

  describe('getResourceByCTID', () => {
    const testCTID = 'ce-test-123';

    it('should successfully fetch a resource by CTID', async () => {
      const mockResponse = {
        data: {
          "ceterms:ctid": "ce-test-123",
          "ceterms:name": { "en-US": "Test Resource" }
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getRecordAPI as any).mockResolvedValueOnce(mockResponse);

      const result = await credentialEngineAPI.getResourceByCTID(testCTID);

      expect(mockedGetRecordAPI).toHaveBeenCalledWith({
        url: `/resources/${testCTID}`,
        method: 'get',
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors gracefully and return null', async () => {
      (mockedGetRecordAPI as unknown as jest.MockedFunction<typeof getRecordAPI>).mockRejectedValueOnce(new Error('Resource not found'));

      const result = await credentialEngineAPI.getResourceByCTID(testCTID);

      expect(result).toBeNull();
    });
  });

  describe('getGraphByCTID', () => {
    const testCTID = 'ce-test-123';

    it('should successfully fetch a graph by CTID', async () => {
      const mockResponse = {
        data: {
          "@graph": [
            {
              "ceterms:ctid": "ce-test-123",
              "ceterms:name": { "en-US": "Test Graph" }
            }
          ]
        }
      };

      (mockedGetRecordAPI as unknown as jest.MockedFunction<typeof getRecordAPI>).mockResolvedValueOnce(mockResponse);

      const result = await credentialEngineAPI.getGraphByCTID(testCTID);

      expect(mockedGetRecordAPI).toHaveBeenCalledWith({
        url: `/graph/${testCTID}`,
        method: 'get',
      });

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getEnvelopeByCTID', () => {
    const testCTID = 'ce-test-123';

    it('should successfully fetch an envelope by CTID', async () => {
      const mockGetRecordAPIWithGet = {
        get: jest.fn()
      };
      
      const mockResponse = {
        data: {
          "EnvelopeIdentifier": "envelope-123",
          "EnvelopeCTID": "ce-test-123"
        }
      };

      (getRecordAPI as jest.Mocked<typeof getRecordAPI>).get = mockGetRecordAPIWithGet.get;
      mockGetRecordAPIWithGet.get.mockResolvedValueOnce(mockResponse);

      const result = await credentialEngineAPI.getEnvelopeByCTID(testCTID);

      expect(mockGetRecordAPIWithGet.get).toHaveBeenCalledWith(`/ce-registry/envelopes/${testCTID}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors gracefully and return null', async () => {
      const mockGetRecordAPIWithGet = {
        get: jest.fn()
      };
      
      (getRecordAPI as jest.Mocked<typeof getRecordAPI>).get = mockGetRecordAPIWithGet.get;
      mockGetRecordAPIWithGet.get.mockRejectedValueOnce(new Error('Envelope not found'));

      const result = await credentialEngineAPI.getEnvelopeByCTID(testCTID);

      expect(result).toBeNull();
    });
  });
});
