import { Input } from "../components/Input";
import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { SearchAndFilterStrings } from "../localizations/SearchAndFilterStrings";

export const CostFilter = (): ReactElement => {
  const [maxCost, setMaxCost] = useState<string>("");
  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const maxCostFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.MAX_COST
    );
    if (maxCostFilter) {
      setMaxCost(maxCostFilter.value);
    }
  }, [state.filters]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      applyMaxCostFilter();
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setMaxCost(event.target.value);
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

  return (
    <>
      <div className="bold">{SearchAndFilterStrings.costFilterLabel}</div>
      <label htmlFor="maxCost" className="fin label-height">
        {SearchAndFilterStrings.maxCostLabel.split(" ")[0]}
        &nbsp;
        {SearchAndFilterStrings.maxCostLabel.split(" ")[1]}
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
    </>
  );
};
