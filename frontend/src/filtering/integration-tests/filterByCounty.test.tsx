import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { fireEvent, RenderResult, within } from "@testing-library/react";
import { waitForEffect, renderWithRouter } from "../../test-objects/helpers";
import { SearchAndFilterStrings } from "../../localizations/SearchAndFilterStrings";
import { COUNTIES, getCountyName } from "../newJerseyCounties";

const TEST_COUNTIES = [COUNTIES[0], COUNTIES[1]];
const COUNTY_NAMES = TEST_COUNTIES.map((county) => getCountyName(county));

describe("filtering by county", () => {
  const training1 = buildTrainingResult({ name: "training1", county: TEST_COUNTIES[0] });
  const training2 = buildTrainingResult({ name: "training2", county: TEST_COUNTIES[1] });

  const getCountyInput = (subject: RenderResult): HTMLElement | null => {
    const autocomplete = subject.getByTestId("county-search");
    return within(autocomplete).getByLabelText("Search counties");
  };

  const selectCounty = (subject: RenderResult, county: string): void => {
    const autocomplete = subject.getByTestId("county-search");
    const input = within(autocomplete).getByLabelText("Search counties");
    if (input == null) return;
    autocomplete.focus();
    fireEvent.change(input, { target: { value: county } });
    fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
    fireEvent.keyDown(autocomplete, { key: "Enter" });
  };

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

  it("adds a filter when county is entered in search input", async () => {
    selectCounty(subject, COUNTY_NAMES[0]);

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
  });

  it("updates a filter when county is changed", async () => {
    selectCounty(subject, COUNTY_NAMES[0]);
    selectCounty(subject, COUNTY_NAMES[1]);

    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
  });

  it("removes a filter when county is cleared", async () => {
    fireEvent.click(subject.getByLabelText("Clear"));

    expect((getCountyInput(subject) as HTMLInputElement).value).toEqual("");
    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
  });

  it("changes result count when filtering", async () => {
    selectCounty(subject, COUNTY_NAMES[0]);

    expect(subject.getByText('1 result found for "some-query"')).toBeInTheDocument();
  });

  it("removes filter when clear all button is clicked", async () => {
    selectCounty(subject, COUNTY_NAMES[0]);

    fireEvent.click(subject.getByText(SearchAndFilterStrings.clearAllFiltersButtonLabel));

    await waitForEffect();

    expect((getCountyInput(subject) as HTMLInputElement).value).toEqual("");
    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
  });
});
