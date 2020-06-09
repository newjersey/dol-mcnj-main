import axios from "axios";
import { ApiClient } from "./ApiClient";
import {Program} from "./domain/Program";
import {buildProgram} from "./test-helpers/factories";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ApiClient", () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
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
