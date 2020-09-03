import { GetInDemandOccupations } from "../types";
import { StubDataClient } from "../test-objects/StubDataClient";
import { getInDemandOccupationsFactory } from "./getInDemandOccupations";
import {
  buildNullableOccupationTitle,
  buildOccupationTitle,
  buildSocDefinition,
} from "../test-objects/factories";

describe("getInDemandOccupations", () => {
  let getInDemandOccupations: GetInDemandOccupations;
  let stubDataClient: StubDataClient;

  beforeEach(() => {
    stubDataClient = StubDataClient();
    getInDemandOccupations = getInDemandOccupationsFactory(stubDataClient);
  });

  it("gets in-demand occupations and the major group for each one", async () => {
    stubDataClient.getInDemandOccupationTitles.mockResolvedValue([
      buildOccupationTitle({ soctitle: "soc 1", soc: "1" }),
      buildOccupationTitle({ soctitle: "soc 2", soc: "2" }),
    ]);

    stubDataClient.findSocDefinitionBySoc
      .mockResolvedValueOnce(buildSocDefinition({ soctitle: "soc group 1" }))
      .mockResolvedValueOnce(buildSocDefinition({ soctitle: "soc group 2" }));

    const occupations = await getInDemandOccupations();
    expect(occupations).toEqual([
      {
        soc: "1",
        title: "soc 1",
        majorGroup: "soc group 1",
      },
      {
        soc: "2",
        title: "soc 2",
        majorGroup: "soc group 2",
      },
    ]);
  });

  it("gets the major group by finding the first 2 numbers of the soc", async () => {
    stubDataClient.getInDemandOccupationTitles.mockResolvedValueOnce([
      buildOccupationTitle({ soc: "11-1234" }),
    ]);
    stubDataClient.findSocDefinitionBySoc.mockResolvedValue(buildSocDefinition({}));
    await getInDemandOccupations();
    expect(stubDataClient.findSocDefinitionBySoc).toHaveBeenLastCalledWith("11-0000");
  });

  it("converts a 2010 soc to 2018 socs when its occupationTitle is null", async () => {
    stubDataClient.getInDemandOccupationTitles.mockResolvedValueOnce([
      buildNullableOccupationTitle({ soc: "2010 soc", soctitle: null }),
    ]);
    stubDataClient.find2018OccupationTitlesBySoc2010.mockResolvedValue([
      buildOccupationTitle({ soc: "2018 soc 1", soctitle: "has a hash 1 (##)" }),
      buildOccupationTitle({ soc: "2018 soc 2", soctitle: "has a hash 2 (##)" }),
    ]);
    stubDataClient.findSocDefinitionBySoc
      .mockResolvedValueOnce(
        buildSocDefinition({ soc: "2018 soc 1", soctitle: "real 2018 title 1" })
      )
      .mockResolvedValueOnce(
        buildSocDefinition({ soc: "2018 soc 2", soctitle: "real 2018 title 2" })
      )
      .mockResolvedValueOnce(buildSocDefinition({ soctitle: "major group 1" }))
      .mockResolvedValueOnce(buildSocDefinition({ soctitle: "major group 2" }));

    const occupations = await getInDemandOccupations();
    expect(occupations[0].soc).toEqual("2018 soc 1");
    expect(occupations[0].title).toEqual("real 2018 title 1");
    expect(occupations[1].soc).toEqual("2018 soc 2");
    expect(occupations[1].title).toEqual("real 2018 title 2");

    expect(stubDataClient.find2018OccupationTitlesBySoc2010).toHaveBeenCalledWith("2010 soc");
  });

  it("strips the word `Occupations` from the end of the group title if it exists", async () => {
    stubDataClient.getInDemandOccupationTitles.mockResolvedValue([
      buildOccupationTitle({ soctitle: "soc 1", soc: "1" }),
      buildOccupationTitle({ soctitle: "soc 2", soc: "2" }),
    ]);

    stubDataClient.findSocDefinitionBySoc
      .mockResolvedValueOnce(buildSocDefinition({ soctitle: "Architecture Occupations" }))
      .mockResolvedValueOnce(buildSocDefinition({ soctitle: "Engineering" }));

    const occupations = await getInDemandOccupations();
    expect(occupations[0].majorGroup).toEqual("Architecture");
    expect(occupations[1].majorGroup).toEqual("Engineering");
  });
});
