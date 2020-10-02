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
  filter: Filter;
}

export enum FilterActionType {
  ADD,
  REMOVE,
}

const removeFilter = (filter: Filter, list: Filter[]): Filter[] => {
  return list.filter((it: Filter) => it.element !== filter.element);
};

export const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case FilterActionType.ADD:
      return {
        ...state,
        filters: [...removeFilter(action.filter, state.filters), action.filter],
      };
    case FilterActionType.REMOVE:
      return {
        ...state,
        filters: removeFilter(action.filter, state.filters),
      };

    default:
      throw new Error();
  }
};
