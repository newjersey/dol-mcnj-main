import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TrainingSearch } from "./TrainingSearch";

describe("TrainingSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<TrainingSearch />);
    expect(screen.getByText("Search for training")).toBeInTheDocument();
  });

  it('clears all inputs when the "Clear All" button is clicked', () => {
    render(<TrainingSearch />);
    const searchInput = document.querySelector(
      "#searchInput"
    ) as HTMLInputElement;

    const maxCostInput = document.querySelector("#maxCost") as HTMLInputElement;

    fireEvent.change(searchInput, {
      target: { value: "test search" },
    });
    fireEvent.change(maxCostInput, {
      target: { value: "1000" },
    });

    fireEvent.click(screen.getByText("Clear All"));
    expect(searchInput).toHaveValue("");
    expect(maxCostInput).toHaveValue(null);
  });

  it("handles search input changes correctly", () => {
    render(<TrainingSearch />);
    const searchInput = document.querySelector(
      "#searchInput"
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "new search term" } });
    expect(searchInput).toHaveValue("new search term");
  });

  it("shows error for invalid zip code", () => {
    render(<TrainingSearch />);
    const zipInput = document.querySelector("#zip") as HTMLInputElement;

    fireEvent.change(zipInput, { target: { value: "12345" } });
    fireEvent.blur(zipInput);
    expect(
      screen.getByText("Please enter a 5-digit New Jersey ZIP code.")
    ).toBeInTheDocument();
  });

  it("does not show error for valid zip code", () => {
    render(<TrainingSearch />);
    const zipInput = document.querySelector("#zip") as HTMLInputElement;
    fireEvent.change(zipInput, { target: { value: "07001" } });
    fireEvent.blur(zipInput);
    expect(
      screen.queryByText("Please enter a 5-digit New Jersey ZIP code.")
    ).not.toBeInTheDocument();
  });

  it("handles form submission correctly", () => {
    const mockLocation = {
      href: "",
      assign: jest.fn(),
      reload: jest.fn(),
      replace: jest.fn(),
    };

    Object.defineProperty(window, "location", {
      writable: true,
      value: mockLocation,
    });

    render(<TrainingSearch />);

    const searchInput = document.querySelector(
      "#searchInput"
    ) as HTMLInputElement;

    fireEvent.change(searchInput, {
      target: { value: "test search" },
    });
    // click #search-button
    const searchButton = document.querySelector(
      "#search-button"
    ) as HTMLButtonElement;
    fireEvent.click(searchButton);
    // check the url after form submission
    expect(window.location.href).toBe("/training/search?q=test+search");
  });

  it("handles in-person and online checkboxes correctly", () => {
    render(<TrainingSearch />);

    const inPersonCheckbox = document.querySelector(
      "#in-person"
    ) as HTMLInputElement;

    const onlineCheckbox = document.querySelector(
      "#online"
    ) as HTMLInputElement;

    fireEvent.click(inPersonCheckbox);
    fireEvent.click(onlineCheckbox);
    expect(inPersonCheckbox).toBeChecked();
    expect(onlineCheckbox).toBeChecked();
  });

  it("handles miles select correctly", () => {
    render(<TrainingSearch />);
    const milesSelect = document.querySelector("#miles") as HTMLSelectElement;

    fireEvent.change(milesSelect, { target: { value: "10" } });
    expect(milesSelect).toHaveValue("10");
  });

  it("handles max cost input correctly", () => {
    render(<TrainingSearch />);

    const maxCostInput = document.querySelector("#maxCost") as HTMLInputElement;

    fireEvent.change(maxCostInput, { target: { value: "500" } });
    expect(maxCostInput).toHaveValue(500);
  });

  it("handles zip code input and validation correctly", () => {
    render(<TrainingSearch />);
    const zipInput = document.querySelector("#zip") as HTMLInputElement;
    fireEvent.change(zipInput, { target: { value: "07001" } });
    fireEvent.blur(zipInput);
    expect(
      screen.queryByText("Please enter a 5-digit New Jersey ZIP code.")
    ).not.toBeInTheDocument();
    fireEvent.change(zipInput, { target: { value: "12345" } });
    fireEvent.blur(zipInput);
    expect(
      screen.getByText("Please enter a 5-digit New Jersey ZIP code.")
    ).toBeInTheDocument();
  });
});
