import axios from "axios";
import { GetOccupationDetail } from "../domain/types";
import { OnetClient } from "./OnetClient";
import onetTestData from "./onetTestData.json";

jest.mock("axios");

describe("OnetClient", () => {
  let getOccupationDetail: GetOccupationDetail;
  let mockedAxios: jest.Mocked<typeof axios>;

  beforeEach(() => {
    mockedAxios = axios as jest.Mocked<typeof axios>;
    const mockedAuth = {
      username: "fakeUsername",
      password: "fakePassword",
    };
    getOccupationDetail = OnetClient("wwww.some-cool-url.com", mockedAuth);
  });

  it("sends request and gets response", async () => {
    mockedAxios.get.mockResolvedValue({
      data: onetTestData,
    });
    const occupationDetail = await getOccupationDetail("17-2051");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "wwww.some-cool-url.com/ws/online/occupations/17-2051.00",
      {
        auth: {
          username: "fakeUsername",
          password: "fakePassword",
        },
        headers: {
          "User-Agent": "nodejs-OnetWebService/1.00 (bot)",
          Accept: "application/json",
        },
        timeout: 10000,
        maxRedirects: 0,
      }
    );

    expect(occupationDetail).toEqual({
      soc: "17-2051",
      title: "Civil Engineers",
      description:
        "Perform engineering duties in planning, designing, and overseeing construction and maintenance of building structures, and facilities, such as roads, railroads, airports, bridges, harbors, channels, dams, irrigation projects, pipelines, power plants, and water and sewage systems.",
    });
  });

  it("rejects when request fails", (done) => {
    mockedAxios.get.mockRejectedValue({});
    getOccupationDetail("17-2051").catch(() => done());
  });
});
