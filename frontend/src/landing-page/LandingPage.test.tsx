import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { LandingPage } from "./LandingPage";
import { navigate } from "@reach/router";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
}));

describe("<LandingPage />", () => {
  it("links to search results page when search is executed", () => {
    const subject = render(<LandingPage />);
    fireEvent.change(subject.getByPlaceholderText("Search for training courses"), {
      target: { value: "penguins" },
    });
    fireEvent.click(subject.getByText("Search"));
    expect(navigate).toHaveBeenCalledWith("/search/penguins");
  });
});
