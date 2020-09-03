import { GetOccupationDetail } from "../types";
import { StubDataClient } from "../test-objects/StubDataClient";
import { getOccupationDetailFactory } from "./getOccupationDetail";
import {
  buildOccupationDetail,
  buildOccupationTitle,
  buildSocDefinition,
} from "../test-objects/factories";
import { Error } from "../Error";

describe("getOccupationDetail", () => {
  let mockOnet: jest.Mock;
  let getOccupationDetail: GetOccupationDetail;
  let stubDataClient: StubDataClient;

  beforeEach(() => {
    mockOnet = jest.fn();
    stubDataClient = StubDataClient();
    getOccupationDetail = getOccupationDetailFactory(mockOnet, stubDataClient);
  });

  describe("when onet response is successful", () => {
    it("returns the occupation detail from onet", async () => {
      const occupationDetail = buildOccupationDetail({});
      mockOnet.mockResolvedValue(occupationDetail);

      const result = await getOccupationDetail("some-soc");

      expect(result).toEqual(occupationDetail);
    });
  });

  describe("when onet response fails and there is a direct mapping to a 2010 soc", () => {
    it("uses the 2010 soc code in the onet request to get an occupation detail from onet", async () => {
      const onetOccupationDetail = buildOccupationDetail({ soc: "2010-soc" });
      mockOnet
        .mockRejectedValueOnce(Error.SYSTEM_ERROR)
        .mockResolvedValueOnce(onetOccupationDetail);
      stubDataClient.find2010OccupationTitlesBySoc2018.mockResolvedValue([
        buildOccupationTitle({ soc: "2010-soc" }),
      ]);

      const result = await getOccupationDetail("2018-soc");

      expect(result).toEqual({
        ...onetOccupationDetail,
        soc: "2018-soc",
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

      const result = await getOccupationDetail("2018-soc");

      expect(result).toEqual({
        soc: socDefinition.soc,
        title: socDefinition.soctitle,
        description: socDefinition.socdefinition,
      });
    });
  });
});
