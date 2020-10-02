import { Input } from "../components/Input";
import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { Client } from "../domain/Client";
import { InlineIcon } from "../components/InlineIcon";

export interface SearchArea {
  center: string;
  radius: string;
}

interface Props {
  client: Client;
}

export const LocationFilter = (props: Props): ReactElement => {
  const [searchArea, setSearchArea] = useState<SearchArea>({ center: "", radius: "" });
  const [isError, setIsError] = useState<boolean>(false);
  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const locationFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.LOCATION
    );
    if (locationFilter) {
      setSearchArea(locationFilter.value);
    }
  }, [state.filters]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      applyLocationFilter();
    }
  };

  const handleMilesInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchArea({ ...searchArea, radius: event.target.value });
  };

  const handleZipCodeInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchArea({ ...searchArea, center: event.target.value });
  };

  const applyLocationFilter = (): void => {
    const bothValuesExist = searchArea.radius && searchArea.center;

    if (bothValuesExist) {
      props.client.getZipcodesInRadius(searchArea, {
        onSuccess: (zipCodesInRadius) => {
          setIsError(false);
          dispatch({
            type: FilterActionType.ADD,
            filter: {
              element: FilterableElement.LOCATION,
              value: searchArea,
              func: (trainingResults): TrainingResult[] =>
                trainingResults.filter((it) => it.online || zipCodesInRadius.includes(it.zipCode)),
            },
          });
        },
        onError: () => {
          setIsError(true);
        },
      });
    } else {
      dispatch({
        type: FilterActionType.REMOVE,
        filter: {
          element: FilterableElement.LOCATION,
          value: searchArea,
          func: (trainingResults): TrainingResult[] => trainingResults,
        },
      });
    }
  };

  return (
    <>
      <div className="bold">Miles from Zip Code</div>
      <div className="fin mts fac ">
        <Input
          id="miles"
          inputProps={{ "aria-label": "Miles" }}
          type="number"
          value={searchArea.radius}
          onChange={handleMilesInput}
          onKeyDown={handleKeyDown}
          onBlur={applyLocationFilter}
          placeholder="Miles"
        />
        <span className="phs">from</span>
        <Input
          id="zipcode"
          inputProps={{ "aria-label": "Zip Code" }}
          type="text"
          value={searchArea.center}
          onChange={handleZipCodeInput}
          onKeyDown={handleKeyDown}
          onBlur={applyLocationFilter}
          placeholder="Zip Code"
        />
      </div>
      {isError && (
        <div className="red fin mts">
          <InlineIcon className="mrxs">error</InlineIcon> This feature is currently unavailable
        </div>
      )}
    </>
  );
};
