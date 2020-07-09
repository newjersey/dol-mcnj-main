import axios from "axios";
import { ApiClient } from "./ApiClient";
import {TrainingResult} from "./domain/Training";
import {buildTrainingResult} from "./test-objects/factories";

jest.mock("axios");

describe("ApiClient", () => {
  let apiClient: ApiClient;
  let mockedAxios: jest.Mocked<typeof axios>;

  beforeEach(() => {
    mockedAxios = axios as jest.Mocked<typeof axios>;
    apiClient = new ApiClient();
  });

  describe('getTrainingsByQuery', () => {
    it('uses the search query in the api call', () => {
      const dummyObserver = {onSuccess: jest.fn(), onError: jest.fn()}
      mockedAxios.get.mockResolvedValue({ data: [] });

      apiClient.getTrainingsByQuery("penguins", dummyObserver);

      expect(mockedAxios.get).toHaveBeenCalledWith("/api/trainings/search?query=penguins")
    });

    it("calls observer with successful training data", (done) => {
      const trainings = [buildTrainingResult({}), buildTrainingResult({})];
      mockedAxios.get.mockResolvedValue({ data: trainings });

      const observer = {
        onSuccess: (data: TrainingResult[]): void => {
          expect(data).toEqual(trainings);
          done();
        },
        onError: jest.fn(),
      };

      apiClient.getTrainingsByQuery('some query', observer);
    });

    it("calls observer with error when GET fails", (done) => {
      mockedAxios.get.mockRejectedValue({});

      const observer = {
        onSuccess: jest.fn(),
        onError: (): void => {
          done();
        },
      };

      apiClient.getTrainingsByQuery('some query', observer);
    });
  });
});
