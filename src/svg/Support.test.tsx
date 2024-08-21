import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Support } from "./Support";

describe("Support Component", () => {
  it("renders without crashing with default color", () => {
    const { container } = render(<Support />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "50");
    expect(svg).toHaveAttribute("height", "46");
    expect(svg).toHaveAttribute("viewBox", "0 0 50 46");
    expect(svg).toHaveAttribute("fill", "none");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");

    const path = svg?.querySelector("path");
    expect(path).toHaveAttribute("fill", "#2E6276");
  });

  it("renders with custom color", () => {
    const customColor = "#123456";
    const { container } = render(<Support color={customColor} />);
    const path = container.querySelector("path");
    expect(path).toHaveAttribute("fill", customColor);
  });
});
