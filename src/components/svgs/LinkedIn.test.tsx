import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LinkedIn } from "./LinkedIn";

describe("LinkedIn Component", () => {
  it("renders without crashing with default props", () => {
    const { container } = render(<LinkedIn />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg).toHaveClass("svg-inline--fa fa-linkedin fa-w-14 fa-2x nj-gray");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).toHaveAttribute("data-prefix", "fab");
    expect(svg).toHaveAttribute("data-icon", "linkedin");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 448 512");
    expect(svg).toHaveAttribute("data-fa-i2svg", "");
    const path = svg.querySelector("path");
    expect(path).toHaveAttribute("fill", "currentColor");
    expect(path).toHaveAttribute(
      "d",
      "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z",
    );
  });

  it("renders with custom color prop", () => {
    const customColor = "#123456";
    const { container } = render(<LinkedIn color={customColor} />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg") as SVGSVGElement;
    const path = svg.querySelector("path");
    expect(path).toHaveAttribute("fill", customColor);
  });
});
