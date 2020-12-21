import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { RenderResult, fireEvent } from "@testing-library/react";
import { waitForEffect, renderWithRouter } from "../../test-objects/helpers";

describe("filtering by In-Demand Only", () => {
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

  it("filters by In-Demany Only only when toggled on", async () => {
    fireEvent.click(subject.getByLabelText("Show In-Demand Trainings Only"));

    expect(subject.getByText("in demand training")).toBeInTheDocument();
    expect(subject.queryByText("not in demand training")).not.toBeInTheDocument();

    fireEvent.click(subject.getByLabelText("Show In-Demand Trainings Only"));

    expect(subject.getByText("in demand training")).toBeInTheDocument();
    expect(subject.getByText("not in demand training")).toBeInTheDocument();
  });
});
