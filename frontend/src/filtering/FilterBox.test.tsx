import { TrainingResult } from "../domain/Training";
import { Filter, FilterableElement } from "../domain/Filter";
import { render, fireEvent, RenderResult } from "@testing-library/react";
import { FilterContext } from "../App";
import React from "react";
import { FilterBox } from "./FilterBox";
import { useMediaQuery } from "@material-ui/core";

/* eslint-disable @typescript-eslint/explicit-function-return-type */
function mockFunctions() {
  const original = jest.requireActual("@material-ui/core");
  return {
    ...original,
    useMediaQuery: jest.fn(),
  };
}

jest.mock("@material-ui/core", () => mockFunctions());

describe("<FilterBox />", () => {
  const renderWithFilters = (filters: Filter[]): RenderResult => {
    const state = {
      filters: filters,
    };

    return render(
      <FilterContext.Provider value={{ state: state, dispatch: jest.fn() }}>
        <FilterBox resultCount={1} setShowTrainings={jest.fn()} />
      </FilterContext.Provider>
    );
  };

  const renderFilterBox = ({ resultCount = 1, setShowTrainings = jest.fn() }): RenderResult => {
    return render(<FilterBox resultCount={resultCount} setShowTrainings={setShowTrainings} />);
  };

  it("sets initial filter value from context if present", () => {
    const subject = renderWithFilters([
      {
        func: (results: TrainingResult[]): TrainingResult[] => results,
        element: FilterableElement.MAX_COST,
        value: "5000",
      },
    ]);

    expect(subject.getByLabelText("Max Cost", { exact: false })).toHaveValue(5000);
  });

  it("[MOBILE] has default-color text when no filter applied", () => {
    useMobileSize();
    const subject = renderWithFilters([]);
    expect(subject.getByText("Filters", { exact: false })).not.toHaveClass("blue");
  });

  it("[MOBILE] has blue text when a filter is applied", () => {
    useMobileSize();
    const subject = renderWithFilters([
      {
        func: (results: TrainingResult[]): TrainingResult[] => results,
        element: FilterableElement.MAX_COST,
        value: "5000",
      },
    ]);
    expect(subject.getByText("Filters", { exact: false })).toHaveClass("blue");
  });

  it("[MOBILE] opens and closes filter panel on button push", () => {
    useMobileSize();
    const subject = renderFilterBox({});
    expect(subject.getByLabelText("Max Cost", { exact: false })).not.toBeVisible();
    fireEvent.click(subject.getByText("Filters"));
    expect(subject.getByLabelText("Max Cost", { exact: false })).toBeVisible();
  });

  it("[MOBILE] changes arrow to indicate open/close state", () => {
    useMobileSize();
    const subject = renderFilterBox({});

    expect(subject.queryByText("keyboard_arrow_down")).toBeInTheDocument();
    expect(subject.queryByText("keyboard_arrow_up")).not.toBeInTheDocument();

    fireEvent.click(subject.getByText("Filters"));

    expect(subject.queryByText("keyboard_arrow_down")).not.toBeInTheDocument();
    expect(subject.queryByText("keyboard_arrow_up")).toBeInTheDocument();
  });

  it("[MOBILE] closes the filter panel when search is executed", () => {
    useMobileSize();
    const subject = renderFilterBox({});
    fireEvent.click(subject.getByText("Filters"));
    expect(subject.getByLabelText("Max Cost", { exact: false })).toBeVisible();

    fireEvent.click(subject.getByText("Search"));

    expect(subject.getByLabelText("Max Cost", { exact: false })).not.toBeVisible();
  });

  it("[MOBILE] displays the number of search results", () => {
    useMobileSize();
    const subject = renderFilterBox({ resultCount: 50 });
    fireEvent.click(subject.getByText("Filters"));

    expect(subject.getByText("50 results")).toBeInTheDocument();
  });

  it("[MOBILE] uses correct grammar on result count", () => {
    useMobileSize();
    const subject = renderFilterBox({ resultCount: 1 });
    fireEvent.click(subject.getByText("Filters"));

    expect(subject.getByText("1 result")).toBeInTheDocument();
  });

  it("[MOBILE] triggers setShowTrainings when filter box is opened/closed", () => {
    useMobileSize();
    const mockCallback = jest.fn();
    const subject = renderFilterBox({ setShowTrainings: mockCallback });

    fireEvent.click(subject.getByText("Filters"));
    expect(mockCallback).toHaveBeenLastCalledWith(false);

    fireEvent.click(subject.getByText("Filters"));
    expect(mockCallback).toHaveBeenLastCalledWith(true);

    fireEvent.click(subject.getByText("Filters"));
    expect(mockCallback).toHaveBeenLastCalledWith(false);
  });

  it("triggers setShowTrainings on screen size change", () => {
    useDesktopSize();
    const mockCallback = jest.fn();
    renderFilterBox({ setShowTrainings: mockCallback });
    expect(mockCallback).toHaveBeenLastCalledWith(true);
  });

  it("[DESKTOP] shows filter panel by default with no toggle button", () => {
    useDesktopSize();
    const subject = renderFilterBox({});
    expect(subject.getByLabelText("Max Cost", { exact: false })).toBeVisible();
    expect(subject.getByText("Filters", { exact: false })).not.toBeVisible();
  });

  const useDesktopSize = (): void => {
    (useMediaQuery as jest.Mock).mockImplementation(() => true);
  };

  const useMobileSize = (): void => {
    (useMediaQuery as jest.Mock).mockImplementation(() => false);
  };
});
