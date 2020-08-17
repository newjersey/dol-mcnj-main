import axios from "axios";
import { ApiClient } from "./ApiClient";
import { Training, TrainingResult } from "./domain/Training";
import { buildOccupation, buildTraining, buildTrainingResult } from "./test-objects/factories";
import { Error } from "./domain/Error";
import { Occupation } from "./domain/Occupation";

jest.mock("axios");

describe("ApiClient", () => {
  let apiClient: ApiClient;
  let mockedAxios: jest.Mocked<typeof axios>;

  beforeEach(() => {
    mockedAxios = axios as jest.Mocked<typeof axios>;
    apiClient = new ApiClient();
  });

  describe("getTrainingsByQuery", () => {
    it("uses the search query in the api call", () => {
      const dummyObserver = { onSuccess: jest.fn(), onError: jest.fn() };
      mockedAxios.get.mockResolvedValue({ data: [] });

      apiClient.getTrainingsByQuery("penguins", dummyObserver);

      expect(mockedAxios.get).toHaveBeenCalledWith("/api/trainings/search?query=penguins");
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

      apiClient.getTrainingsByQuery("some query", observer);
    });

    it("calls observer with error and type when GET fails", (done) => {
      mockedAxios.get.mockRejectedValue({});

      const observer = {
        onSuccess: jest.fn(),
        onError: (): void => {
          done();
        },
      };

      apiClient.getTrainingsByQuery("some query", observer);
    });
  });

  describe("getTrainingById", () => {
    it("uses the id in the api call", () => {
      const dummyObserver = { onSuccess: jest.fn(), onError: jest.fn() };
      mockedAxios.get.mockResolvedValue({ data: buildTraining({}) });

      apiClient.getTrainingById("12345", dummyObserver);

      expect(mockedAxios.get).toHaveBeenCalledWith("/api/trainings/12345");
    });

    it("calls observer with successful training data", (done) => {
      const training = buildTraining({});
      mockedAxios.get.mockResolvedValue({ data: training });

      const observer = {
        onSuccess: (data: Training): void => {
          expect(data).toEqual(training);
          done();
        },
        onError: jest.fn(),
      };

      apiClient.getTrainingById("some id", observer);
    });

    it("calls observer with system error when GET fails", (done) => {
      mockedAxios.get.mockRejectedValue({});

      const observer = {
        onSuccess: jest.fn(),
        onError: (error: Error): void => {
          expect(error).toEqual(Error.SYSTEM_ERROR);
          done();
        },
      };

      apiClient.getTrainingById("some id", observer);
    });

    it("calls observer with not found error when GET 404s", (done) => {
      mockedAxios.get.mockRejectedValue({ response: { status: 404 } });

      const observer = {
        onSuccess: jest.fn(),
        onError: (error: Error): void => {
          expect(error).toEqual(Error.NOT_FOUND);
          done();
        },
      };

      apiClient.getTrainingById("some id", observer);
    });
  });

  describe("getOccupations", () => {
    it("calls observer with successful occupation data", (done) => {
      const occupations = [buildOccupation({}), buildOccupation({})];
      mockedAxios.get.mockResolvedValue({ data: occupations });

      const observer = {
        onSuccess: (data: Occupation[]): void => {
          expect(mockedAxios.get).toHaveBeenCalledWith("/api/occupations");
          expect(data).toEqual(occupations);
          done();
        },
        onError: jest.fn(),
      };

      apiClient.getOccupations(observer);
    });

    it("calls observer with error and type when GET fails", (done) => {
      mockedAxios.get.mockRejectedValue({});

      const observer = {
        onSuccess: jest.fn(),
        onError: (): void => {
          done();
        },
      };

      apiClient.getOccupations(observer);
    });
  });
});
