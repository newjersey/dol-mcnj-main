import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { Input } from "../components/Input";
import { InlineIcon } from "../components/InlineIcon";
import { useTranslation } from "react-i18next";

function isValidCipCode(cip: string): boolean {
  if (cip === "") return true;
  return /^[0-9]{6}$/.test(cip);
}

const INPUT_PROPS = {
  style: {
    padding: "6px 12px",
  },
};

export const CipCodeFilter = (): ReactElement => {
  const { t } = useTranslation();

  const [cipCode, setCipCode] = useState<string>("");
  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const cipCodeFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.CIP_CODE
    );
    if (cipCodeFilter != null && cipCodeFilter.value !== cipCode) {
      setCipCode(cipCodeFilter.value);
    } else if (cipCodeFilter == null && cipCode !== "") {
      setCipCode("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      applyFilter();
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setCipCode(event.target.value);
  };

  const validCipCode = isValidCipCode(cipCode);

  const applyFilter = (): void => {
    if (cipCode.length > 0 && !validCipCode) {
      return;
    }

    if (cipCode.length > 0 || state.filters.some((f) => f.element === FilterableElement.CIP_CODE)) {
      dispatch({
        type: cipCode !== "" ? FilterActionType.ADD : FilterActionType.REMOVE,
        filter: {
          element: FilterableElement.CIP_CODE,
          value: cipCode,
          func: (trainingResults): TrainingResult[] =>
            trainingResults.filter((it) => it.cipCode === cipCode),
        },
      });
    }
  };

  return (
    <>
      <label htmlFor="cipCode" className="fin">
        {t("SearchAndFilterStrings.cipCodeFilterLabel")}
        <span className="fin mld">
          <Input
            id="cipCode"
            value={cipCode}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={applyFilter}
            placeholder="i.e. 011102"
            error={!validCipCode}
            inputProps={INPUT_PROPS}
          />
        </span>
      </label>
      {!validCipCode && (
        <div className="red fin mts">
          <InlineIcon className="mrxs">error</InlineIcon>{" "}
          {t("SearchAndFilterStrings.invalidCipCodeError")}
        </div>
      )}
    </>
  );
};
