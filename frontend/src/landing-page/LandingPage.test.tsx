import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { LandingPage } from "./LandingPage";
import { navigate } from "@reach/router";
import { SearchAndFilterStrings } from "../localizations/SearchAndFilterStrings";
import { LandingPageStrings } from "../localizations/LandingPageStrings";

/* eslint-disable @typescript-eslint/explicit-function-return-type */
function mockReachRouter() {
  const original = jest.requireActual("@reach/router");
  return {
    ...original,
    navigate: jest.fn(),
  };
}

jest.mock("@reach/router", () => mockReachRouter());

const { searchButtonDefaultText } = SearchAndFilterStrings;
const { searchBoxPlaceholder } = LandingPageStrings;

describe("<LandingPage />", () => {
  it("links to search results page when search is executed", () => {
    const subject = render(<LandingPage />);
    fireEvent.change(subject.getByPlaceholderText(searchBoxPlaceholder), {
      target: { value: "penguins" },
    });
    fireEvent.click(subject.getByText(searchButtonDefaultText));
    expect(navigate).toHaveBeenCalledWith("/search/penguins");
  });

  it("encodes uri components in search query", () => {
    const subject = render(<LandingPage />);
    fireEvent.change(subject.getByPlaceholderText(searchBoxPlaceholder), {
      target: { value: "penguins / penglings" },
    });
    fireEvent.click(subject.getByText(searchButtonDefaultText));
    expect(navigate).toHaveBeenCalledWith("/search/penguins%20%2F%20penglings");
  });
});
