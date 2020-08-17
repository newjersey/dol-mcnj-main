import { StubClient } from "../test-objects/StubClient";
import { render } from "@testing-library/react";
import React from "react";
import { InDemandCareersPage } from "./InDemandCareersPage";
import { act } from "react-dom/test-utils";
import { buildOccupation } from "../test-objects/factories";

describe("<InDemandCareersPage />", () => {
  let stubClient: StubClient;

  beforeEach(() => {
    stubClient = new StubClient();
  });

  it("calls to get occupations from client", () => {
    render(<InDemandCareersPage client={stubClient} />);
    expect(stubClient.getOccupationsWasCalled).toEqual(true);
  });

  it("displays occupations on the page", () => {
    const subject = render(<InDemandCareersPage client={stubClient} />);

    act(() =>
      stubClient.capturedObserver.onSuccess([
        buildOccupation({ title: "Underwater Welder" }),
        buildOccupation({ title: "Magma Welder" }),
      ])
    );

    expect(subject.getByText("Underwater Welder")).toBeInTheDocument();
    expect(subject.getByText("Magma Welder")).toBeInTheDocument();
  });
});
