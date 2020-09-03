import React from "react";
import { render } from "@testing-library/react";
import { OccupationPage } from "./OccupationPage";
import { buildOccupationDetail } from "../test-objects/factories";
import { act } from "react-dom/test-utils";
import { StubClient } from "../test-objects/StubClient";

describe("<OccupationPage />", () => {
  let stubClient: StubClient;

  beforeEach(() => {
    stubClient = new StubClient();
  });

  it("displays title and description based on soc code", () => {
    const occupationDetail = buildOccupationDetail({
      soc: "12-3456",
      title: "Test SOC Code",
      description: "some cool description",
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText("Test SOC Code")).toBeInTheDocument();
    expect(subject.getByText("some cool description")).toBeInTheDocument();
  });
});
