import { Input } from "../components/Input";
import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { useTranslation } from "react-i18next";

const INPUT_PROPS = {
  style: {
    padding: "6px 12px",
  },
};

export const CostFilter = (): ReactElement => {
  const { t } = useTranslation();

  const [maxCost, setMaxCost] = useState<string>("");
  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cost = urlParams.get("maxCost");

    if (cost) {
      setMaxCost(cost);
      applyMaxCostFilter();
    }

    const maxCostFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.MAX_COST,
    );
    if (maxCostFilter) {
      setMaxCost(maxCostFilter.value);
    } else if (cost) {
      setMaxCost(cost);
    } else if (maxCostFilter == null && maxCost !== "") {
      setMaxCost("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (
      (maxCost === "" &&
        state.filters.find((filter) => filter.element === FilterableElement.MAX_COST)) ||
      maxCost.length > 0
    )
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cost = urlParams.get("maxCost");

    if (cost) {
      setMaxCost(cost);
      applyMaxCostFilter();

      dispatch({
        type: FilterActionType.ADD,
        filter: {
          element: FilterableElement.MAX_COST,
          value: parseInt(cost),
          func: (trainingResults): TrainingResult[] =>
            trainingResults.filter((it) => it.totalCost <= parseInt(cost)),
        },
      });
    }
  }, []);

  return (
    <>
      <div className="bold">{t("SearchAndFilter.costFilterLabel")}</div>
      <label htmlFor="maxCost" className="fin">
        {t("SearchAndFilter.maxCostLabel")}
        <span className="fin mld">
          <Input
            id="maxCost"
            type="number"
            value={maxCost}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={applyMaxCostFilter}
            placeholder="$"
            inputProps={INPUT_PROPS}
          />
        </span>
      </label>
    </>
  );
};
