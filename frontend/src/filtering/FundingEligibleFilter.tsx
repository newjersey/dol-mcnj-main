import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "../App";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { FormControlLabel, Switch } from "@material-ui/core";

export const FundingEligibleFilter = (): ReactElement => {
  const [fundingEligibleOnly, setFundingEligibleOnly] = useState<boolean>(false);
  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const fundingEligibleFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.FUNDING_ELIGIBLE
    );
    if (fundingEligibleFilter) {
      setFundingEligibleOnly(fundingEligibleFilter.value);
    }
  }, [state.filters]);

  const applyFundingEligibleFilter = (event: ChangeEvent<HTMLInputElement>): void => {
    setFundingEligibleOnly(event.target.checked);
    dispatch({
      type: event.target.checked ? FilterActionType.ADD : FilterActionType.REMOVE,
      filter: {
        element: FilterableElement.FUNDING_ELIGIBLE,
        value: event.target.checked,
        func: (trainingResults): TrainingResult[] => trainingResults.filter((it) => it.inDemand),
      },
    });
  };

  return (
    <>
      <div className="bold">Financial Support</div>

      <FormControlLabel
        control={
          <Switch
            checked={fundingEligibleOnly}
            onChange={applyFundingEligibleFilter}
            name="fundingEligibleOnly"
            color="primary"
          />
        }
        label="Funding Eligible Only"
      />
    </>
  );
};
