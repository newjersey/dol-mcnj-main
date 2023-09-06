import { StubDataClient } from "../test-objects/StubDataClient";
import { GetEducationText } from "../types";
import { getEducationTextFactory } from "./getEducationText";
import { buildOccupation } from "../test-objects/factories";

describe("getEducationText", () => {
  let getEducationText: GetEducationText;
  let stubDataClient: StubDataClient;

  beforeEach(() => {
    stubDataClient = StubDataClient();
    getEducationText = getEducationTextFactory(stubDataClient);
  });

  it("uses the oes hybrid soc to get education text", async () => {
    stubDataClient.getOESOccupationBySoc.mockResolvedValue(
      buildOccupation({ soc: "some-oes-soc" }),
    );
    stubDataClient.getEducationTextBySoc.mockResolvedValue({ howtobecomeone: "" });

    await getEducationText("2018-soc");

    expect(stubDataClient.getOESOccupationBySoc).toHaveBeenCalledWith("2018-soc");
    expect(stubDataClient.getEducationTextBySoc).toHaveBeenCalledWith("some-oes-soc");
  });

  it("returns a text only when given an html string", async () => {
    const dirtyText = "<h3>heading</h3><p>some string here</p>";

    stubDataClient.getOESOccupationBySoc.mockResolvedValue(buildOccupation({}));
    stubDataClient.getEducationTextBySoc.mockResolvedValue({ howtobecomeone: dirtyText });

    const educationText = await getEducationText("15-1134");

    expect(educationText).toBe("some string here");
  });

  it("returns an empty message if data is unavailable", async () => {
    stubDataClient.getOESOccupationBySoc.mockResolvedValue(buildOccupation({}));
    stubDataClient.getEducationTextBySoc.mockRejectedValue({});

    const educationText = await getEducationText("15-1134");

    expect(educationText).toBe("");
  });
});
