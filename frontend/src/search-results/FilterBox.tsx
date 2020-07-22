import { Input } from "../components/Input";
import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterableElement } from "../domain/Filter";
import { FilterActionType, FilterContext } from "../App";
import { TrainingResult } from "../domain/Training";
import { SecondaryButton } from "../components/SecondaryButton";
import { FormControlLabel, FormGroup, useMediaQuery } from "@material-ui/core";
import { SpacedCheckbox } from "../components/SpacedCheckbox";

interface Props {
  children: ReactElement;
}

interface EmploymentRate {
  best: boolean;
  medium: boolean;
  low: boolean;
  nodata: boolean;
}

export const FilterBox = (props: Props): ReactElement => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");

  const [maxCost, setMaxCost] = useState<string>("");
  const [employmentRate, setEmploymentRate] = useState<EmploymentRate>({
    best: false,
    medium: false,
    low: false,
    nodata: false,
  });

  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);

  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    state.filters.forEach((filter) => {
      getSetStateFunctionForFilterableElement(filter.element)(filter.value);
    });
  }, [state.filters]);

  useEffect(() => {
    if (isTabletAndUp) {
      setFilterIsOpen(true);
    }
  }, [isTabletAndUp]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const getSetStateFunctionForFilterableElement = (
    element: FilterableElement
  ): React.Dispatch<any> => {
    switch (element) {
      case FilterableElement.MAX_COST:
        return setMaxCost;
      case FilterableElement.EMPLOYMENT_RATE:
        return setEmploymentRate;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      applyMaxCostFilter();
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setMaxCost(event.target.value);
  };

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

  const applyMaxCostFilter = (): void => {
    dispatch({
      type: maxCost !== "" ? FilterActionType.ADD : FilterActionType.REMOVE,
      filter: {
        element: FilterableElement.MAX_COST,
        value: parseInt(maxCost),
        func: (trainingResults): TrainingResult[] =>
          trainingResults.filter((it) => it.totalCost <= parseInt(maxCost)),
      },
    });
  };

  const toggleFilterVisibility = (): void => {
    setFilterIsOpen(!filterIsOpen);
  };

  const blueWhenFilterApplied = (): string => {
    return state.filters.length > 0 ? "blue" : "";
  };

  const isFullscreen = (): string => {
    return filterIsOpen && !isTabletAndUp ? "full" : "";
  };

  return (
    <div className={`bg-light-green pam filterbox ${isFullscreen()}`}>
      {props.children}
      <div className="ptm fdr" style={{ display: isTabletAndUp ? "none" : "flex" }}>
        <SecondaryButton className="fin flex-half" onClick={toggleFilterVisibility}>
          <i className={`material-icons ${blueWhenFilterApplied()}`}>filter_list</i>
          <span className={`mls ${blueWhenFilterApplied()}`}>Filters</span>
        </SecondaryButton>
      </div>
      <div className="ptd" style={{ display: filterIsOpen ? "block" : "none" }}>
        <div className="bold">Cost</div>
        <label htmlFor="maxCost" className="fin label-height">
          Max&nbsp;Cost
          <span className="fin mld">
            <Input
              id="maxCost"
              inputProps={{ className: "" }}
              type="number"
              value={maxCost}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onBlur={applyMaxCostFilter}
              placeholder="$"
            />
          </span>
        </label>

        <div className="mtd">
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
        </div>
      </div>
    </div>
  );
};
