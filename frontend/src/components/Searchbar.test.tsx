import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { Searchbar } from "./Searchbar";
import { en as Content } from "../locales/en";

const { searchBarDefaultPlaceholderText } = Content.SearchAndFilterStrings;

describe("<Searchbar />", () => {
  it("sets an initial value to the input if provided", () => {
    const subject = render(<Searchbar onSearch={jest.fn()} initialValue="pelicans" />);
    expect(subject.getByPlaceholderText(searchBarDefaultPlaceholderText)).toHaveValue("pelicans");
  });

  it("executes search on clicking button", () => {
    const spyOnSearch = jest.fn();
    const subject = render(<Searchbar onSearch={spyOnSearch} />);
    fireEvent.change(subject.getByPlaceholderText(searchBarDefaultPlaceholderText), {
      target: { value: "penguins" },
    });
    fireEvent.click(subject.getByText("Search"));
    expect(spyOnSearch).toHaveBeenCalledWith("penguins");
  });

  it("executes search on Enter key", () => {
    const spyOnSearch = jest.fn();
    const subject = render(<Searchbar onSearch={spyOnSearch} />);
    fireEvent.change(subject.getByPlaceholderText(searchBarDefaultPlaceholderText), {
      target: { value: "penguins" },
    });
    fireEvent.keyDown(subject.getByPlaceholderText(searchBarDefaultPlaceholderText), {
      key: "Enter",
      code: "Enter",
    });
    expect(spyOnSearch).toHaveBeenCalledWith("penguins");
  });
});
