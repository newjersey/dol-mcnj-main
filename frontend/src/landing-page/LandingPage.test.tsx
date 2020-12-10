import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { LandingPage } from "./LandingPage";
import { navigate } from "@reach/router";

/* eslint-disable @typescript-eslint/explicit-function-return-type */
function mockReachRouter() {
  const original = jest.requireActual("@reach/router");
  return {
    ...original,
    navigate: jest.fn(),
  };
}

jest.mock("@reach/router", () => mockReachRouter());

describe("<LandingPage />", () => {
  it("links to search results page when search is executed", () => {
    const subject = render(<LandingPage />);
    fireEvent.change(subject.getByPlaceholderText("Enter occupation, certification, or provider"), {
      target: { value: "penguins" },
    });
    fireEvent.click(subject.getByText("Search"));
    expect(navigate).toHaveBeenCalledWith("/search/penguins");
  });

  it("encodes uri components in search query", () => {
    const subject = render(<LandingPage />);
    fireEvent.change(subject.getByPlaceholderText("Enter occupation, certification, or provider"), {
      target: { value: "penguins / penglings" },
    });
    fireEvent.click(subject.getByText("Search"));
    expect(navigate).toHaveBeenCalledWith("/search/penguins%20%2F%20penglings");
  });
});
