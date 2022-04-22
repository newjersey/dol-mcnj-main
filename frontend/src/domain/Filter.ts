import { TrainingResult } from "./Training";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Filter {
  func: (trainingResults: TrainingResult[]) => TrainingResult[];
  element: FilterableElement;
  value: any;
}

export enum FilterableElement {
  MAX_COST,
  TIME_TO_COMPLETE,
  CLASS_FORMAT,
  LOCATION,
  IN_DEMAND_ONLY,
  SOC_CODE,
  CIP_CODE,
  COUNTY,
  EVENING_COURSES,
  LANGUAGES,
}
