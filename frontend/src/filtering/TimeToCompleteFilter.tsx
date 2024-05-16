import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FormControlLabel, FormGroup } from "@material-ui/core";
import { SpacedCheckbox } from "../components/SpacedCheckbox";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { CalendarLength, TrainingResult } from "../domain/Training";
import { useTranslation } from "react-i18next";
import { toggleParams } from "../utils/updateUrlParams";

interface TimeToComplete {
  days: boolean;
  weeks: boolean;
  months: boolean;
  years: boolean;
}

const TimeToCompleteBuckets = {
  days: [
    CalendarLength.LESS_THAN_ONE_DAY,
    CalendarLength.ONE_TO_TWO_DAYS,
    CalendarLength.THREE_TO_SEVEN_DAYS,
  ],
  weeks: [CalendarLength.TWO_TO_THREE_WEEKS, CalendarLength.FOUR_TO_ELEVEN_WEEKS],
  months: [CalendarLength.THREE_TO_FIVE_MONTHS, CalendarLength.SIX_TO_TWELVE_MONTHS],
  years: [
    CalendarLength.THIRTEEN_MONTHS_TO_TWO_YEARS,
    CalendarLength.THREE_TO_FOUR_YEARS,
    CalendarLength.MORE_THAN_FOUR_YEARS,
  ],
};

const INITIAL_STATE = {
  days: false,
  weeks: false,
  months: false,
  years: false,
};

export const TimeToCompleteFilter = (): ReactElement => {
  const { t } = useTranslation();

  const [timeToComplete, setTimeToComplete] = useState<TimeToComplete>(INITIAL_STATE);

  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const timeToCompleteFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.TIME_TO_COMPLETE,
    );
    if (timeToCompleteFilter) {
      setTimeToComplete(timeToCompleteFilter.value);
    } else if (timeToCompleteFilter == null && Object.values(timeToComplete).some((val) => val)) {
      setTimeToComplete(INITIAL_STATE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    const newTimeToComplete = {
      ...timeToComplete,
      [event.target.name]: checked,
    };

    setTimeToComplete(newTimeToComplete);

    const nothingIsChecked = Object.values(newTimeToComplete).every((value) => !value);

    dispatch({
      type: nothingIsChecked ? FilterActionType.REMOVE : FilterActionType.ADD,
      filter: {
        element: FilterableElement.TIME_TO_COMPLETE,
        value: newTimeToComplete,
        func: (trainingResults): TrainingResult[] =>
          trainingResults.filter((it) => {
            return (
              (newTimeToComplete.days && TimeToCompleteBuckets.days.includes(it.calendarLength)) ||
              (newTimeToComplete.weeks &&
                TimeToCompleteBuckets.weeks.includes(it.calendarLength)) ||
              (newTimeToComplete.months &&
                TimeToCompleteBuckets.months.includes(it.calendarLength)) ||
              (newTimeToComplete.years && TimeToCompleteBuckets.years.includes(it.calendarLength))
            );
          }),
      },
    });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const days = urlParams.get("days");
    const weeks = urlParams.get("weeks");
    const months = urlParams.get("months");
    const years = urlParams.get("years");

    if (days === "true") {
      timeToComplete.days = true;
    }

    if (weeks === "true") {
      timeToComplete.weeks = true;
    }

    if (months === "true") {
      timeToComplete.months = true;
    }

    if (years === "true") {
      timeToComplete.years = true;
    }

    if (
      timeToComplete.days ||
      timeToComplete.weeks ||
      timeToComplete.months ||
      timeToComplete.years
    ) {
      const timeToCompleteArray = Object.entries(timeToComplete).filter(([, value]) => value);

      timeToCompleteArray.forEach(([key]) => {
        handleCheckboxChange({ target: { name: key } } as ChangeEvent<HTMLInputElement>, true);
      });
    }
  }, []);

  return (
    <label className="bold" htmlFor="timeToComplete">
      {t("SearchAndFilter.timeToCompleteFilterLabel")}
      <FormGroup id="timeToComplete">
        <FormControlLabel
          control={
            <SpacedCheckbox
              checked={timeToComplete.days}
              onChange={(e) => {
                handleCheckboxChange(e, !timeToComplete.days);
                toggleParams({
                  condition: e.target.checked,
                  value: "true",
                  key: "days",
                  valid: true,
                });
              }}
              name="days"
              color="primary"
            />
          }
          label={t("SearchAndFilter.timeToCompleteDaysLabel")}
        />
        <FormControlLabel
          control={
            <SpacedCheckbox
              checked={timeToComplete.weeks}
              onChange={(e) => {
                handleCheckboxChange(e, !timeToComplete.weeks);
                toggleParams({
                  condition: e.target.checked,
                  value: "true",
                  key: "weeks",
                  valid: true,
                });
              }}
              name="weeks"
              color="primary"
            />
          }
          label={t("SearchAndFilter.timeToCompleteWeeksLabel")}
        />
        <FormControlLabel
          control={
            <SpacedCheckbox
              checked={timeToComplete.months}
              onChange={(e) => {
                handleCheckboxChange(e, !timeToComplete.months);
                toggleParams({
                  condition: e.target.checked,
                  value: "true",
                  key: "months",
                  valid: true,
                });
              }}
              name="months"
              color="primary"
            />
          }
          label={t("SearchAndFilter.timeToCompleteMonthsLabel")}
        />
        <FormControlLabel
          control={
            <SpacedCheckbox
              checked={timeToComplete.years}
              onChange={(e) => {
                handleCheckboxChange(e, !timeToComplete.years);
                toggleParams({
                  condition: e.target.checked,
                  value: "true",
                  key: "years",
                  valid: true,
                });
              }}
              name="years"
              color="primary"
            />
          }
          label={t("SearchAndFilter.timeToCompleteYearsLabel")}
        />
      </FormGroup>
    </label>
  );
};
