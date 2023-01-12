import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { LandingPage } from "./LandingPage";
import { navigate } from "@reach/router";
import { en as Content } from "../locales/en";
import { StubClient } from "../test-objects/StubClient";

/* eslint-disable @typescript-eslint/explicit-function-return-type */
function mockReachRouter() {
  const original = jest.requireActual("@reach/router");
  return {
    ...original,
    navigate: jest.fn(),
  };
}

jest.mock("@reach/router", () => mockReachRouter());

const { searchButtonDefaultText } = Content.SearchAndFilter;
const { searchBoxPlaceholder } = Content.LandingPage;

describe("<LandingPage />", () => {
  let stubClient: StubClient;

  beforeEach(() => {
    stubClient = new StubClient();
  });

  it("links to search results page when search is executed", () => {
    const subject = render(<LandingPage client={stubClient} />);
    fireEvent.change(subject.getByPlaceholderText(searchBoxPlaceholder), {
      target: { value: "penguins" },
    });
    fireEvent.click(subject.getByText(searchButtonDefaultText));
    expect(navigate).toHaveBeenCalledWith("/search/penguins");
  });

  it("encodes uri components in search query", () => {
    const subject = render(<LandingPage client={stubClient} />);
    fireEvent.change(subject.getByPlaceholderText(searchBoxPlaceholder), {
      target: { value: "penguins / penglings" },
    });
    fireEvent.click(subject.getByText(searchButtonDefaultText));
    expect(navigate).toHaveBeenCalledWith("/search/penguins%20%2F%20penglings");
  });
});
