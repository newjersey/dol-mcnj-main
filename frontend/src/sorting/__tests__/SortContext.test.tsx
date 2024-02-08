import { sortReducer } from "../SortContext";
import { SortOrder } from "../SortOrder";

describe("sortReducer", () => {
  it("should update the sort order in the state", () => {
    const initialState = { sortOrder: SortOrder.BEST_MATCH };
    const newSortOrder = SortOrder.COST_HIGH_TO_LOW;

    const newState = sortReducer(initialState, newSortOrder);

    expect(newState.sortOrder).toBe(newSortOrder);
  });
});