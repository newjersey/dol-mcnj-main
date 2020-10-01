import axios from "axios";
import { GetOccupationDetailPartial } from "../domain/types";
import { OnetClient } from "./OnetClient";
import onetTestData from "./onetTestData.json";
import onetTestDataTasks from "./onetTestDataTasks.json";
import onetTestDataRelatedOccupations from "./onetTestDataRelatedOccupations.json";
import { buildOccupation } from "../domain/test-objects/factories";

jest.mock("axios");

describe("OnetClient", () => {
  let getOccupationDetailPartial: GetOccupationDetailPartial;
  let mockedAxios: jest.Mocked<typeof axios>;
  let mockConvert2010SocTo2018Soc: jest.Mock;

  beforeEach(() => {
    mockedAxios = axios as jest.Mocked<typeof axios>;
    const mockedAuth = {
      username: "fakeUsername",
      password: "fakePassword",
    };

    mockConvert2010SocTo2018Soc = jest.fn();

    getOccupationDetailPartial = OnetClient(
      "wwww.some-cool-url.com",
      mockedAuth,
      mockConvert2010SocTo2018Soc
    );
  });

  it("sends request and gets response with description, tasks, and related occupations", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: onetTestData })
      .mockResolvedValueOnce({ data: onetTestDataTasks })
      .mockResolvedValueOnce({ data: onetTestDataRelatedOccupations });

    mockConvert2010SocTo2018Soc
      .mockResolvedValueOnce(
        buildOccupation({ soc: "11-9021 (2018)", title: "Construction Managers 2018" })
      )
      .mockResolvedValueOnce(
        buildOccupation({
          soc: "11-9041 (2018)",
          title: "Architectural and Engineering Managers 2018",
        })
      );

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

    expect(mockConvert2010SocTo2018Soc).toHaveBeenNthCalledWith(1, "11-9021");
    expect(mockConvert2010SocTo2018Soc).toHaveBeenNthCalledWith(2, "11-9041");

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
      relatedOccupations: [
        { soc: "11-9021 (2018)", title: "Construction Managers 2018" },
        { soc: "11-9041 (2018)", title: "Architectural and Engineering Managers 2018" },
      ],
    });
  });

  it("returns description when tasks and related occupations fail", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: onetTestData })
      .mockRejectedValueOnce({})
      .mockRejectedValueOnce({});

    const occupationDetail = await getOccupationDetailPartial("17-2051");

    expect(occupationDetail).toEqual({
      soc: "17-2051",
      title: "Civil Engineers",
      description:
        "Perform engineering duties in planning, designing, and overseeing construction and maintenance of building structures, and facilities, such as roads, railroads, airports, bridges, harbors, channels, dams, irrigation projects, pipelines, power plants, and water and sewage systems.",
      tasks: [],
      relatedOccupations: [],
    });
  });

  it("rejects when request fails", (done) => {
    mockedAxios.get.mockRejectedValue({});
    getOccupationDetailPartial("17-2051").catch(() => done());
  });
});
