import { FormControlLabel, FormGroup } from "@material-ui/core";
import { SpacedCheckbox } from "../../components/SpacedCheckbox";
import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "../../App";
import { FilterableElement } from "../../domain/Filter";
import { TrainingResult } from "../../domain/Training";

interface EmploymentRate {
  best: boolean;
  medium: boolean;
  low: boolean;
  nodata: boolean;
}

export const EmploymentRateFilter = (): ReactElement => {
  const [employmentRate, setEmploymentRate] = useState<EmploymentRate>({
    best: false,
    medium: false,
    low: false,
    nodata: false,
  });

  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const employmentRateFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.EMPLOYMENT_RATE
    );
    if (employmentRateFilter) {
      setEmploymentRate(employmentRateFilter.value);
    }
  }, [state.filters]);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    const newEmploymentRate = {
      ...employmentRate,
      [event.target.name]: checked,
    };

    setEmploymentRate(newEmploymentRate);

    const nothingIsChecked = Object.values(newEmploymentRate).every((value) => !value);

    dispatch({
      type: nothingIsChecked ? FilterActionType.REMOVE : FilterActionType.ADD,
      filter: {
        element: FilterableElement.EMPLOYMENT_RATE,
        value: newEmploymentRate,
        func: (trainingResults): TrainingResult[] =>
          trainingResults.filter((it) => {
            return (
              (newEmploymentRate.best && it.percentEmployed && it.percentEmployed >= 0.8) ||
              (newEmploymentRate.medium &&
                it.percentEmployed &&
                it.percentEmployed < 0.8 &&
                it.percentEmployed >= 0.6) ||
              (newEmploymentRate.low && it.percentEmployed && it.percentEmployed < 0.6) ||
              (newEmploymentRate.nodata && !it.percentEmployed)
            );
          }),
      },
    });
  };

  return (
    <label className="bold" htmlFor="employmentRate">
      Employment Rate
      <FormGroup id="employmentRate">
        <FormControlLabel
          control={
            <SpacedCheckbox
              checked={employmentRate.best}
              onChange={handleCheckboxChange}
              name="best"
              color="primary"
            />
          }
          label="Best"
        />
        <FormControlLabel
          control={
            <SpacedCheckbox
              checked={employmentRate.medium}
              onChange={handleCheckboxChange}
              name="medium"
              color="primary"
            />
          }
          label="Medium"
        />
        <FormControlLabel
          control={
            <SpacedCheckbox
              checked={employmentRate.low}
              onChange={handleCheckboxChange}
              name="low"
              color="primary"
            />
          }
          label="Low"
        />
        <FormControlLabel
          control={
            <SpacedCheckbox
              checked={employmentRate.nodata}
              onChange={handleCheckboxChange}
              name="nodata"
              color="primary"
            />
          }
          label="No Data"
        />
      </FormGroup>
    </label>
  );
};
