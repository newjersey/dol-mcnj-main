import axios from "axios";
import { ApiClient } from "./ApiClient";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ApiClient", () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
  });

  it("calls observer with successful program data", (done) => {
    mockedAxios.get.mockResolvedValue({ data: ["program1", "program2"] });

    const observer = {
      onSuccess: (data: string[]): void => {
        expect(data).toEqual(["program1", "program2"]);
        done();
      },
      onError: jest.fn(),
    };

    apiClient.getPrograms(observer);
  });

  it("calls observer with error when GET fails", (done) => {
    mockedAxios.get.mockRejectedValue({});

    const observer = {
      onSuccess: jest.fn(),
      onError: (): void => {
        done();
      },
    };

    apiClient.getPrograms(observer);
  });
});
