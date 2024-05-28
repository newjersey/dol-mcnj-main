// import { TrainingResult } from "../domain/Training";
// import { Filter, FilterableElement } from "../domain/Filter";
// import { fireEvent, render, RenderResult, screen } from "@testing-library/react";
// import { FilterContext } from "./FilterContext";
// import { FilterBox } from "./FilterBox";
// import { useMediaQuery } from "@material-ui/core";
// import { en as Content } from "../locales/en";
// import { act } from "react-dom/test-utils";

// // TODO: Redo all tests for filters

// /* eslint-disable @typescript-eslint/explicit-function-return-type */
// function mockFunctions() {
//   const original = jest.requireActual("@material-ui/core");
//   return {
//     ...original,
//     useMediaQuery: jest.fn(),
//   };
// }

// jest.mock("@material-ui/core", () => mockFunctions());

// const { mobileFilterText, maxCostLabel, searchButtonDefaultText, searchButtonUpdateResultsText } =
//   Content.SearchAndFilter;

// describe.skip("<FilterBox />", () => {
//   const renderWithFilters = (filters: Filter[]): RenderResult | void => {
//     const state = {
//       filters: filters,
//     };
  
//     return act(() => {
//       render(
//         <FilterContext.Provider value={{ state: state, dispatch: jest.fn() }}>
//           <FilterBox
//             searchQuery={"some-query"}
//             resultCount={1}
//             setShowTrainings={jest.fn()}
//             resetStateForReload={jest.fn()}
//           >
//             <div />
//           </FilterBox>
//         </FilterContext.Provider>,
//       );
//     });
//   };

//   const renderFilterBox = ({ resultCount = 1, setShowTrainings = jest.fn() }): RenderResult => {
//     return render(
//       <FilterBox
//         searchQuery={"some-query"}
//         resultCount={resultCount}
//         setShowTrainings={setShowTrainings}
//         resetStateForReload={jest.fn()}
//       >
//         <div />
//       </FilterBox>,
//     );
//   };

//   const renderEmptyFilterBox = ({
//     resultCount = 0,
//     setShowTrainings = jest.fn(),
//   }): RenderResult => {
//     return render(
//       <FilterBox
//         searchQuery={undefined}
//         resultCount={resultCount}
//         setShowTrainings={setShowTrainings}
//         resetStateForReload={jest.fn()}
//       >
//         <div />
//       </FilterBox>,
//     );
//   };

//   it("sets initial filter value from context if present", () => {
//     renderWithFilters([
//       {
//         func: (results: TrainingResult[]): TrainingResult[] => results,
//         element: FilterableElement.MAX_COST,
//         value: "5000",
//       },
//     ]);

//     expect(screen.getByLabelText(maxCostLabel, { exact: false })).toHaveValue(5000);
//   });

//   it("[MOBILE] has default-color text when no filter applied", () => {
//     useMobileSize();
//     renderWithFilters([]);

//     expect(screen.getByText(mobileFilterText, { exact: false })).not.toHaveClass("blue");
//   });

//   it("[MOBILE] has blue text when a filter is applied", () => {
//     useMobileSize();
//     renderWithFilters([
//       {
//         func: (results: TrainingResult[]): TrainingResult[] => results,
//         element: FilterableElement.MAX_COST,
//         value: "5000",
//       },
//     ]);
//     expect(screen.getByText(mobileFilterText, { exact: false })).toHaveClass("blue");
//   });

//   it("[MOBILE] opens and closes filter panel on button push", () => {
//     useMobileSize();
//     renderFilterBox({});
//     expect(screen.getByLabelText(maxCostLabel, { exact: false })).not.toBeVisible();
//     fireEvent.click(screen.getByText(mobileFilterText));
//     expect(screen.getByLabelText(maxCostLabel, { exact: false })).toBeVisible();
//   });

//   it("[MOBILE] changes arrow to indicate open/close state", () => {
//     useMobileSize();
//     renderFilterBox({});

//     expect(screen.queryByText("keyboard_arrow_down")).toBeInTheDocument();
//     expect(screen.queryByText("keyboard_arrow_up")).not.toBeInTheDocument();

//     fireEvent.click(screen.getByText(mobileFilterText));

//     expect(screen.queryByText("keyboard_arrow_down")).not.toBeInTheDocument();
//     expect(screen.queryByText("keyboard_arrow_up")).toBeInTheDocument();
//   });

//   it("[MOBILE] closes the filter panel when search is executed", () => {
//     useMobileSize();
//     renderFilterBox({});
//     fireEvent.click(screen.getByText(mobileFilterText));
//     expect(screen.getByLabelText(maxCostLabel, { exact: false })).toBeVisible();

//     fireEvent.click(screen.getByText(searchButtonUpdateResultsText));

//     expect(screen.getByLabelText(maxCostLabel, { exact: false })).not.toBeVisible();
//   });

//   it("[MOBILE] displays the number of search results", () => {
//     useMobileSize();
//     renderFilterBox({ resultCount: 50 });
//     fireEvent.click(screen.getByText(mobileFilterText));

//     setTimeout(() => {
//       expect(screen.getByText("50 results")).toBeInTheDocument();
//     }, 1000);
//   });

//   it("[MOBILE] uses correct grammar on result count", () => {
//     useMobileSize();
//     renderFilterBox({ resultCount: 1 });
//     fireEvent.click(screen.getByText(mobileFilterText));

//     setTimeout(() => {
//       expect(screen.getByText("1 result")).toBeInTheDocument();
//     }, 1000);
//   });

//   it("[MOBILE] displays search bar if no search query is given", () => {
//     useMobileSize();
//     renderEmptyFilterBox({});

//     expect(screen.getAllByText(searchButtonDefaultText)[0]).toBeInTheDocument();
//     expect(screen.queryByText(searchButtonUpdateResultsText)).not.toBeInTheDocument();
//   });

//   it("triggers setShowTrainings on screen size change", () => {
//     useDesktopSize();
//     const mockCallback = jest.fn();
//     renderFilterBox({ setShowTrainings: mockCallback });
//     expect(mockCallback).toHaveBeenLastCalledWith(true);
//   });

//   it("[DESKTOP] shows filter panel by default with no toggle button", () => {
//     useDesktopSize();
//     renderFilterBox({});
//     expect(screen.getByLabelText(maxCostLabel, { exact: false })).toBeVisible();
//     expect(screen.queryByText("Filters")).not.toBeInTheDocument();
//   });

//   const useDesktopSize = (): void => {
//     (useMediaQuery as jest.Mock).mockImplementation(() => true);
//   };

//   const useMobileSize = (): void => {
//     (useMediaQuery as jest.Mock).mockImplementation(() => false);
//   };
// });
