import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { fireEvent, RenderResult } from "@testing-library/react";
import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { waitForEffect, renderWithRouter } from "../../test-objects/helpers";
import { SearchAndFilterStrings } from "../../localizations/SearchAndFilterStrings";

describe("filtering by program services", () => {
  const training1 = buildTrainingResult({
    name: "training1",
    hasEveningCourses: true,
    isWheelchairAccessible: false,
  });
  const training2 = buildTrainingResult({
    name: "training2",
    hasEveningCourses: false,
    isWheelchairAccessible: true,
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
      stubClient.capturedObserver.onSuccess([training1, training2]);
    });

    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.getByText("training2")).toBeInTheDocument();
  });

  it("filters by evening course", () => {
    fireEvent.click(subject.getByLabelText("Offers evening courses"));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
  });

  it("filters by wheelchair accessibility", () => {
    fireEvent.click(subject.getByLabelText("Wheelchair accessible"));

    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
  });

  it("removes filters when clear button is clicked", async () => {
    fireEvent.click(subject.getByLabelText("Offers evening courses"));
    expect(subject.getByLabelText("Offers evening courses")).toBeChecked();

    fireEvent.click(subject.getByLabelText("Wheelchair accessible"));
    expect(subject.getByLabelText("Wheelchair accessible")).toBeChecked();

    fireEvent.click(subject.getByText(SearchAndFilterStrings.clearAllFiltersButtonLabel));

    await waitForEffect();

    expect(subject.getByLabelText("Offers evening courses")).not.toBeChecked();
    expect(subject.getByLabelText("Wheelchair accessible")).not.toBeChecked();
    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
  });
});
