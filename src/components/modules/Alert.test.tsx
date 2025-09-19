import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Alert } from "./Alert";
import { parseMarkdownToHTML } from "../../utils/parseMarkdownToHTML";

// Mock dependencies
jest.mock("../../utils/parseMarkdownToHTML");

describe("Alert component", () => {
  beforeEach(() => {
    sessionStorage.clear();
    (parseMarkdownToHTML as jest.Mock).mockReturnValue(
      "<p>parsed markdown</p>"
    );
  });

  const defaultProps = {
    type: "info" as "info" | "success" | "warning" | "error",
  };

  it("renders without crashing", () => {
    render(<Alert {...defaultProps} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("applies the correct type class", () => {
    render(<Alert {...defaultProps} />);
    expect(screen.getByRole("alert")).toHaveClass("usa-alert--info");
  });

  it("applies additional classes when provided", () => {
    render(<Alert {...defaultProps} className="custom-class" />);
    expect(screen.getByRole("alert")).toHaveClass("custom-class");
  });

  it("renders the copy if provided", () => {
    render(<Alert {...defaultProps} copy="**Test** Copy" />);
    expect(screen.getByText("parsed markdown")).toBeInTheDocument();
  });

  it("applies no icon class if noIcon is true", () => {
    render(<Alert {...defaultProps} noIcon />);
    expect(screen.getByRole("alert")).toHaveClass("usa-alert--no-icon");
  });

  it("applies slim class if slim is true", () => {
    render(<Alert {...defaultProps} slim />);
    expect(screen.getByRole("alert")).toHaveClass("usa-alert--slim");
  });

  it("hides the alert if session storage contains the alert ID", () => {
    sessionStorage.setItem("alert_test", "true");
    render(<Alert {...defaultProps} alertId="test" />);
    expect(screen.getByRole("alert")).toHaveClass("hide");
  });

  it("calls setRemove when the dismiss button is clicked", () => {
    render(<Alert {...defaultProps} alertId="test" dismissible />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(sessionStorage.getItem("alert_test")).toBe("true");
    expect(screen.getByRole("alert")).toHaveClass("hide");
  });

  it("handles no alertId properly", () => {
    render(<Alert {...defaultProps} />);
    expect(screen.getByRole("alert")).not.toHaveClass("hide");
  });
});
