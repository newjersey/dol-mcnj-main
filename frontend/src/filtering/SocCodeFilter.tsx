import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { Input } from "../components/Input";
import { InlineIcon } from "../components/InlineIcon";
import { useTranslation } from "react-i18next";

function isValidSocCode(soc: string): boolean {
  if (soc === "") return true;
  return /(^\d{2}-\d{4}$)/.test(soc);
}

const INPUT_PROPS = {
  style: {
    padding: "6px 12px",
  },
};

export const SocCodeFilter = (): ReactElement => {
  const { t } = useTranslation();
  const [socCode, setSocCode] = useState<string>("");
  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const socCodeFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.SOC_CODE
    );
    if (socCodeFilter != null && socCodeFilter.value !== socCode) {
      setSocCode(socCodeFilter.value);
    } else if (socCodeFilter == null && socCode !== "") {
      setSocCode("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      applyFilter();
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setSocCode(event.target.value);
  };

  const validSocCode = isValidSocCode(socCode);

  const applyFilter = (): void => {
    if (socCode.length > 0 && !validSocCode) {
      return;
    }

    if (socCode.length > 0 || state.filters.some((f) => f.element === FilterableElement.SOC_CODE)) {
      dispatch({
        type: socCode !== "" ? FilterActionType.ADD : FilterActionType.REMOVE,
        filter: {
          element: FilterableElement.SOC_CODE,
          value: socCode,
          func: (trainingResults): TrainingResult[] =>
            trainingResults.filter((it) => it.socCodes.includes(socCode)),
        },
      });
    }
  };

  return (
    <>
      <label htmlFor="socCode" className="fin">
        {t("SearchAndFilter.socCodeFilterLabel")}
        <span className="fin mld">
          <Input
            id="socCode"
            value={socCode}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={applyFilter}
            placeholder="i.e. 43-9041"
            error={!validSocCode}
            inputProps={INPUT_PROPS}
          />
        </span>
      </label>
      {!validSocCode && (
        <div className="red fin mts">
          <InlineIcon className="mrxs">error</InlineIcon> {t("SearchAndFilter.invalidSocCodeError")}
        </div>
      )}
    </>
  );
};
