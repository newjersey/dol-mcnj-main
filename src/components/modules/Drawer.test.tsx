import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Drawer } from "./Drawer";

// Mocking the phosphor icons library
jest.mock("@phosphor-icons/react", () => ({
  X: jest.fn(() => <svg data-testid="icon-x" />),
}));

describe("Drawer Component", () => {
  const defaultProps = {
    children: <div>Drawer Content</div>,
    open: true,
    setOpen: jest.fn(),
  };

  it("renders without crashing", () => {
    render(<Drawer {...defaultProps} />);
    expect(screen.getByText("Drawer Content")).toBeInTheDocument();
  });

  it("applies the correct class names based on open prop", () => {
    const { rerender } = render(<Drawer {...defaultProps} open={false} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button").parentElement).toHaveClass("panel");
    expect(screen.getByRole("button").parentElement).not.toHaveClass("open");

    rerender(<Drawer {...defaultProps} open />);
    expect(screen.getByRole("button").parentElement).toHaveClass("panel open");
  });

  it("handles close button click", () => {
    render(<Drawer {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    expect(defaultProps.setOpen).toHaveBeenCalledWith(false);
  });

  it("handles click outside the drawer", () => {
    render(<Drawer {...defaultProps} />);
    const overlay = document.querySelector(".overlay") as HTMLElement;
    fireEvent.click(overlay);

    expect(defaultProps.setOpen).toHaveBeenCalledWith(false);
  });

  it("handles pressing the Escape key", () => {
    render(<Drawer {...defaultProps} />);
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(defaultProps.setOpen).toHaveBeenCalledWith(false);
  });

  it("handles not closing the drawer when clicking inside the content", () => {
    render(<Drawer {...defaultProps} />);
    fireEvent.click(screen.getByText("Drawer Content"));
    expect(screen.getByRole("button").parentElement).toHaveClass("panel open");
  });
});
