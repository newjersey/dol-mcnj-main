/* eslint-disable  @typescript-eslint/no-redeclare */

import React, { Dispatch, Reducer } from "react";
import { logEvent } from "../analytics";
import { Filter, FilterableElement } from "../domain/Filter";

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

const ACTION_TO_EVENT_ACTION: { [key in FilterActionType]: string } = {
  [FilterActionType.ADD]: "Added filters",
  [FilterActionType.REMOVE]: "Removed filters",
  [FilterActionType.REMOVE_ALL]: "Cleared filters",
};

const removeFilter = (filter: Filter | undefined, list: Filter[]): Filter[] => {
  if (filter == null) return list;
  return list.filter((it: Filter) => it.element !== filter.element);
};

const logFilterEvent = (filters: Filter[], action: FilterActionType): void => {
  const formattedFilters = filters.map((f) => {
    let loggedFilterValue = f.value;
    if (f.element === FilterableElement.LOCATION) {
      loggedFilterValue = [f.value.center, f.value.radius];
    }
    if (
      typeof loggedFilterValue === "object" &&
      loggedFilterValue != null &&
      !Array.isArray(loggedFilterValue)
    ) {
      loggedFilterValue = Object.entries(loggedFilterValue)
        .filter(([key, val]) => val === true)
        .map(([key, val]) => key);
    }
    return {
      type: FilterableElement[f.element],
      value: Array.isArray(loggedFilterValue)
        ? loggedFilterValue.join(",")
        : String(loggedFilterValue),
    };
  });

  logEvent("Search", ACTION_TO_EVENT_ACTION[action], JSON.stringify(formattedFilters));
};

export const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case FilterActionType.ADD: {
      if (action.filter == null) return state;
      const newFilters = [...removeFilter(action.filter, state.filters), action.filter];
      logFilterEvent(newFilters, action.type);
      return {
        ...state,
        filters: newFilters,
      };
    }
    case FilterActionType.REMOVE: {
      if (action.filter == null) return state;
      const newFilters = removeFilter(action.filter, state.filters);
      logFilterEvent(newFilters, action.type);
      return {
        ...state,
        filters: newFilters,
      };
    }
    case FilterActionType.REMOVE_ALL:
      return initialFilterState;
    default:
      throw new Error();
  }
};
