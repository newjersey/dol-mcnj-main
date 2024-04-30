import { Input } from "../components/Input";
import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { InlineIcon } from "../components/InlineIcon";
import { FormControl, InputLabel } from "@material-ui/core";
import { WhiteSelect } from "../components/WhiteSelect";
import { getZipCodesInRadius } from "./findZipCodesInRadius";
import { useTranslation } from "react-i18next";
import { checkValidZipCode } from "../utils/checkValidZipCode";
import { updateUrlParams } from "../utils/updateUrlParams";
export interface SearchArea {
  center: string;
  radius: number;
}

const MILES_VALUES = [5, 10, 25, 50];
const DEFAULT_MILES = 10;
const ZIP_CODE_INPUT_PROPS = {
  "aria-label": "Search by ZIP code",
  style: {
    padding: "6px 12px",
  },
};

const INITIAL_STATE = {
  center: "",
  radius: DEFAULT_MILES,
};

export const LocationFilter = (): ReactElement => {
  const { state, dispatch } = useContext(FilterContext);
  const { t } = useTranslation();

  const [searchArea, setSearchArea] = useState<SearchArea>(INITIAL_STATE);
  const [isValidZipCode, setIsValidZipCode] = useState<boolean>(false);
  const [attempted, setAttempted] = useState<boolean>(false);

  useEffect(() => {
    const locationFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.LOCATION,
    );
    if (locationFilter != null) {
      setSearchArea(locationFilter.value);
    } else if (locationFilter == null && searchArea.center !== "") {
      setSearchArea(INITIAL_STATE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const miles = urlParams.get("miles");
    const zipCode = urlParams.get("zip");

    if (miles && zipCode) {
      applyLocationFilter(
        {
          center: zipCode || "",
          radius: miles ? parseInt(miles) : DEFAULT_MILES,
        },
        false,
      );
    }

    if (zipCode) {
      const validZipCode = checkValidZipCode(zipCode);
      setIsValidZipCode(validZipCode);
      setAttempted(true);
    }
  }, []);

  const applyLocationFilter = (currentSearchArea: SearchArea, validateZipCode = true): void => {
    if (validateZipCode && currentSearchArea.center !== "") {
      const validZipCode = checkValidZipCode(currentSearchArea.center);
      setIsValidZipCode(validZipCode);
      if (!validZipCode) {
        return;
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("zip", currentSearchArea.center);
        window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
      }
    }

    if (currentSearchArea.center) {
      const zipCodesInRadius = getZipCodesInRadius(
        currentSearchArea.center,
        currentSearchArea.radius,
      );
      dispatch({
        type: FilterActionType.ADD,
        filter: {
          element: FilterableElement.LOCATION,
          value: currentSearchArea,
          func: (trainingResults): TrainingResult[] =>
            trainingResults.filter((it) => it.online || zipCodesInRadius.some(z => it.zipCodes.includes(z))),
        },
      });
    } else if (state.filters.some((filter) => filter.element === FilterableElement.LOCATION)) {
      dispatch({
        type: FilterActionType.REMOVE,
        filter: {
          element: FilterableElement.LOCATION,
          value: currentSearchArea,
          func: (trainingResults): TrainingResult[] => trainingResults,
        },
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      applyLocationFilter(searchArea);
    }
  };

  const handleMilesInput = (event: ChangeEvent<{ value: unknown }>): void => {
    const newSearchArea = { ...searchArea, radius: Number(event.target.value) };
    setSearchArea(newSearchArea);
    applyLocationFilter(newSearchArea, false);
    updateUrlParams({
      key: "miles",
      value: `${event.target.value}`,
      valid: true,
    });
  };

  const handleZipCodeInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setAttempted(false);
    setSearchArea({ ...searchArea, center: event.target.value });
  };

  const milesActive = isValidZipCode && attempted;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasMiles = urlParams.has("miles");
    updateUrlParams({
      key: "miles",
      value: "10",
      valid: isValidZipCode && attempted && !hasMiles,
    });
  }, [isValidZipCode, attempted]);

  return (
    <section>
      <header>
        <div className="bold">
          {isValidZipCode ? "Miles from Zip Code" : "Enter a New Jersey Zip Code"}
        </div>
      </header>

      <div className="fin mts fac ">
        <FormControl variant="outlined" disabled={!milesActive} className={`mla width-100`}>
          <InputLabel htmlFor="miles">
            {t("SearchAndFilter.locationFilterMilesInputLabel")}
          </InputLabel>
          <WhiteSelect
            native={true}
            value={searchArea.radius}
            onChange={handleMilesInput}
            label={t("SearchAndFilter.locationFilterMilesInputLabel")}
            id="miles"
          >
            {MILES_VALUES.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </WhiteSelect>
        </FormControl>
        <span className="phs">from</span>

        <Input
          id="zipcode"
          inputProps={ZIP_CODE_INPUT_PROPS}
          type="text"
          value={searchArea.center}
          onChange={handleZipCodeInput}
          onKeyDown={handleKeyDown}
          onBlur={(e) => {
            if (e.target.value !== "") {
              setAttempted(true);
            }
            applyLocationFilter(searchArea);
          }}
          placeholder={t("SearchAndFilter.locationFilterZipCodePlaceholder")}
          error={!isValidZipCode && attempted}
        />
      </div>
      {!isValidZipCode && attempted && (
        <div className="red fin mts">
          <InlineIcon className="mrxs">error</InlineIcon>{" "}
          {t("SearchAndFilter.locationFilterZipCodeInvalid")}
        </div>
      )}
    </section>
  );
};
