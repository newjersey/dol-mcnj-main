import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { Searchbar } from "./Searchbar";

describe("<Searchbar />", () => {
  it("sets an initial value to the input if provided", () => {
    const subject = render(<Searchbar onSearch={jest.fn()} initialValue="pelicans" />);
    expect(subject.getByPlaceholderText("Search for training courses")).toHaveValue("pelicans");
  });

  it("executes search on clicking button", () => {
    const spyOnSearch = jest.fn();
    const subject = render(<Searchbar onSearch={spyOnSearch} />);
    fireEvent.change(subject.getByPlaceholderText("Search for training courses"), {
      target: { value: "penguins" },
    });
    fireEvent.click(subject.getByText("Search"));
    expect(spyOnSearch).toHaveBeenCalledWith("penguins");
  });

  it("executes search on Enter key", () => {
    const spyOnSearch = jest.fn();
    const subject = render(<Searchbar onSearch={spyOnSearch} />);
    fireEvent.change(subject.getByPlaceholderText("Search for training courses"), {
      target: { value: "penguins" },
    });
    fireEvent.keyDown(subject.getByPlaceholderText("Search for training courses"), {
      key: "Enter",
      code: "Enter",
    });
    expect(spyOnSearch).toHaveBeenCalledWith("penguins");
  });
});
