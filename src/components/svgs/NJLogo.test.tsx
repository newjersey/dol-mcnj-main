import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import NJLogo from "./NJLogo";

describe("NJLogo Component", () => {
  const defaultProps = {
    className: "test-class",
  };

  it("renders without crashing with default props", () => {
    const { container } = render(<NJLogo />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg).toHaveAttribute("width", "31");
    expect(svg).toHaveAttribute("height", "32");
    expect(svg).toHaveAttribute("viewBox", "0 0 31 32");
    expect(svg).toHaveAttribute("fill", "none");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    const rect = svg.querySelector("rect");
    expect(rect).toHaveAttribute("width", "30.1176");
    expect(rect).toHaveAttribute("height", "32");
    const use = svg.querySelector("use");
    expect(use).toHaveAttribute("xlink:href", "#image0");
    const pattern = svg.querySelector("pattern");
    expect(pattern).toHaveAttribute("id", "pattern0");
    const image = svg.querySelector("image");
    expect(image).toHaveAttribute("id", "image0");
    expect(image).toHaveAttribute("width", "73");
    expect(image).toHaveAttribute("height", "78");
    expect(image).toHaveAttribute("xlink:href", expect.any(String));
  });

  it("renders with custom className", () => {
    const { container } = render(<NJLogo className={defaultProps.className} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass(defaultProps.className);
  });

  it("contains the pattern and image elements", () => {
    const { container } = render(<NJLogo />);
    const pattern = container.querySelector("pattern");
    expect(pattern).toBeInTheDocument();
    const image = container.querySelector("image");
    expect(image).toBeInTheDocument();
  });
});
