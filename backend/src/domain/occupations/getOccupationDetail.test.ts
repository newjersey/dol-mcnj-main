import { GetOccupationDetail } from "../types";
import { StubDataClient } from "../test-objects/StubDataClient";
import { getOccupationDetailFactory } from "./getOccupationDetail";
import {
  buildOccupation,
  buildOccupationDetailPartial,
  buildSocDefinition,
} from "../test-objects/factories";
import { Error } from "../Error";
import * as TrainingModule from "../search/searchTrainings";
// import { CalendarLength } from "../CalendarLength";
jest.mock("../search/searchTrainings")

describe("getOccupationDetail", () => {
  let mockOnet: jest.Mock;
  let getOccupationDetail: GetOccupationDetail;
  let stubDataClient: StubDataClient;
  let mockGetEducationText: jest.Mock;
  let mockGetSalaryEstimate: jest.Mock;
  let mockGetOpenJobsCount: jest.Mock;

  beforeEach(() => {
    const spy = jest.spyOn(TrainingModule, 'searchTrainingsFactory');
    spy.mockImplementation(() => {
      return async () => ({ data: [], meta: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 4,
        itemsPerPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        nextPage: null,
        previousPage: null,
      } });
  });
    mockOnet = jest.fn();
    mockGetEducationText = jest.fn();
    mockGetSalaryEstimate = jest.fn();
    mockGetOpenJobsCount = jest.fn();
    stubDataClient = StubDataClient();
    getOccupationDetail = getOccupationDetailFactory(
      mockOnet,
      mockGetEducationText,
      mockGetSalaryEstimate,
      mockGetOpenJobsCount,
      stubDataClient,
    );
  });

  describe("when onet response is successful", () => {
    it("returns the occupation detail from onet and education text from middleware", async () => {
      const onetOccupationDetail = buildOccupationDetailPartial({});
      mockOnet.mockResolvedValue(onetOccupationDetail);
      mockGetEducationText.mockResolvedValue("some-string");
      mockGetOpenJobsCount.mockResolvedValue(10);

      stubDataClient.getOccupationsInDemand.mockResolvedValue([
        buildOccupation({ soc: "some-soc" }),
      ]);
      mockGetSalaryEstimate.mockResolvedValue(38260);

      stubDataClient.findCipDefinitionBySoc2018.mockResolvedValue([
        {
          cipcode: "123456",
          ciptitle: "some-cip",
        },
      ]);
      const result = await getOccupationDetail("some-soc");

      expect(result).toEqual({
        ...onetOccupationDetail,
        education: "some-string",
        inDemand: true,
        counties: [],
        medianSalary: 38260,
        openJobsCount: 10,
        openJobsSoc: "some-soc",
        relatedTrainings: []
      });
    });
  });

  describe("when onet response fails and there is a direct mapping to a 2010 soc", () => {
    it("uses the 2010 soc code in the onet request to get an occupation detail from onet", async () => {
      const onetOccupationDetail = buildOccupationDetailPartial({ soc: "2010-soc" });
      mockOnet
        .mockRejectedValueOnce(Error.SYSTEM_ERROR)
        .mockResolvedValueOnce(onetOccupationDetail);

      stubDataClient.find2010OccupationsBySoc2018.mockResolvedValue([
        buildOccupation({ soc: "2010-soc" }),
      ]);
      mockGetEducationText.mockResolvedValue("some education text");
      mockGetOpenJobsCount.mockResolvedValue(1000);
      stubDataClient.getOccupationsInDemand.mockResolvedValue([
        buildOccupation({ soc: "2010-soc" }),
      ]);
      mockGetSalaryEstimate.mockResolvedValue(38260);

      stubDataClient.findCipDefinitionBySoc2018.mockResolvedValue([
        {
          cipcode: "123456",
          ciptitle: "some-cip",
        },
      ]);


      const result = await getOccupationDetail("2018-soc");

      expect(result).toEqual({
        ...onetOccupationDetail,
        soc: "2018-soc",
        education: "some education text",
        inDemand: true,
        localExceptionCounties: [],
        medianSalary: 38260,
        openJobsCount: 1000,
        openJobsSoc: "2010-soc",
        relatedTrainings: [],
      });

      expect(mockGetOpenJobsCount).toHaveBeenCalledWith("2010-soc");
    });
  });

  describe("when onet response fails and there is no direct mapping to a 2010 soc", () => {
    it("gets the soc information from the database", async () => {
      const socDefinition = buildSocDefinition({ soc: "2018-soc" });

      mockOnet.mockRejectedValue(Error.SYSTEM_ERROR);
      stubDataClient.find2010OccupationsBySoc2018.mockResolvedValue([
        buildOccupation({}),
        buildOccupation({}),
      ]);

      stubDataClient.findSocDefinitionBySoc.mockResolvedValue(socDefinition);
      mockGetEducationText.mockResolvedValue("some education text");
      mockGetOpenJobsCount.mockResolvedValue(100);
      stubDataClient.getOccupationsInDemand.mockResolvedValue([
        buildOccupation({ soc: "random-soc" }),
      ]);
      mockGetSalaryEstimate.mockResolvedValue(38260);

      stubDataClient.findCipDefinitionBySoc2018.mockResolvedValue([
        {
          cipcode: "123456",
          ciptitle: "some-cip",
        },
      ]);

      const neighboringOccupations = [buildOccupation({}), buildOccupation({})];
      stubDataClient.getNeighboringOccupations.mockResolvedValue(neighboringOccupations);
      const result = await getOccupationDetail("2018-soc");

      expect(result).toEqual({
        soc: socDefinition.soc,
        title: socDefinition.title,
        description: socDefinition.definition,
        tasks: [],
        education: "some education text",
        inDemand: false,
        localExceptionCounties: [],
        medianSalary: 38260,
        openJobsCount: 100,
        relatedOccupations: neighboringOccupations,
        relatedTrainings: [],
      });
    });
  });
});
