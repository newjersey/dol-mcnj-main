import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { FormControlLabel, FormGroup } from "@material-ui/core";
import { SpacedCheckbox } from "../components/SpacedCheckbox";
import { useTranslation } from "react-i18next";

interface ClassFormat {
  online: boolean;
  inperson: boolean;
}

const INITIAL_STATE = {
  online: false,
  inperson: false,
};

export const ClassFormatFilter = (): ReactElement => {
  const { t } = useTranslation();

  const [classFormat, setClassFormat] = useState<ClassFormat>(INITIAL_STATE);

  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const classFormatFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.CLASS_FORMAT,
    );
    if (classFormatFilter) {
      setClassFormat(classFormatFilter.value);
    } else if (classFormatFilter == null && Object.values(classFormat).some((val) => val)) {
      setClassFormat(INITIAL_STATE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inperson = urlParams.get("inperson");
    const online = urlParams.get("online");

    if (inperson === "true") {
      classFormat.inperson = true;
    }
    if (online === "true") {
      classFormat.online = true;
    }

    if (inperson === "true" || online === "true") {
      const classFormatArray = Object.entries(classFormat).filter(([, value]) => value);

      classFormatArray.forEach(([key]) => {
        handleCheckboxChange({ target: { name: key } } as ChangeEvent<HTMLInputElement>, true);
      });
    }
  }, []);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    const newClassFormat = {
      ...classFormat,
      [event.target.name]: checked,
    };

    setClassFormat(newClassFormat);

    const nothingIsChecked = Object.values(newClassFormat).every((value) => !value);

    const urlParams = new URLSearchParams(window.location.search);

    if (newClassFormat.inperson) {
      urlParams.set("inperson", "true");
      window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
    } else {
      urlParams.delete("inperson");
      window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
    }

    if (newClassFormat.online) {
      urlParams.set("online", "true");
      window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
    } else {
      urlParams.delete("online");
      window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
    }

    dispatch({
      type: nothingIsChecked ? FilterActionType.REMOVE : FilterActionType.ADD,
      filter: {
        element: FilterableElement.CLASS_FORMAT,
        value: newClassFormat,
        func: (trainingResults): TrainingResult[] =>
          trainingResults.filter((it) => {
            return (newClassFormat.inperson && !it.online) || (newClassFormat.online && it.online);
          }),
      },
    });
  };

  return (
    <label className="bold" htmlFor="classFormat">
      {t("SearchAndFilter.classFormatFilterLabel")}
      <FormGroup id="classFormat">
        <FormControlLabel
          control={
            <SpacedCheckbox
              checked={classFormat.inperson}
              onChange={handleCheckboxChange}
              name="inperson"
              color="primary"
            />
          }
          label={t("SearchAndFilter.classFormatinpersonLabel")}
        />
        <FormControlLabel
          control={
            <SpacedCheckbox
              checked={classFormat.online}
              onChange={handleCheckboxChange}
              name="online"
              color="primary"
            />
          }
          label={t("SearchAndFilter.classFormatOnlineLabel")}
        />
      </FormGroup>
    </label>
  );
};
