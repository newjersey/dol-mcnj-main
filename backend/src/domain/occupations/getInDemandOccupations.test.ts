import { GetInDemandOccupations } from "../types";
import { StubDataClient } from "../test-objects/StubDataClient";
import { getInDemandOccupationsFactory } from "./getInDemandOccupations";
import {
  buildNullableOccupation,
  buildOccupation,
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
    stubDataClient.getOccupationsInDemand.mockResolvedValue([
      buildOccupation({ title: "soc 1", soc: "1" }),
      buildOccupation({ title: "soc 2", soc: "2" }),
    ]);

    stubDataClient.findSocDefinitionBySoc
      .mockResolvedValueOnce(buildSocDefinition({ title: "soc group 1" }))
      .mockResolvedValueOnce(buildSocDefinition({ title: "soc group 2" }));

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
    stubDataClient.getOccupationsInDemand.mockResolvedValueOnce([
      buildOccupation({ soc: "11-1234" }),
    ]);
    stubDataClient.findSocDefinitionBySoc.mockResolvedValue(buildSocDefinition({}));
    await getInDemandOccupations();
    expect(stubDataClient.findSocDefinitionBySoc).toHaveBeenLastCalledWith("11-0000");
  });

  it("converts a 2010 soc to 2018 socs when its occupationTitle is null", async () => {
    stubDataClient.getOccupationsInDemand.mockResolvedValueOnce([
      buildNullableOccupation({ soc: "2010 soc", title: null }),
    ]);
    stubDataClient.find2018OccupationsBySoc2010.mockResolvedValue([
      buildOccupation({ soc: "2018 soc 1", title: "2018 title 1" }),
      buildOccupation({ soc: "2018 soc 2", title: "2018 title 2" }),
    ]);
    stubDataClient.findSocDefinitionBySoc
      .mockResolvedValueOnce(buildSocDefinition({ title: "major group 1" }))
      .mockResolvedValueOnce(buildSocDefinition({ title: "major group 2" }));

    const occupations = await getInDemandOccupations();
    expect(occupations[0].soc).toEqual("2018 soc 1");
    expect(occupations[0].title).toEqual("2018 title 1");
    expect(occupations[1].soc).toEqual("2018 soc 2");
    expect(occupations[1].title).toEqual("2018 title 2");

    expect(stubDataClient.find2018OccupationsBySoc2010).toHaveBeenCalledWith("2010 soc");
  });

  it("strips the word `Occupations` from the end of the group title if it exists", async () => {
    stubDataClient.getOccupationsInDemand.mockResolvedValue([
      buildOccupation({ title: "soc 1", soc: "1" }),
      buildOccupation({ title: "soc 2", soc: "2" }),
    ]);

    stubDataClient.findSocDefinitionBySoc
      .mockResolvedValueOnce(buildSocDefinition({ title: "Architecture Occupations" }))
      .mockResolvedValueOnce(buildSocDefinition({ title: "Engineering" }));

    const occupations = await getInDemandOccupations();
    expect(occupations[0].majorGroup).toEqual("Architecture");
    expect(occupations[1].majorGroup).toEqual("Engineering");
  });

  it("removes duplicates from the in demand occupations list", async () => {
    stubDataClient.getOccupationsInDemand.mockResolvedValue([
      buildOccupation({ title: "soc 1", soc: "1" }),
      buildOccupation({ title: "soc 1", soc: "1" }),
    ]);

    stubDataClient.findSocDefinitionBySoc.mockResolvedValue(buildSocDefinition({}));

    const occupations = await getInDemandOccupations();
    expect(occupations).toHaveLength(1);
  });
});
