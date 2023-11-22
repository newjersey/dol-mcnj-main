import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBlock } from "./SearchBlock";

describe("SearchBlock", () => {
  beforeEach(() => {
    render(<SearchBlock />);
  });

  test("renders search input correctly", () => {
    const searchInput = screen.getByTestId("search-input") as HTMLInputElement;
    expect(searchInput).toBeInTheDocument();
  });

  test("updates search term correctly", () => {
    const searchInput = screen.getByTestId("search-input") as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(searchInput.value).toBe("test");
  });

  test("clears all inputs correctly", () => {
    const searchInput = screen.getByTestId("search-input") as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "test" } });

    const clearAllButton = screen.getByText("Clear All");
    fireEvent.click(clearAllButton);

    expect(searchInput.value).toBe("");
  });

  test("submits search form correctly", () => {
    const searchInput = screen.getByTestId("search-input") as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "test" } });

    const form = screen.getByTestId("search-form");
    const submitMock = jest.fn();
    form.onsubmit = submitMock;

    const searchSubmitButton = screen.getByTestId("search-submit");
    fireEvent.click(searchSubmitButton);

    expect(submitMock).toHaveBeenCalled();
  });
});
