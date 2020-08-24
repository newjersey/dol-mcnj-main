import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { fireEvent, RenderResult } from "@testing-library/react";
import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { renderWithRouter, waitForEffect } from "./helpers";

describe("filtering by employment rate", () => {
  const training80percent = buildTrainingResult({ name: "training80", percentEmployed: 0.8 });
  const training79percent = buildTrainingResult({ name: "training79", percentEmployed: 0.79 });
  const training60percent = buildTrainingResult({ name: "training60", percentEmployed: 0.6 });
  const training59percent = buildTrainingResult({ name: "training59", percentEmployed: 0.59 });
  const training1percent = buildTrainingResult({ name: "training1", percentEmployed: 0.01 });
  const trainingNoData = buildTrainingResult({
    name: "training no data",
    percentEmployed: undefined,
  });

  let stubClient: StubClient;
  let subject: RenderResult;

  beforeEach(async () => {
    stubClient = new StubClient();
    const { container, history } = renderWithRouter(<App client={stubClient} />);
    subject = container;

    await history.navigate("/search/some-query");
    await waitForEffect();

    act(() => {
      stubClient.capturedObserver.onSuccess([
        training80percent,
        training79percent,
        training60percent,
        training59percent,
        training1percent,
        trainingNoData,
      ]);
    });

    expect(subject.getByText("training80")).toBeInTheDocument();
    expect(subject.getByText("training79")).toBeInTheDocument();
    expect(subject.getByText("training60")).toBeInTheDocument();
    expect(subject.getByText("training59")).toBeInTheDocument();
    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.getByText("training no data")).toBeInTheDocument();
  });

  it("filters by best employment rate", async () => {
    fireEvent.click(subject.getByLabelText("Best"));

    expect(subject.queryByText("training80")).toBeInTheDocument();
    expect(subject.queryByText("training79")).not.toBeInTheDocument();
    expect(subject.queryByText("training60")).not.toBeInTheDocument();
    expect(subject.queryByText("training59")).not.toBeInTheDocument();
    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training no data")).not.toBeInTheDocument();
  });

  it("filters by medium employment rate", async () => {
    fireEvent.click(subject.getByLabelText("Medium"));

    expect(subject.queryByText("training80")).not.toBeInTheDocument();
    expect(subject.queryByText("training79")).toBeInTheDocument();
    expect(subject.queryByText("training60")).toBeInTheDocument();
    expect(subject.queryByText("training59")).not.toBeInTheDocument();
    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training no data")).not.toBeInTheDocument();
  });

  it("filters by low employment rate", async () => {
    fireEvent.click(subject.getByLabelText("Low"));

    expect(subject.queryByText("training80")).not.toBeInTheDocument();
    expect(subject.queryByText("training79")).not.toBeInTheDocument();
    expect(subject.queryByText("training60")).not.toBeInTheDocument();
    expect(subject.queryByText("training59")).toBeInTheDocument();
    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training no data")).not.toBeInTheDocument();
  });

  it("filters by no data employment rate", async () => {
    fireEvent.click(subject.getByLabelText("No Data"));

    expect(subject.queryByText("training80")).not.toBeInTheDocument();
    expect(subject.queryByText("training79")).not.toBeInTheDocument();
    expect(subject.queryByText("training60")).not.toBeInTheDocument();
    expect(subject.queryByText("training59")).not.toBeInTheDocument();
    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training no data")).toBeInTheDocument();
  });

  it("does not filter when all or none are checked", async () => {
    fireEvent.click(subject.getByLabelText("Best"));
    fireEvent.click(subject.getByLabelText("Medium"));
    fireEvent.click(subject.getByLabelText("Low"));
    fireEvent.click(subject.getByLabelText("No Data"));

    expect(subject.getByText("training80")).toBeInTheDocument();
    expect(subject.getByText("training79")).toBeInTheDocument();
    expect(subject.getByText("training60")).toBeInTheDocument();
    expect(subject.getByText("training59")).toBeInTheDocument();
    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.getByText("training no data")).toBeInTheDocument();

    fireEvent.click(subject.getByLabelText("Best"));
    fireEvent.click(subject.getByLabelText("Medium"));
    fireEvent.click(subject.getByLabelText("Low"));
    fireEvent.click(subject.getByLabelText("No Data"));

    expect(subject.getByText("training80")).toBeInTheDocument();
    expect(subject.getByText("training79")).toBeInTheDocument();
    expect(subject.getByText("training60")).toBeInTheDocument();
    expect(subject.getByText("training59")).toBeInTheDocument();
    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.getByText("training no data")).toBeInTheDocument();
  });

  it("combines filters", async () => {
    fireEvent.click(subject.getByLabelText("Best"));

    expect(subject.queryByText("training80")).toBeInTheDocument();
    expect(subject.queryByText("training79")).not.toBeInTheDocument();
    expect(subject.queryByText("training60")).not.toBeInTheDocument();
    expect(subject.queryByText("training59")).not.toBeInTheDocument();
    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training no data")).not.toBeInTheDocument();

    fireEvent.click(subject.getByLabelText("Medium"));

    expect(subject.getByText("training80")).toBeInTheDocument();
    expect(subject.getByText("training79")).toBeInTheDocument();
    expect(subject.getByText("training60")).toBeInTheDocument();
    expect(subject.queryByText("training59")).not.toBeInTheDocument();
    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training no data")).not.toBeInTheDocument();
  });
});
