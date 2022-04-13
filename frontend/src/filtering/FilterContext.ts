/* eslint-disable  @typescript-eslint/no-redeclare */

import React, { Dispatch, Reducer } from "react";
import { Filter } from "../domain/Filter";

export const initialFilterState = {
  filters: [],
};

export const FilterContext = React.createContext<FilterContext>({
  dispatch: () => {},
  state: initialFilterState,
});

interface FilterContext {
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
}

export type FilterReducer = Reducer<FilterState, FilterAction>;

interface FilterState {
  filters: Filter[];
}

export interface FilterAction {
  type: FilterActionType;
  filter?: Filter;
}

export enum FilterActionType {
  ADD,
  REMOVE,
  REMOVE_ALL,
}

const removeFilter = (filter: Filter | undefined, list: Filter[]): Filter[] => {
  if (filter == null) return list;
  return list.filter((it: Filter) => it.element !== filter.element);
};

export const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case FilterActionType.ADD:
      if (action.filter == null) return state;
      return {
        ...state,
        filters: [...removeFilter(action.filter, state.filters), action.filter],
      };
    case FilterActionType.REMOVE:
      if (action.filter == null) return state;
      return {
        ...state,
        filters: removeFilter(action.filter, state.filters),
      };
    case FilterActionType.REMOVE_ALL:
      return initialFilterState;
    default:
      throw new Error();
  }
};
