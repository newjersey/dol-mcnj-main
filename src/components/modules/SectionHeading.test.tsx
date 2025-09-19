import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SectionHeading } from "./SectionHeading";

// Mock the Heading component
jest.mock("./Heading", () => ({
  Heading: jest.fn(({ children, level }) =>
    React.createElement(`h${level}`, null, children),
  ),
}));

describe("SectionHeading", () => {
  const props = {
    heading: "Test Heading",
  };

  it("renders correctly with required props", () => {
    const { getByText } = render(<SectionHeading {...props} />);
    expect(getByText("Test Heading")).toBeInTheDocument();
  });

  it("applies the className prop correctly", () => {
    const { container } = render(
      <SectionHeading {...props} className="test-class" />,
    );
    expect(container.firstChild).toHaveClass("sectionHeading test-class");
  });

  it("applies the color prop correctly", () => {
    const { container } = render(<SectionHeading {...props} color="blue" />);
    expect(container.firstChild).toHaveClass("color-blue");
  });

  it("applies the strikeThrough prop correctly", () => {
    const { container } = render(<SectionHeading {...props} strikeThrough />);
    expect(container.firstChild).toHaveClass("strikeThrough");
  });

  it("renders the heading with the correct level", () => {
    const { container } = render(
      <SectionHeading {...props} headingLevel={3} />,
    );
    expect(container.querySelector("h3")).toHaveTextContent("Test Heading");
  });

  it("renders the description when provided", () => {
    const { getByText } = render(
      <SectionHeading {...props} description="Test Description" />,
    );
    expect(getByText("Test Description")).toBeInTheDocument();
  });
});
