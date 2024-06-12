import axios from "axios";
import { ApiClient } from "./ApiClient";
import { Training, TrainingData } from "./domain/Training";
import {
  buildOccupation,
  buildTraining,
  buildTrainingResult,
  buildOccupationDetail,
} from "./test-objects/factories";
import { Error } from "./domain/Error";
import { InDemandOccupation, OccupationDetail } from "./domain/Occupation";

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

      apiClient.getTrainingsByQuery("penguins", dummyObserver, 1, 10, undefined, "12345", [1, 2, 3], "county", "true", ["fr"], 100, 50, "12-3456", "12345");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/api/trainings/search?query=penguins&page=1&limit=10&sort=best_match&miles=50&zipcode=12345&maxCost=100&county=county&inDemand=true&completeIn=1,2,3&languages=fr&cipCode=12345&socCode=12-3456",
      );
    });

    it.skip("calls observer with successful training data", (done) => {
      const trainings = [buildTrainingResult({}), buildTrainingResult({})];
      mockedAxios.get.mockResolvedValue({ data: trainings });

      const observer = {
        onSuccess: ({ data }: TrainingData): void => {
          expect(data).toEqual(trainings);
          done();
        },
        onError: jest.fn(),
      };

      apiClient.getTrainingsByQuery("some query", observer, 1, 10);
    });

    it("calls observer with error and type when GET fails", (done) => {
      mockedAxios.get.mockRejectedValue({});

      const observer = {
        onSuccess: jest.fn(),
        onError: (): void => {
          done();
        },
      };

      apiClient.getTrainingsByQuery("some query", observer, 1, 10);
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
        onSuccess: (data: InDemandOccupation[]): void => {
          expect(mockedAxios.get).toHaveBeenCalledWith("/api/occupations");
          expect(data).toEqual(occupations);
          done();
        },
        onError: jest.fn(),
      };

      apiClient.getInDemandOccupations(observer);
    });

    it("calls observer with error and type when GET fails", (done) => {
      mockedAxios.get.mockRejectedValue({});

      const observer = {
        onSuccess: jest.fn(),
        onError: (): void => {
          done();
        },
      };

      apiClient.getInDemandOccupations(observer);
    });
  });

  describe("getOccupationDetailBySoc", () => {
    it("calls observer with successful occupation detail data", (done) => {
      const occupationDetail = buildOccupationDetail({});

      mockedAxios.get.mockResolvedValue({ data: occupationDetail });

      const observer = {
        onSuccess: (data: OccupationDetail): void => {
          expect(data).toEqual(occupationDetail);
          done();
        },
        onError: jest.fn(),
      };

      apiClient.getOccupationDetailBySoc("12-2051", observer);
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/occupations/12-2051");
    });

    it("calls observer with error when GET fails", (done) => {
      mockedAxios.get.mockRejectedValue({});

      const observer = {
        onSuccess: jest.fn(),
        onError: (): void => {
          done();
        },
      };

      apiClient.getOccupationDetailBySoc("12-2051", observer);
    });
  });
});
