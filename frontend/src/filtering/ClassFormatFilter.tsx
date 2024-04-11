import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { FormControlLabel, FormGroup } from "@material-ui/core";
import { SpacedCheckbox } from "../components/SpacedCheckbox";
import { useTranslation } from "react-i18next";

interface ClassFormat {
  online: boolean;
  inPerson: boolean;
}

const INITIAL_STATE = {
  online: false,
  inPerson: false,
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
    const inPerson = urlParams.get("inPerson");
    const online = urlParams.get("online");
    const inPersonCheckbox = document.getElementsByName("inPerson")[0] as HTMLInputElement;
    const onlineCheckbox = document.getElementsByName("online")[0] as HTMLInputElement;

    if (online === "true") {
      if (onlineCheckbox && !onlineCheckbox.checked) {
        setTimeout(() => {
          onlineCheckbox.click();
        }, 200);
      }
    }

    if (inPerson === "true") {
      if (inPersonCheckbox && !inPersonCheckbox.checked) {
        setTimeout(() => {
          inPersonCheckbox.click();
        }, 200);
      }
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

    if (newClassFormat.inPerson) {
      urlParams.set("inPerson", "true");
      window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
    } else {
      urlParams.delete("inPerson");
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
            return (newClassFormat.inPerson && !it.online) || (newClassFormat.online && it.online);
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
              checked={classFormat.inPerson}
              onChange={handleCheckboxChange}
              name="inPerson"
              color="primary"
            />
          }
          label={t("SearchAndFilter.classFormatInPersonLabel")}
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
