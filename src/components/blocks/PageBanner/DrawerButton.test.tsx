import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DrawerButton } from "./DrawerButton";
import "@testing-library/jest-dom";

describe("DrawerButton", () => {
  const defaultProps = {
    copy: "Test Copy",
    number: "123",
    className: "test-class",
    definition: "Test Definition",
  };

  it("renders correctly with given props", () => {
    render(<DrawerButton {...defaultProps} />);
    expect(screen.getAllByText("Test Copy")[0]).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("Test Definition")).toBeInTheDocument();
  });

  it("toggles drawer on button click", () => {
    render(<DrawerButton {...defaultProps} />);
    const button = screen.getAllByText("Test Copy")[0].parentElement;
    fireEvent.click(button!);
    expect(
      screen.getAllByText("Test Copy")[1].parentElement?.parentElement
    ).toHaveClass("open");
    fireEvent.click(button!);
    expect(
      screen.getAllByText("Test Copy")[1].parentElement?.parentElement
    ).not.toHaveClass("open");
  });

  it("closes drawer on Escape key press", () => {
    render(<DrawerButton {...defaultProps} />);
    const button = screen.getAllByText("Test Copy")[0].parentElement;
    fireEvent.click(button!);
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(screen.getAllByText("Test Copy")[1].parentElement).not.toHaveClass(
      "open"
    );
  });

  it("closes drawer on outside click", () => {
    render(<DrawerButton {...defaultProps} />);
    const button = screen.getAllByText("Test Copy")[0].parentElement;
    fireEvent.click(button!);
    const overlay =
      screen.getAllByText("Test Copy")[1].parentElement?.previousSibling;
    fireEvent.mouseDown(overlay!);
    expect(screen.getAllByText("Test Copy")[1].parentElement).not.toHaveClass(
      "open"
    );
  });

  it("applies the correct className", () => {
    render(<DrawerButton {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /Test Copy/i }).parentElement
    ).toHaveClass("test-class");
  });
});
