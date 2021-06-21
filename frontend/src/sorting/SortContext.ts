/* eslint-disable  @typescript-eslint/no-redeclare */

import { SortOrder } from "./SortOrder";
import { Reducer, Dispatch } from "react";
import React from "react";

export const initialSortState = {
  sortOrder: SortOrder.BEST_MATCH,
};

export type SortReducer = Reducer<SortState, SortOrder>;

export const SortContext = React.createContext<SortContext>({
  dispatch: () => {},
  state: initialSortState,
});

interface SortContext {
  state: SortState;
  dispatch: Dispatch<SortOrder>;
}

interface SortState {
  sortOrder: SortOrder;
}

export const sortReducer = (state: SortState, newSortOrder: SortOrder): SortState => {
  return {
    ...state,
    sortOrder: newSortOrder,
  };
};
