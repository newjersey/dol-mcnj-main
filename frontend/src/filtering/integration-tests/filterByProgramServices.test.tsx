import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { fireEvent, RenderResult } from "@testing-library/react";
import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { waitForEffect, renderWithRouter } from "../../test-objects/helpers";
import { SearchAndFilterStrings } from "../../localizations/SearchAndFilterStrings";

describe("filtering by program services", () => {
  const training1 = buildTrainingResult({ name: "training1", hasEveningCourses: true });
  const training2 = buildTrainingResult({ name: "training2", hasEveningCourses: false });

  let stubClient: StubClient;
  let subject: RenderResult;

  function getCheckbox() {
    return subject.getByLabelText("Offers evening courses");
    // return subject.container.querySelector(`input[name="${FilterableElement.EVENING_COURSES}"]`);
  }

  beforeEach(async () => {
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
    const checkbox = getCheckbox();
    if (checkbox != null) fireEvent.click(checkbox);

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
  });

  it("removes filter when clear button is clicked", () => {
    const checkbox = getCheckbox();
    if (checkbox != null) fireEvent.click(checkbox);
    expect(getCheckbox()).toBeChecked();

    fireEvent.click(subject.getByText(SearchAndFilterStrings.clearAllFiltersButtonLabel));

    expect(getCheckbox()).not.toBeChecked();
    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
  });
});
