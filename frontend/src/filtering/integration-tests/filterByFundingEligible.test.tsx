import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { RenderResult, fireEvent } from "@testing-library/react";
import { renderWithRouter, waitForEffect } from "./helpers";

describe("filtering by funding eligible", () => {
  const inDemand = buildTrainingResult({ name: "in demand training", inDemand: true });
  const notInDemand = buildTrainingResult({ name: "not in demand training", inDemand: false });

  let stubClient: StubClient;
  let subject: RenderResult;

  beforeEach(async () => {
    stubClient = new StubClient();
    const { container, history } = renderWithRouter(<App client={stubClient} />);
    subject = container;

    await history.navigate("/search/some-query");
    await waitForEffect();

    act(() => {
      stubClient.capturedObserver.onSuccess([inDemand, notInDemand]);
    });

    expect(subject.getByText("in demand training")).toBeInTheDocument();
    expect(subject.getByText("not in demand training")).toBeInTheDocument();
  });

  it("filters by funding eligible only when toggled on", async () => {
    fireEvent.click(subject.getByLabelText("Funding Eligible Only"));

    expect(subject.getByText("in demand training")).toBeInTheDocument();
    expect(subject.queryByText("not in demand training")).not.toBeInTheDocument();

    fireEvent.click(subject.getByLabelText("Funding Eligible Only"));

    expect(subject.getByText("in demand training")).toBeInTheDocument();
    expect(subject.getByText("not in demand training")).toBeInTheDocument();
  });
});
