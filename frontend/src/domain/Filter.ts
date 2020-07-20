import { TrainingResult } from "./Training";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Filter {
  func: (trainingResults: TrainingResult[]) => TrainingResult[];
  element: FilterableElement;
  value: any;
}

export enum FilterableElement {
  MAX_COST,
}
