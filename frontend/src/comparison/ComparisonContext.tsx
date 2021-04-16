import React, { Dispatch, Reducer } from "react";
import { TrainingResult } from "../domain/Training";

export const initialComparisonState = {
  comparison: [],
};

export const ComparisonContext = React.createContext<ComparisonContext>({
  dispatch: () => {},
  state: initialComparisonState,
});

interface ComparisonContext {
  state: ComparisonState;
  dispatch: Dispatch<ComparisonAction>;
}

export type ComparisonReducer = Reducer<ComparisonState, ComparisonAction>;

interface ComparisonState {
  comparison: TrainingResult[];
}

export interface ComparisonAction {
  type: ComparisonActionType;
  comparison: TrainingResult;
  list: TrainingResult[];
}

export enum ComparisonActionType {
  ADD,
  REMOVE,
  REMOVE_ALL,
}

const addComparison = (comparison: TrainingResult, list: TrainingResult[]): TrainingResult[] => {
  return [...list, comparison];
};

const removeComparison = (comparison: TrainingResult, list: TrainingResult[]): TrainingResult[] => {
  return list.filter((el) => el !== comparison);
};

const removeAllComparison = (): TrainingResult[] => {
  return initialComparisonState.comparison;
};

export const comparisonReducer = (
  state: ComparisonState,
  action: ComparisonAction
): ComparisonState => {
  switch (action.type) {
    case ComparisonActionType.ADD:
      return {
        ...state,
        comparison: addComparison(action.comparison, state.comparison),
      };

    case ComparisonActionType.REMOVE:
      return {
        ...state,
        comparison: removeComparison(action.comparison, state.comparison),
      };

    case ComparisonActionType.REMOVE_ALL:
      return {
        ...state,
        comparison: removeAllComparison(),
      };

    default:
      throw new Error();
  }
};
