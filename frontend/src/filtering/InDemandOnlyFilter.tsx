import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { FormControlLabel, Switch } from "@material-ui/core";
import { SearchAndFilterStrings } from "../localizations/SearchAndFilterStrings";

export const InDemandOnlyFilter = (): ReactElement => {
  const [inDemandOnly, setInDemandOnly] = useState<boolean>(false);
  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const inDemandOnlyFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.IN_DEMAND_ONLY
    );
    if (inDemandOnlyFilter) {
      setInDemandOnly(inDemandOnlyFilter.value);
    }
  }, [state.filters]);

  const applyInDemandOnlyFilter = (event: ChangeEvent<HTMLInputElement>): void => {
    setInDemandOnly(event.target.checked);
    dispatch({
      type: event.target.checked ? FilterActionType.ADD : FilterActionType.REMOVE,
      filter: {
        element: FilterableElement.IN_DEMAND_ONLY,
        value: event.target.checked,
        func: (trainingResults): TrainingResult[] => trainingResults.filter((it) => it.inDemand),
      },
    });
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={inDemandOnly}
          onChange={applyInDemandOnlyFilter}
          name="inDemandOnly"
          color="primary"
        />
      }
      label={SearchAndFilterStrings.inDemandFilterLabel}
    />
  );
};
