/* eslint-disable @typescript-eslint/ban-types */

import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { Icon, InputAdornment, TextField } from "@material-ui/core";
import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteRenderInputParams,
} from "@material-ui/lab";
import { SearchAndFilterStrings } from "../localizations/SearchAndFilterStrings";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { COUNTIES, getCountyName } from "./newJerseyCounties";

const INPUT_STYLE = {
  borderRadius: 10,
  borderColor: "#7B7777",
  height: 38,
  backgroundColor: "#fff",
  paddingLeft: "10px",
};

const renderInput = (params: AutocompleteRenderInputParams): ReactElement => (
  <TextField
    {...params}
    variant="outlined"
    margin="dense"
    InputProps={{
      ...params.InputProps,
      inputProps: { ...params.inputProps, "aria-label": "Search counties" },
      style: INPUT_STYLE,
      startAdornment: (
        <>
          <InputAdornment position="start">
            <Icon>search</Icon>
          </InputAdornment>
          {params.InputProps.startAdornment}
        </>
      ),
    }}
  />
);

export const CountyFilter = (): ReactElement => {
  const { state, dispatch } = useContext(FilterContext);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  useEffect(() => {
    const countyFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.COUNTY
    );
    if (countyFilter != null) {
      setSelectedCounty(countyFilter.value);
    } else if (countyFilter == null && selectedCounty != null) {
      setSelectedCounty(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

  const handleTypeaheadChange = (
    event: ChangeEvent<{}>,
    value: string | null,
    reason: AutocompleteChangeReason
  ): void => {
    setSelectedCounty(value);
    if (value != null) {
      dispatch({
        type: FilterActionType.ADD,
        filter: {
          element: FilterableElement.COUNTY,
          value,
          func: (trainingResults): TrainingResult[] =>
            trainingResults.filter((it) => it.county === value),
        },
      });
    } else {
      dispatch({
        type: FilterActionType.REMOVE,
        filter: {
          element: FilterableElement.COUNTY,
          value,
          func: (trainingResults): TrainingResult[] => trainingResults,
        },
      });
    }
  };

  return (
    <>
      <div className="bold">{SearchAndFilterStrings.countyFilterLabel}</div>
      <label htmlFor="county">
        <Autocomplete
          data-testid="county-search"
          id="county"
          options={COUNTIES}
          getOptionLabel={getCountyName}
          onChange={handleTypeaheadChange}
          value={selectedCounty}
          renderInput={renderInput}
        />
      </label>
    </>
  );
};
