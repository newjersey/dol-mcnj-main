import axios from "axios";
import { ApiClient } from "./ApiClient";
import {Program} from "./domain/Program";
import {buildProgram} from "./test-helpers/factories";

jest.mock("axios");

describe("ApiClient", () => {
  let apiClient: ApiClient;
  let mockedAxios: jest.Mocked<typeof axios>;

  beforeEach(() => {
    mockedAxios = axios as jest.Mocked<typeof axios>;
    apiClient = new ApiClient();
  });

  describe('getProgramsByQuery', () => {
    it('uses the search query in the api call', () => {
      const dummyObserver = {onSuccess: jest.fn(), onError: jest.fn()}
      mockedAxios.get.mockResolvedValue({ data: [] });

      apiClient.getProgramsByQuery("penguins", dummyObserver);

      expect(mockedAxios.get).toHaveBeenCalledWith("/api/programs/search?query=penguins")
    });

    it("calls observer with successful program data", (done) => {
      const programs = [buildProgram({}), buildProgram({})];
      mockedAxios.get.mockResolvedValue({ data: programs });

      const observer = {
        onSuccess: (data: Program[]): void => {
          expect(data).toEqual(programs);
          done();
        },
        onError: jest.fn(),
      };

      apiClient.getProgramsByQuery('some query', observer);
    });

    it("calls observer with error when GET fails", (done) => {
      mockedAxios.get.mockRejectedValue({});

      const observer = {
        onSuccess: jest.fn(),
        onError: (): void => {
          done();
        },
      };

      apiClient.getProgramsByQuery('some query', observer);
    });
  });
});
