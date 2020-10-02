import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { FormControlLabel, FormGroup } from "@material-ui/core";
import { SpacedCheckbox } from "../components/SpacedCheckbox";

interface ClassFormat {
  online: boolean;
  inPerson: boolean;
}

export const ClassFormatFilter = (): ReactElement => {
  const [classFormat, setClassFormat] = useState<ClassFormat>({
    online: false,
    inPerson: false,
  });

  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const classFormatFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.CLASS_FORMAT
    );
    if (classFormatFilter) {
      setClassFormat(classFormatFilter.value);
    }
  }, [state.filters]);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    const newClassFormat = {
      ...classFormat,
      [event.target.name]: checked,
    };

    setClassFormat(newClassFormat);

    const nothingIsChecked = Object.values(newClassFormat).every((value) => !value);

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
      Class Format
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
          label="In-Person"
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
          label="Online"
        />
      </FormGroup>
    </label>
  );
};
