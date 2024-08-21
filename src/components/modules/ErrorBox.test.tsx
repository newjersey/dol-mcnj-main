import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorBox } from "./ErrorBox";
import { colors } from "../../utils/settings";

jest.mock("@phosphor-icons/react", () => ({
  Warning: jest.fn(() => <svg data-testid="warning-icon" />),
}));

jest.mock("./Heading", () => ({
  Heading: jest.fn(({ level, children }) =>
    React.createElement(`h${level}`, {}, children),
  ),
}));

describe("ErrorBox Component", () => {
  const defaultProps = {
    heading: "Error occurred",
    copy: "Something went wrong.",
    className: "custom-class",
    headingLevel: 2 as const,
  };

  it("renders without crashing", () => {
    render(<ErrorBox {...defaultProps} />);
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("applies the correct class names based on props", () => {
    render(<ErrorBox {...defaultProps} />);
    expect(screen.getByRole("alert")).toHaveClass("errorBox custom-class");
  });

  it("renders the Warning icon", () => {
    render(<ErrorBox {...defaultProps} />);
    const warningIcon = screen.getByTestId("warning-icon");
    expect(warningIcon).toBeInTheDocument();
  });

  it("renders the heading with the correct level", () => {
    render(<ErrorBox {...defaultProps} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Error occurred",
    );
  });

  it("renders the copy text correctly", () => {
    render(<ErrorBox {...defaultProps} />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("does not render the copy text when it is not provided", () => {
    render(<ErrorBox {...defaultProps} copy={undefined} />);
    expect(screen.queryByText("Something went wrong.")).not.toBeInTheDocument();
  });

  it("renders with default heading level when headingLevel is not provided", () => {
    render(<ErrorBox {...defaultProps} headingLevel={undefined} />);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });
});
