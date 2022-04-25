import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { FormControlLabel, FormGroup } from "@material-ui/core";
import { SpacedCheckbox } from "../components/SpacedCheckbox";
import { SearchAndFilterStrings } from "../localizations/SearchAndFilterStrings";

interface ProgramServices {
  hasEveningCourses: boolean;
  isWheelchairAccessible: boolean;
  hasJobPlacementAssistance: boolean;
}

const INITIAL_STATE = {
  hasEveningCourses: false,
  isWheelchairAccessible: false,
  hasJobPlacementAssistance: false,
};

const SERVICE_TO_FILTER = {
  hasEveningCourses: FilterableElement.EVENING_COURSES,
  isWheelchairAccessible: FilterableElement.WHEELCHAIR_ACCESSIBLE,
  hasJobPlacementAssistance: FilterableElement.JOB_PLACEMENT_ASSISTANCE,
};

export const ProgramServicesFilter = (): ReactElement => {
  const { state, dispatch } = useContext(FilterContext);
  const [programServices, setProgramServices] = useState<ProgramServices>(INITIAL_STATE);

  useEffect(() => {
    const eveningCoursesFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.EVENING_COURSES
    );
    const wheelchairAccessibleFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.WHEELCHAIR_ACCESSIBLE
    );
    const jobPlacementAssistFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.JOB_PLACEMENT_ASSISTANCE
    );
    if (eveningCoursesFilter || wheelchairAccessibleFilter || jobPlacementAssistFilter) {
      setProgramServices((prevValue) => ({
        ...prevValue,
        hasEveningCourses: eveningCoursesFilter?.value ?? prevValue.hasEveningCourses,
        isWheelchairAccessible:
          wheelchairAccessibleFilter?.value ?? prevValue.isWheelchairAccessible,
        hasJobPlacementAssistance:
          jobPlacementAssistFilter?.value ?? prevValue.hasJobPlacementAssistance,
      }));
    } else if (
      eveningCoursesFilter == null &&
      wheelchairAccessibleFilter == null &&
      jobPlacementAssistFilter == null &&
      Object.values(programServices).some((v) => v)
    ) {
      setProgramServices(INITIAL_STATE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    const filterName = event.target.name;
    setProgramServices((prevValue) => ({
      ...prevValue,
      [filterName]: checked,
    }));

    dispatch({
      type: checked ? FilterActionType.ADD : FilterActionType.REMOVE,
      filter: {
        element: SERVICE_TO_FILTER[filterName as keyof typeof SERVICE_TO_FILTER], // Checkbox names must be of FilterableElement type
        value: checked,
        func: (trainingResults): TrainingResult[] => {
          switch (filterName) {
            case "hasEveningCourses":
              return trainingResults.filter((it) => it.hasEveningCourses);
            case "isWheelchairAccessible":
              return trainingResults.filter((it) => it.isWheelchairAccessible);
            case "hasJobPlacementAssistance":
              return trainingResults.filter((it) => it.hasJobPlacementAssistance);
            default:
              return trainingResults;
          }
        },
      },
    });
  };

  return (
    <label className="bold" htmlFor="programServices">
      {SearchAndFilterStrings.programServicesFilterLabel}
      <FormGroup id="programServices">
        <FormControlLabel
          control={
            <SpacedCheckbox
              checked={programServices.isWheelchairAccessible}
              onChange={handleCheckboxChange}
              name="isWheelchairAccessible"
              color="primary"
            />
          }
          label={SearchAndFilterStrings.wheelChairAccessibleLabel}
        />
        <FormControlLabel
          control={
            <SpacedCheckbox
              checked={programServices.hasJobPlacementAssistance}
              onChange={handleCheckboxChange}
              name="hasJobPlacementAssistance"
              color="primary"
            />
          }
          label={SearchAndFilterStrings.jobPlacementAssistLabel}
        />
        <FormControlLabel
          control={
            <SpacedCheckbox
              checked={programServices.hasEveningCourses}
              onChange={handleCheckboxChange}
              name="hasEveningCourses"
              color="primary"
            />
          }
          label={SearchAndFilterStrings.eveningCoursesLabel}
        />
      </FormGroup>
    </label>
  );
};
