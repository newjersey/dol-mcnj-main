import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RelatedHeading } from "./RelatedHeading";

// Mock the LinkObject, Heading, and CaretRight components
jest.mock("./LinkObject", () => ({
  LinkObject: jest.fn(({ children, url }) => <a href={url}>{children}</a>),
}));

jest.mock("./Heading", () => ({
  Heading: jest.fn(({ children, level, className }) =>
    React.createElement(`h${level}`, { className }, children),
  ),
}));

jest.mock("@phosphor-icons/react", () => ({
  CaretRight: jest.fn().mockReturnValue(<svg data-testid="caret-right" />),
}));

describe("RelatedHeading", () => {
  it("renders correctly with required props", () => {
    const { getByText } = render(<RelatedHeading title="example" />);
    expect(getByText("Related Training")).toBeInTheDocument();
  });

  it("applies the className prop correctly", () => {
    const { container } = render(
      <RelatedHeading title="example" className="test-class" />,
    );
    expect(container.querySelector("h2")).toHaveClass(
      "relatedHeading test-class",
    );
  });

  it("renders the correct heading level", () => {
    const { container } = render(
      <RelatedHeading title="example" headingLevel={3} />,
    );
    expect(container.querySelector("h3")).toBeInTheDocument();
  });

  it("renders the LinkObject with the correct URL and children", () => {
    const { getByText, getByTestId } = render(
      <RelatedHeading title="example" hasTraining={true} />,
    );
    const link = getByText("See More Results").closest("a");
    expect(link).toHaveAttribute("href", "/training/search?q=example");
    expect(getByTestId("caret-right")).toBeInTheDocument();
  });
});
