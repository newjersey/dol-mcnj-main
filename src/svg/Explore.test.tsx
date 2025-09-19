import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Explore } from "./Explore";

describe("Explore Component", () => {
  it("renders without crashing with default color", () => {
    const { container } = render(<Explore />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "46");
    expect(svg).toHaveAttribute("height", "46");
    expect(svg).toHaveAttribute("viewBox", "0 0 46 46");
    expect(svg).toHaveAttribute("fill", "none");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");

    const path = svg?.querySelector("path");
    expect(path).toHaveAttribute("fill", "#5240AA");
  });

  it("renders with custom color", () => {
    const customColor = "#123456";
    const { container } = render(<Explore color={customColor} />);
    const path = container.querySelector("path");
    expect(path).toHaveAttribute("fill", customColor);
  });
});
