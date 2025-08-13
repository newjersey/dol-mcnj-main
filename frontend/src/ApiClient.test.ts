import axios from "axios";
import { ApiClient } from "./ApiClient";
import { Training, TrainingData } from "./domain/Training";
import { Error } from "./domain/Error";
import { InDemandOccupation, OccupationDetail } from "./domain/Occupation";
// import { Certificates } from "./domain/CredentialEngine";

// Factory functions for test data (implement in test-objects/factories or mock inline as needed)
import {
  buildTraining,
  buildTrainingResult,
  buildOccupation,
  buildOccupationDetail,
} from "./test-objects/factories";

jest.mock("axios");

describe("ApiClient", () => {
  let apiClient: ApiClient;
  let mockedAxios: jest.Mocked<typeof axios>;

  beforeEach(() => {
    mockedAxios = axios as jest.Mocked<typeof axios>;
    apiClient = new ApiClient();
    jest.clearAllMocks();
  });

  describe("getTrainingsByQuery", () => {
    it("makes correct API call with search query", () => {
      const observer = { onSuccess: jest.fn(), onError: jest.fn() };
      mockedAxios.get.mockResolvedValue({ data: [] });

      apiClient.getTrainingsByQuery("penguins", observer);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/api/trainings/search?query=penguins&page=1&limit=10&sort=best_match"
      );
    });

    it("calls observer.onSuccess with TrainingData on success", async () => {
      const trainings = [buildTrainingResult({}), buildTrainingResult({})];
      mockedAxios.get.mockResolvedValueOnce({ data: { data: trainings } });

      await new Promise<void>((resolve) => {
        const observer = {
          onSuccess: (data: TrainingData): void => {
            expect(data.data).toEqual(trainings);
            resolve();
          },
          onError: jest.fn(),
        };
        apiClient.getTrainingsByQuery("some query", observer);
      });
    });

    it("calls observer.onSuccess with [] (treat404AsEmpty) on 404", async () => {
      mockedAxios.get.mockRejectedValueOnce({ response: { status: 404 } });
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await new Promise<void>((resolve) => {
        const observer = {
          onSuccess: (data: unknown): void => {
            expect(data).toEqual([]);
            resolve();
          },
          onError: jest.fn(),
        };
        apiClient.getTrainingsByQuery("notfound", observer);
      });
    });

    it("calls observer.onError with SYSTEM_ERROR on network error", async () => {
      mockedAxios.get.mockRejectedValue({});
      await new Promise<void>((resolve) => {
        const observer = {
          onSuccess: jest.fn(),
          onError: (error: Error): void => {
            expect(error).toEqual(Error.SYSTEM_ERROR);
            resolve();
          },
        };
        apiClient.getTrainingsByQuery("err", observer);
      });
    });
  });

  describe("getTrainingById", () => {
    it("makes correct API call with id", () => {
      const observer = { onSuccess: jest.fn(), onError: jest.fn() };
      mockedAxios.get.mockResolvedValue({ data: buildTraining({}) });
      apiClient.getTrainingById("12345", observer);
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/trainings/12345");
    });

    it("calls observer.onSuccess with Training on success", async () => {
      const training = buildTraining({});
      mockedAxios.get.mockResolvedValue({ data: training });

      await new Promise<void>((resolve) => {
        const observer = {
          onSuccess: (data: Training): void => {
            expect(data).toEqual(training);
            resolve();
          },
          onError: jest.fn(),
        };
        apiClient.getTrainingById("some id", observer);
      });
    });

    it("calls observer.onError with SYSTEM_ERROR on failure", async () => {
      mockedAxios.get.mockRejectedValue({});
      await new Promise<void>((resolve) => {
        const observer = {
          onSuccess: jest.fn(),
          onError: (error: Error): void => {
            expect(error).toEqual(Error.SYSTEM_ERROR);
            resolve();
          },
        };
        apiClient.getTrainingById("failid", observer);
      });
    });

    it("calls observer.onError with NOT_FOUND on 404", async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 404 } });
      await new Promise<void>((resolve) => {
        const observer = {
          onSuccess: jest.fn(),
          onError: (error: Error): void => {
            expect(error).toEqual(Error.NOT_FOUND);
            resolve();
          },
        };
        apiClient.getTrainingById("404id", observer);
      });
    });
  });

  describe("getInDemandOccupations", () => {
    it("calls observer.onSuccess with occupations", async () => {
      const occupations = [buildOccupation({}), buildOccupation({})];
      mockedAxios.get.mockResolvedValue({ data: occupations });

      await new Promise<void>((resolve) => {
        const observer = {
          onSuccess: (data: InDemandOccupation[]): void => {
            expect(mockedAxios.get).toHaveBeenCalledWith("/api/occupations");
            expect(data).toEqual(occupations);
            resolve();
          },
          onError: jest.fn(),
        };
        apiClient.getInDemandOccupations(observer);
      });
    });

    it("calls observer.onError with SYSTEM_ERROR on failure", async () => {
      mockedAxios.get.mockRejectedValue({});
      await new Promise<void>((resolve) => {
        const observer = {
          onSuccess: jest.fn(),
          onError: (error: Error): void => {
            expect(error).toEqual(Error.SYSTEM_ERROR);
            resolve();
          },
        };
        apiClient.getInDemandOccupations(observer);
      });
    });
  });

  describe("getOccupationDetailBySoc", () => {
    it("calls observer.onSuccess with occupation detail", async () => {
      const occupationDetail = buildOccupationDetail({});
      mockedAxios.get.mockResolvedValue({ data: occupationDetail });

      await new Promise<void>((resolve) => {
        const observer = {
          onSuccess: (data: OccupationDetail): void => {
            expect(data).toEqual(occupationDetail);
            resolve();
          },
          onError: jest.fn(),
        };
        apiClient.getOccupationDetailBySoc("00-0000", observer);
      });
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/occupations/00-0000");
    });

    it("calls observer.onError with SYSTEM_ERROR on failure", async () => {
      mockedAxios.get.mockRejectedValue({});
      await new Promise<void>((resolve) => {
        const observer = {
          onSuccess: jest.fn(),
          onError: (error: Error): void => {
            expect(error).toEqual(Error.SYSTEM_ERROR);
            resolve();
          },
        };
        apiClient.getOccupationDetailBySoc("fail", observer);
      });
    });
  });

/*  describe("getAllCertificates", () => {
    it.skip("calls observer.onSuccess with certificates", async () => {
      const certs = buildCertificates({});
      mockedAxios.get.mockResolvedValue({ data: certs });

      await new Promise<void>((resolve) => {
        const observer = {
          onSuccess: (data: Certificates): void => {
            expect(data).toEqual(certs);
            resolve();
          },
          onError: jest.fn(),
        };
        apiClient.getAllCertificates(0, 10, "asc", false, observer);
      });
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/ce/getallcredentials/0/10/asc/false");
    });
  });*/

});
