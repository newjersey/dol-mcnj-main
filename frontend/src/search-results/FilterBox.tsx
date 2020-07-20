import { Input } from "../components/Input";
import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterableElement } from "../domain/Filter";
import { FilterActionType, FilterContext } from "../App";
import { TrainingResult } from "../domain/Training";
import { SecondaryButton } from "../components/SecondaryButton";
import { useMediaQuery } from "@material-ui/core";

interface Props {
  children: ReactElement;
}

export const FilterBox = (props: Props): ReactElement => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");

  const [maxCost, setMaxCost] = useState<string>("");
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
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      applyFilter();
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setMaxCost(event.target.value);
  };

  const applyFilter = (): void => {
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
              onBlur={applyFilter}
              placeholder="$"
            />
          </span>
        </label>
      </div>
    </div>
  );
};
