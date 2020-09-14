import axios from "axios";
import { GetOccupationDetailPartial } from "../domain/types";
import { OnetClient } from "./OnetClient";
import onetTestData from "./onetTestData.json";
import onetTestDataTasks from "./onetTestDataTasks.json";

jest.mock("axios");

describe("OnetClient", () => {
  let getOccupationDetailPartial: GetOccupationDetailPartial;
  let mockedAxios: jest.Mocked<typeof axios>;

  beforeEach(() => {
    mockedAxios = axios as jest.Mocked<typeof axios>;
    const mockedAuth = {
      username: "fakeUsername",
      password: "fakePassword",
    };
    getOccupationDetailPartial = OnetClient("wwww.some-cool-url.com", mockedAuth);
  });

  it("sends request and gets response", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: onetTestData })
      .mockResolvedValueOnce({ data: onetTestDataTasks });

    const occupationDetail = await getOccupationDetailPartial("17-2051");

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
      tasks: [
        "Inspect project sites to monitor progress and ensure conformance to design specifications and safety or sanitation standards.",
        "Compute load and grade requirements, water flow rates, or material stress factors to determine design specifications.",
        "Provide technical advice to industrial or managerial personnel regarding design, construction, program modifications, or structural repairs.",
        "Test soils or materials to determine the adequacy and strength of foundations, concrete, asphalt, or steel.",
        "Manage and direct the construction, operations, or maintenance activities at project site.",
        "Direct or participate in surveying to lay out installations or establish reference points, grades, or elevations to guide construction.",
        "Estimate quantities and cost of materials, equipment, or labor to determine project feasibility.",
        "Plan and design transportation or hydraulic systems or structures, using computer-assisted design or drawing tools.",
      ],
    });
  });

  it("rejects when request fails", (done) => {
    mockedAxios.get.mockRejectedValue({});
    getOccupationDetailPartial("17-2051").catch(() => done());
  });
});
