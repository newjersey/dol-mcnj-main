import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { YouTube } from "./YouTube";

describe("YouTube Component", () => {
  it("renders without crashing with default props", () => {
    const { container } = render(<YouTube />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg).toHaveClass(
      "svg-inline--fa fa-youtube-square fa-w-14 fa-2x nj-gray",
    );
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).toHaveAttribute("data-prefix", "fab");
    expect(svg).toHaveAttribute("data-icon", "youtube-square");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 448 512");
    expect(svg).toHaveAttribute("data-fa-i2svg", "");
    const path = svg.querySelector("path");
    expect(path).toHaveAttribute("fill", "currentColor");
    expect(path).toHaveAttribute(
      "d",
      "M186.8 202.1l95.2 54.1-95.2 54.1V202.1zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-42 176.3s0-59.6-7.6-88.2c-4.2-15.8-16.5-28.2-32.2-32.4C337.9 128 224 128 224 128s-113.9 0-142.2 7.7c-15.7 4.2-28 16.6-32.2 32.4-7.6 28.5-7.6 88.2-7.6 88.2s0 59.6 7.6 88.2c4.2 15.8 16.5 27.7 32.2 31.9C110.1 384 224 384 224 384s113.9 0 142.2-7.7c15.7-4.2 28-16.1 32.2-31.9 7.6-28.5 7.6-88.1 7.6-88.1z",
    );
  });

  it("renders with custom color prop", () => {
    const customColor = "#123456";
    const { container } = render(<YouTube color={customColor} />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg") as SVGSVGElement;
    const path = svg.querySelector("path");
    expect(path).toHaveAttribute("fill", customColor);
  });
});
