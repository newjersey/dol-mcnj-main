import { buildTrainingResult } from "../../test-objects/factories";
import { CalendarLength } from "../../domain/Training";
import { act } from "react-dom/test-utils";
import { fireEvent, RenderResult } from "@testing-library/react";
import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { waitForEffect, renderWithRouter } from "../../test-objects/helpers";
import { SearchAndFilterStrings } from "../../localizations/SearchAndFilterStrings";

describe("filtering by time to complete", () => {
  const lessThanOneDay = buildTrainingResult({
    name: "less than one day",
    calendarLength: CalendarLength.LESS_THAN_ONE_DAY,
  });
  const oneToTwoDays = buildTrainingResult({
    name: "1-2 days",
    calendarLength: CalendarLength.ONE_TO_TWO_DAYS,
  });
  const threeToSevenDays = buildTrainingResult({
    name: "3-7 days",
    calendarLength: CalendarLength.THREE_TO_SEVEN_DAYS,
  });
  const twoToThreeWeeks = buildTrainingResult({
    name: "2-3 weeks",
    calendarLength: CalendarLength.TWO_TO_THREE_WEEKS,
  });
  const fourToElevenWeeks = buildTrainingResult({
    name: "4-11 weeks",
    calendarLength: CalendarLength.FOUR_TO_ELEVEN_WEEKS,
  });
  const threeToFiveMonths = buildTrainingResult({
    name: "3-5 months",
    calendarLength: CalendarLength.THREE_TO_FIVE_MONTHS,
  });
  const sixToTwelveMonths = buildTrainingResult({
    name: "6-12 months",
    calendarLength: CalendarLength.SIX_TO_TWELVE_MONTHS,
  });
  const thirteenMonthsToTwoYears = buildTrainingResult({
    name: "13 months - 2 years",
    calendarLength: CalendarLength.THIRTEEN_MONTHS_TO_TWO_YEARS,
  });
  const threeToFourYears = buildTrainingResult({
    name: "3-4 years",
    calendarLength: CalendarLength.THREE_TO_FOUR_YEARS,
  });
  const moreThanFourYears = buildTrainingResult({
    name: "4+ years",
    calendarLength: CalendarLength.MORE_THAN_FOUR_YEARS,
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
      stubClient.capturedObserver.onSuccess([
        lessThanOneDay,
        oneToTwoDays,
        threeToSevenDays,
        twoToThreeWeeks,
        fourToElevenWeeks,
        threeToFiveMonths,
        sixToTwelveMonths,
        thirteenMonthsToTwoYears,
        threeToFourYears,
        moreThanFourYears,
      ]);
    });

    expect(subject.getByText("less than one day")).toBeInTheDocument();
    expect(subject.getByText("1-2 days")).toBeInTheDocument();
    expect(subject.getByText("3-7 days")).toBeInTheDocument();
    expect(subject.getByText("2-3 weeks")).toBeInTheDocument();
    expect(subject.getByText("4-11 weeks")).toBeInTheDocument();
    expect(subject.getByText("3-5 months")).toBeInTheDocument();
    expect(subject.getByText("6-12 months")).toBeInTheDocument();
    expect(subject.getByText("13 months - 2 years")).toBeInTheDocument();
    expect(subject.getByText("3-4 years")).toBeInTheDocument();
    expect(subject.getByText("4+ years")).toBeInTheDocument();
  });

  it("filters by days", () => {
    fireEvent.click(subject.getByLabelText("Days"));

    expect(subject.queryByText("less than one day")).toBeInTheDocument();
    expect(subject.queryByText("1-2 days")).toBeInTheDocument();
    expect(subject.queryByText("3-7 days")).toBeInTheDocument();
    expect(subject.queryByText("2-3 weeks")).not.toBeInTheDocument();
    expect(subject.queryByText("4-11 weeks")).not.toBeInTheDocument();
    expect(subject.queryByText("3-5 months")).not.toBeInTheDocument();
    expect(subject.queryByText("6-12 months")).not.toBeInTheDocument();
    expect(subject.queryByText("13 months - 2 years")).not.toBeInTheDocument();
    expect(subject.queryByText("3-4 years")).not.toBeInTheDocument();
    expect(subject.queryByText("4+ years")).not.toBeInTheDocument();
  });

  it("filters by weeks", () => {
    fireEvent.click(subject.getByLabelText("Weeks"));

    expect(subject.queryByText("less than one day")).not.toBeInTheDocument();
    expect(subject.queryByText("1-2 days")).not.toBeInTheDocument();
    expect(subject.queryByText("3-7 days")).not.toBeInTheDocument();
    expect(subject.queryByText("2-3 weeks")).toBeInTheDocument();
    expect(subject.queryByText("4-11 weeks")).toBeInTheDocument();
    expect(subject.queryByText("3-5 months")).not.toBeInTheDocument();
    expect(subject.queryByText("6-12 months")).not.toBeInTheDocument();
    expect(subject.queryByText("13 months - 2 years")).not.toBeInTheDocument();
    expect(subject.queryByText("3-4 years")).not.toBeInTheDocument();
    expect(subject.queryByText("4+ years")).not.toBeInTheDocument();
  });

  it("filters by months", () => {
    fireEvent.click(subject.getByLabelText("Months"));

    expect(subject.queryByText("less than one day")).not.toBeInTheDocument();
    expect(subject.queryByText("1-2 days")).not.toBeInTheDocument();
    expect(subject.queryByText("3-7 days")).not.toBeInTheDocument();
    expect(subject.queryByText("2-3 weeks")).not.toBeInTheDocument();
    expect(subject.queryByText("4-11 weeks")).not.toBeInTheDocument();
    expect(subject.queryByText("3-5 months")).toBeInTheDocument();
    expect(subject.queryByText("6-12 months")).toBeInTheDocument();
    expect(subject.queryByText("13 months - 2 years")).not.toBeInTheDocument();
    expect(subject.queryByText("3-4 years")).not.toBeInTheDocument();
    expect(subject.queryByText("4+ years")).not.toBeInTheDocument();
  });

  it("filters by years", () => {
    fireEvent.click(subject.getByLabelText("Years"));

    expect(subject.queryByText("less than one day")).not.toBeInTheDocument();
    expect(subject.queryByText("1-2 days")).not.toBeInTheDocument();
    expect(subject.queryByText("3-7 days")).not.toBeInTheDocument();
    expect(subject.queryByText("2-3 weeks")).not.toBeInTheDocument();
    expect(subject.queryByText("4-11 weeks")).not.toBeInTheDocument();
    expect(subject.queryByText("3-5 months")).not.toBeInTheDocument();
    expect(subject.queryByText("6-12 months")).not.toBeInTheDocument();
    expect(subject.queryByText("13 months - 2 years")).toBeInTheDocument();
    expect(subject.queryByText("3-4 years")).toBeInTheDocument();
    expect(subject.queryByText("4+ years")).toBeInTheDocument();
  });

  it("does not filter when all or none are checked", async () => {
    fireEvent.click(subject.getByLabelText("Days"));
    fireEvent.click(subject.getByLabelText("Weeks"));
    fireEvent.click(subject.getByLabelText("Months"));
    fireEvent.click(subject.getByLabelText("Years"));

    expect(subject.getByText("less than one day")).toBeInTheDocument();
    expect(subject.getByText("1-2 days")).toBeInTheDocument();
    expect(subject.getByText("3-7 days")).toBeInTheDocument();
    expect(subject.getByText("2-3 weeks")).toBeInTheDocument();
    expect(subject.getByText("4-11 weeks")).toBeInTheDocument();
    expect(subject.getByText("3-5 months")).toBeInTheDocument();
    expect(subject.getByText("6-12 months")).toBeInTheDocument();
    expect(subject.getByText("13 months - 2 years")).toBeInTheDocument();
    expect(subject.getByText("3-4 years")).toBeInTheDocument();
    expect(subject.getByText("4+ years")).toBeInTheDocument();

    fireEvent.click(subject.getByLabelText("Days"));
    fireEvent.click(subject.getByLabelText("Weeks"));
    fireEvent.click(subject.getByLabelText("Months"));
    fireEvent.click(subject.getByLabelText("Years"));

    expect(subject.getByText("less than one day")).toBeInTheDocument();
    expect(subject.getByText("1-2 days")).toBeInTheDocument();
    expect(subject.getByText("3-7 days")).toBeInTheDocument();
    expect(subject.getByText("2-3 weeks")).toBeInTheDocument();
    expect(subject.getByText("4-11 weeks")).toBeInTheDocument();
    expect(subject.getByText("3-5 months")).toBeInTheDocument();
    expect(subject.getByText("6-12 months")).toBeInTheDocument();
    expect(subject.getByText("13 months - 2 years")).toBeInTheDocument();
    expect(subject.getByText("3-4 years")).toBeInTheDocument();
    expect(subject.getByText("4+ years")).toBeInTheDocument();
  });

  it("combines filters", () => {
    fireEvent.click(subject.getByLabelText("Days"));

    expect(subject.queryByText("less than one day")).toBeInTheDocument();
    expect(subject.queryByText("1-2 days")).toBeInTheDocument();
    expect(subject.queryByText("3-7 days")).toBeInTheDocument();
    expect(subject.queryByText("2-3 weeks")).not.toBeInTheDocument();
    expect(subject.queryByText("4-11 weeks")).not.toBeInTheDocument();
    expect(subject.queryByText("3-5 months")).not.toBeInTheDocument();
    expect(subject.queryByText("6-12 months")).not.toBeInTheDocument();
    expect(subject.queryByText("13 months - 2 years")).not.toBeInTheDocument();
    expect(subject.queryByText("3-4 years")).not.toBeInTheDocument();
    expect(subject.queryByText("4+ years")).not.toBeInTheDocument();

    fireEvent.click(subject.getByLabelText("Weeks"));

    expect(subject.queryByText("less than one day")).toBeInTheDocument();
    expect(subject.queryByText("1-2 days")).toBeInTheDocument();
    expect(subject.queryByText("3-7 days")).toBeInTheDocument();
    expect(subject.queryByText("2-3 weeks")).toBeInTheDocument();
    expect(subject.queryByText("4-11 weeks")).toBeInTheDocument();
    expect(subject.queryByText("3-5 months")).not.toBeInTheDocument();
    expect(subject.queryByText("6-12 months")).not.toBeInTheDocument();
    expect(subject.queryByText("13 months - 2 years")).not.toBeInTheDocument();
    expect(subject.queryByText("3-4 years")).not.toBeInTheDocument();
    expect(subject.queryByText("4+ years")).not.toBeInTheDocument();
  });

  it("removes filter when clear all button is clicked", () => {
    fireEvent.click(subject.getByLabelText("Weeks"));
    expect(subject.getByLabelText("Weeks")).toBeChecked();

    fireEvent.click(subject.getByText(SearchAndFilterStrings.clearAllFiltersButtonLabel));

    expect(subject.getByLabelText("Weeks")).not.toBeChecked();
    expect(subject.queryByText("less than one day")).toBeInTheDocument();
    expect(subject.queryByText("1-2 days")).toBeInTheDocument();
    expect(subject.queryByText("3-7 days")).toBeInTheDocument();
    expect(subject.queryByText("2-3 weeks")).toBeInTheDocument();
    expect(subject.queryByText("4-11 weeks")).toBeInTheDocument();
    expect(subject.queryByText("3-5 months")).toBeInTheDocument();
    expect(subject.queryByText("6-12 months")).toBeInTheDocument();
    expect(subject.queryByText("13 months - 2 years")).toBeInTheDocument();
    expect(subject.queryByText("3-4 years")).toBeInTheDocument();
    expect(subject.queryByText("4+ years")).toBeInTheDocument();
  });
});
