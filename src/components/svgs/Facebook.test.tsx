import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Facebook } from "./Facebook";

describe("Facebook Component", () => {
  it("renders without crashing with default props", () => {
    const { container } = render(<Facebook />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg).toHaveClass(
      "svg-inline--fa fa-facebook-square fa-w-14 fa-2x nj-gray",
    );
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).toHaveAttribute("data-prefix", "fab");
    expect(svg).toHaveAttribute("data-icon", "facebook-square");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 448 512");
    expect(svg).toHaveAttribute("data-fa-i2svg", "");
    const path = svg.querySelector("path");
    expect(path).toHaveAttribute("fill", "currentColor");
    expect(path).toHaveAttribute(
      "d",
      "M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z",
    );
  });

  it("renders with custom color prop", () => {
    const customColor = "#123456";
    const { container } = render(<Facebook color={customColor} />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg") as SVGSVGElement;
    const path = svg.querySelector("path");
    expect(path).toHaveAttribute("fill", customColor);
  });
});
