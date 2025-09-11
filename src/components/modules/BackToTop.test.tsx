import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BackToTop } from "./BackToTop";

describe("BackToTop Component", () => {
  it("renders without crashing", () => {
    render(<BackToTop />);
    expect(
      screen.getByRole("button", { name: /back to top/i }),
    ).toBeInTheDocument();
  });

  it("applies the correct class names based on props", () => {
    render(<BackToTop className="custom-class" />);
    expect(screen.getByRole("button", { name: /back to top/i })).toHaveClass(
      "backToTop custom-class buttonHide",
    );
  });

  it("shows the button when scrolled down and hides when scrolled up", () => {
    render(<BackToTop />);
    const button = screen.getByRole("button", { name: /back to top/i });

    // Simulate scroll down
    fireEvent.scroll(window, { target: { scrollY: 300 } });
    expect(button).not.toHaveClass("buttonHide");

    // Simulate scroll up
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    expect(button).toHaveClass("buttonHide");
  });

  it("scrolls to the top of the page when clicked", () => {
    render(<BackToTop />);
    const button = screen.getByRole("button", { name: /back to top/i });

    // Mock window.scrollTo
    window.scrollTo = jest.fn();

    fireEvent.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
