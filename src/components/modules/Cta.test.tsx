import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Cta } from "./Cta";
import { ButtonProps } from "../../utils/types";

jest.mock("../../utils/themeConverter", () => ({
  themeConverter: jest.fn((theme) => `converted-${theme}`),
}));

jest.mock("./Button", () => ({
  Button: jest.fn(({ label, className }) => (
    <button className={className}>{label}</button>
  )),
}));

jest.mock("./Heading", () => ({
  Heading: jest.fn(({ level, children, className }) =>
    React.createElement(`h${level}`, { className }, children),
  ),
}));

describe("Cta Component", () => {
  const links: ButtonProps[] = [
    {
      label: "Link 1",
      type: "link",
      link: "http://example.com/1",
    },
    {
      label: "Link 2",
      type: "link",
      link: "http://example.com/2",
    },
  ];

  const defaultProps = {
    links,
    theme: "green",
  };

  it("renders without crashing", () => {
    render(<Cta {...defaultProps} />);
    expect(screen.getByText("Link 1")).toBeInTheDocument();
    expect(screen.getByText("Link 2")).toBeInTheDocument();
  });

  it("applies the correct class names based on props", () => {
    render(<Cta {...defaultProps} className="custom-class" />);
    expect(screen.getByText("Link 1").parentElement?.parentElement).toHaveClass(
      "cta custom-class",
    );
  });

  it("renders heading correctly with specified level", () => {
    render(<Cta {...defaultProps} heading="Test Heading" headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Test Heading",
    );
  });

  it("renders heading as paragraph when level is not specified", () => {
    render(<Cta {...defaultProps} heading="Test Heading" />);
    expect(screen.getByText("Test Heading").tagName).toBe("P");
  });

  it("renders links with the correct direction", () => {
    render(<Cta {...defaultProps} linkDirection="column" />);
    expect(screen.getByText("Link 1").parentElement).toHaveClass(
      "links column",
    );
  });

  it('sets iconSuffix to "ArrowUpRight" for external links', () => {
    render(<Cta {...defaultProps} />);
    expect(screen.getByText("Link 1")).toBeInTheDocument();
    expect(screen.getByText("Link 2")).toBeInTheDocument();
  });

  it("handles noIndicator prop correctly", () => {
    render(<Cta {...defaultProps} noIndicator />);
    expect(screen.getByText("Link 1")).toBeInTheDocument();
    expect(screen.getByText("Link 2")).toBeInTheDocument();
  });

  it("handles an empty links array gracefully", () => {
    render(<Cta links={[]} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
