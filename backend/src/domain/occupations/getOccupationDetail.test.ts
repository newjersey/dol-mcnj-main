import { GetOccupationDetail } from "../types";
import { StubDataClient } from "../test-objects/StubDataClient";
import { getOccupationDetailFactory } from "./getOccupationDetail";
import {
  buildOccupationDetailPartial,
  buildOccupationTitle,
  buildSocDefinition,
} from "../test-objects/factories";
import { Error } from "../Error";

describe("getOccupationDetail", () => {
  let mockOnet: jest.Mock;
  let getOccupationDetail: GetOccupationDetail;
  let stubDataClient: StubDataClient;
  let mockGetEducationText: jest.Mock;

  beforeEach(() => {
    mockOnet = jest.fn();
    mockGetEducationText = jest.fn();
    stubDataClient = StubDataClient();
    getOccupationDetail = getOccupationDetailFactory(
      mockOnet,
      mockGetEducationText,
      stubDataClient
    );
  });

  describe("when onet response is successful", () => {
    it("returns the occupation detail from onet and education text from middleware", async () => {
      const onetOccupationDetail = buildOccupationDetailPartial({});
      mockOnet.mockResolvedValue(onetOccupationDetail);
      mockGetEducationText.mockResolvedValue("some-string");

      const result = await getOccupationDetail("some-soc");

      expect(result).toEqual({
        ...onetOccupationDetail,
        education: "some-string",
      });
    });
  });

  describe("when onet response fails and there is a direct mapping to a 2010 soc", () => {
    it("uses the 2010 soc code in the onet request to get an occupation detail from onet", async () => {
      const onetOccupationDetail = buildOccupationDetailPartial({ soc: "2010-soc" });
      mockOnet
        .mockRejectedValueOnce(Error.SYSTEM_ERROR)
        .mockResolvedValueOnce(onetOccupationDetail);

      stubDataClient.find2010OccupationTitlesBySoc2018.mockResolvedValue([
        buildOccupationTitle({ soc: "2010-soc" }),
      ]);
      mockGetEducationText.mockResolvedValue("some education text");

      const result = await getOccupationDetail("2018-soc");

      expect(result).toEqual({
        ...onetOccupationDetail,
        soc: "2018-soc",
        education: "some education text",
      });
    });
  });

  describe("when onet response fails and there is no direct mapping to a 2010 soc", () => {
    it("gets the soc information from the database", async () => {
      const socDefinition = buildSocDefinition({ soc: "2018-soc" });

      mockOnet.mockRejectedValue(Error.SYSTEM_ERROR);
      stubDataClient.find2010OccupationTitlesBySoc2018.mockResolvedValue([
        buildOccupationTitle({}),
        buildOccupationTitle({}),
      ]);

      stubDataClient.findSocDefinitionBySoc.mockResolvedValue(socDefinition);
      mockGetEducationText.mockResolvedValue("some education text");

      const result = await getOccupationDetail("2018-soc");

      expect(result).toEqual({
        soc: socDefinition.soc,
        title: socDefinition.soctitle,
        description: socDefinition.socdefinition,
        tasks: [],
        education: "some education text",
      });
    });
  });
});
