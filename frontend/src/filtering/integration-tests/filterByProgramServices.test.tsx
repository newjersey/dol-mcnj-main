import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { fireEvent, RenderResult } from "@testing-library/react";
import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { waitForEffect, renderWithRouter } from "../../test-objects/helpers";
import { en as Content } from "../../locales/en";

describe("filtering by program services", () => {
  const training1 = buildTrainingResult({
    name: "training1",
    hasEveningCourses: true,
    isWheelchairAccessible: false,
    hasJobPlacementAssistance: false,
    hasChildcareAssistance: false,
  });
  const training2 = buildTrainingResult({
    name: "training2",
    hasEveningCourses: false,
    isWheelchairAccessible: true,
    hasJobPlacementAssistance: false,
    hasChildcareAssistance: false,
  });
  const training3 = buildTrainingResult({
    name: "training3",
    hasEveningCourses: false,
    isWheelchairAccessible: false,
    hasJobPlacementAssistance: true,
    hasChildcareAssistance: false,
  });
  const training4 = buildTrainingResult({
    name: "training4",
    hasEveningCourses: false,
    isWheelchairAccessible: false,
    hasJobPlacementAssistance: false,
    hasChildcareAssistance: true,
  });

  let stubClient: StubClient;
  let subject: RenderResult;

  beforeEach(async () => {
    jest.setTimeout(10000);

    stubClient = new StubClient();
    const { container, history } = renderWithRouter(<App client={stubClient} />);
    subject = container;

    await history.navigate("/search/some-query");
    await waitForEffect();

    act(() => {
      stubClient.capturedObserver.onSuccess([training1, training2, training3, training4]);
    });

    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.getByText("training2")).toBeInTheDocument();
    expect(subject.getByText("training3")).toBeInTheDocument();
    expect(subject.getByText("training4")).toBeInTheDocument();
  });

  it("filters by evening course", () => {
    fireEvent.click(subject.getByLabelText("Offers evening courses"));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
  });

  it("filters by wheelchair accessibility", () => {
    fireEvent.click(subject.getByLabelText("Wheelchair accessible"));

    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
  });

  it("filters by job placement assistance", () => {
    fireEvent.click(subject.getByLabelText("Job placement assistance"));

    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
  });

  it("filters by childcare assistance", () => {
    fireEvent.click(subject.getByLabelText("Childcare assistance"));

    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).toBeInTheDocument();
  });

  it("removes filters when clear button is clicked", async () => {
    fireEvent.click(subject.getByLabelText("Offers evening courses"));
    expect(subject.getByLabelText("Offers evening courses")).toBeChecked();

    fireEvent.click(subject.getByLabelText("Wheelchair accessible"));
    expect(subject.getByLabelText("Wheelchair accessible")).toBeChecked();

    fireEvent.click(subject.getByLabelText("Job placement assistance"));
    expect(subject.getByLabelText("Job placement assistance")).toBeChecked();

    fireEvent.click(subject.getByLabelText("Childcare assistance"));
    expect(subject.getByLabelText("Childcare assistance")).toBeChecked();

    fireEvent.click(subject.getByText(Content.SearchAndFilterStrings.clearAllFiltersButtonLabel));

    await waitForEffect();

    expect(subject.getByLabelText("Offers evening courses")).not.toBeChecked();
    expect(subject.getByLabelText("Wheelchair accessible")).not.toBeChecked();
    expect(subject.getByLabelText("Job placement assistance")).not.toBeChecked();
    expect(subject.getByLabelText("Childcare assistance")).not.toBeChecked();
    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).toBeInTheDocument();
  });
});
