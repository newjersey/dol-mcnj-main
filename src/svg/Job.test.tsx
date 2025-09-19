import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Job } from "./Job";

describe("Job Component", () => {
  it("renders without crashing with default color", () => {
    const { container } = render(<Job />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "50");
    expect(svg).toHaveAttribute("height", "48");
    expect(svg).toHaveAttribute("viewBox", "0 0 50 48");
    expect(svg).toHaveAttribute("fill", "none");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");

    const path = svg?.querySelector("path");
    expect(path).toHaveAttribute("fill", "#0066AA");
  });

  it("renders with custom color", () => {
    const customColor = "#123456";
    const { container } = render(<Job color={customColor} />);
    const path = container.querySelector("path");
    expect(path).toHaveAttribute("fill", customColor);
  });
});
