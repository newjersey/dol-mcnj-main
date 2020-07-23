import {StubClient} from "../../test-objects/StubClient";
import {App} from "../../App";
import React from "react";
import {buildTrainingResult} from "../../test-objects/factories";
import {act} from "react-dom/test-utils";
import { RenderResult, fireEvent } from "@testing-library/react";
import {renderWithRouter, waitForEffect} from "./helpers";

describe("filtering by max cost", () => {
  const training1999 = buildTrainingResult({ name: "training1999", totalCost: 1999 });
  const training2000 = buildTrainingResult({ name: "training2000", totalCost: 2000 });
  const training2001 = buildTrainingResult({ name: "training2001", totalCost: 2001 });
  const training5000 = buildTrainingResult({ name: "training5000", totalCost: 5000 });

  const getMaxCostInput = (subject: RenderResult): HTMLElement => {
    return subject.getByLabelText("Max Cost", { exact: false });
  };

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
        training1999,
        training2000,
        training2001,
        training5000,
      ]);
    });

    expect(subject.getByText("training1999")).toBeInTheDocument();
    expect(subject.getByText("training2000")).toBeInTheDocument();
    expect(subject.getByText("training2001")).toBeInTheDocument();
    expect(subject.getByText("training5000")).toBeInTheDocument();
  });

  it("filters by maximum cost, inclusively", async () => {
    fireEvent.change(getMaxCostInput(subject), {
      target: { value: "2000" },
    });
    fireEvent.blur(getMaxCostInput(subject));

    expect(subject.queryByText("training1999")).toBeInTheDocument();
    expect(subject.queryByText("training2000")).toBeInTheDocument();
    expect(subject.queryByText("training2001")).not.toBeInTheDocument();
    expect(subject.queryByText("training5000")).not.toBeInTheDocument();
  });

  it("updates a filter when changed", async () => {
    fireEvent.change(getMaxCostInput(subject), {
      target: { value: "2000" },
    });
    fireEvent.blur(getMaxCostInput(subject));

    fireEvent.change(getMaxCostInput(subject), {
      target: { value: "3000" },
    });
    fireEvent.blur(getMaxCostInput(subject));

    expect(subject.queryByText("training1999")).toBeInTheDocument();
    expect(subject.queryByText("training2000")).toBeInTheDocument();
    expect(subject.queryByText("training2001")).toBeInTheDocument();
    expect(subject.queryByText("training5000")).not.toBeInTheDocument();
  });

  it("removes a filter when empty", async () => {
    fireEvent.change(getMaxCostInput(subject), {
      target: { value: "2000" },
    });
    fireEvent.blur(getMaxCostInput(subject));

    expect(subject.queryByText("training1999")).toBeInTheDocument();
    expect(subject.queryByText("training2000")).toBeInTheDocument();
    expect(subject.queryByText("training2001")).not.toBeInTheDocument();
    expect(subject.queryByText("training5000")).not.toBeInTheDocument();

    fireEvent.change(getMaxCostInput(subject), {
      target: { value: "" },
    });
    fireEvent.blur(getMaxCostInput(subject));

    expect(subject.queryByText("training1999")).toBeInTheDocument();
    expect(subject.queryByText("training2000")).toBeInTheDocument();
    expect(subject.queryByText("training2001")).toBeInTheDocument();
    expect(subject.queryByText("training5000")).toBeInTheDocument();
  });

  it("filters on enter key", async () => {
    fireEvent.change(getMaxCostInput(subject), {
      target: { value: "2000" },
    });

    fireEvent.keyDown(getMaxCostInput(subject), {
      key: "Enter",
      code: "Enter",
    });

    expect(subject.queryByText("training1999")).toBeInTheDocument();
    expect(subject.queryByText("training2000")).toBeInTheDocument();
    expect(subject.queryByText("training2001")).not.toBeInTheDocument();
    expect(subject.queryByText("training5000")).not.toBeInTheDocument();
  });

  it("changes result count when filtering", async () => {
    expect(subject.getByText('4 results found for "some-query"')).toBeInTheDocument();

    fireEvent.change(getMaxCostInput(subject), {
      target: { value: "2000" },
    });
    fireEvent.blur(getMaxCostInput(subject));

    expect(subject.getByText('2 results found for "some-query"')).toBeInTheDocument();
  });
});