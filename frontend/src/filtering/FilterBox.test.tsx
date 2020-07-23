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
        <FilterBox>
          <div />
        </FilterBox>
      </FilterContext.Provider>
    );
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
    const subject = render(
      <FilterBox>
        <div />
      </FilterBox>
    );
    expect(subject.getByLabelText("Max Cost", { exact: false })).not.toBeVisible();
    fireEvent.click(subject.getByText("Filters"));
    expect(subject.getByLabelText("Max Cost", { exact: false })).toBeVisible();
  });

  it("[DESKTOP] shows filter panel by default with no toggle button", () => {
    useDesktopSize();
    const subject = render(
      <FilterBox>
        <div />
      </FilterBox>
    );
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
