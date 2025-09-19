import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Divider } from "./Divider";

describe("Divider Component", () => {
  it("renders without crashing", () => {
    render(<Divider />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("applies the correct class names based on props", () => {
    const { rerender } = render(<Divider size="md" className="custom-class" />);
    expect(screen.getByRole("separator")).toHaveClass(
      "divider size-md custom-class",
    );

    rerender(<Divider size="lg" />);
    expect(screen.getByRole("separator")).toHaveClass("divider size-lg");

    rerender(<Divider />);
    expect(screen.getByRole("separator")).toHaveClass("divider size-sm");
  });

  it("renders the hr element when line prop is true", () => {
    render(<Divider testId="divider" line />);
    const container = screen.getByTestId("divider");
    const line = container.querySelector("hr");
    expect(line).toBeInTheDocument();
  });

  it("does not render the hr element when line prop is false", () => {
    render(<Divider testId="divider" line={false} />);
    const container = screen.getByTestId("divider");
    const line = container.querySelector("hr");
    expect(line).not.toBeInTheDocument();
  });

  it("handles missing className prop gracefully", () => {
    render(<Divider size="md" />);
    expect(screen.getByRole("separator")).toHaveClass("divider size-md");
  });
});
