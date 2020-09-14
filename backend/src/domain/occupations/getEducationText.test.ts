import { StubDataClient } from "../test-objects/StubDataClient";
import { GetEducationText } from "../types";
import { getEducationTextFactory } from "./getEducationText";

describe("getEducationText", () => {
  let getEducationText: GetEducationText;
  let stubDataClient: StubDataClient;

  beforeEach(() => {
    stubDataClient = StubDataClient();
    getEducationText = getEducationTextFactory(stubDataClient);
  });

  it("should return a text only when given an html string", async () => {
    const dirtyText = "<h3>heading</h3><p>some string here</p>";

    stubDataClient.getEducationTextBySoc.mockResolvedValue({ howtobecomeone: dirtyText });

    const educationText = await getEducationText("15-1134");

    expect(educationText).toBe("some string here");
  });

  it("should return a message if data is unavailable", async () => {
    stubDataClient.getEducationTextBySoc.mockRejectedValue({});

    const educationText = await getEducationText("15-1134");

    expect(educationText).toBe("");
  });
});
