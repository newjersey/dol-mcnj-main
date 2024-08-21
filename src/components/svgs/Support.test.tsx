import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Support } from "./Support";
import { SvgProps } from "../../utils/types";

describe("Support Component", () => {
  const defaultProps: SvgProps = {
    className: "test-class",
    color: "#123456",
    size: 48,
  };

  it("renders without crashing with default props", () => {
    const { container } = render(<Support />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg).toHaveAttribute("width", "50");
    expect(svg).toHaveAttribute("height", "50");
    expect(svg).toHaveAttribute("fill", "none");
    expect(svg).toHaveAttribute("viewBox", "0 0 50 50");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    const paths = svg.querySelectorAll("path");
    expect(paths[0]).toHaveAttribute("stroke", "#2E6276");
    expect(paths[1]).toHaveAttribute("fill", "#2E6276");
  });

  it("renders with custom className, color, and size props", () => {
    const { container } = render(<Support {...defaultProps} />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg).toHaveClass(defaultProps.className!);
    expect(svg).toHaveAttribute("width", defaultProps.size!.toString());
    expect(svg).toHaveAttribute("height", defaultProps.size!.toString());
    const paths = svg.querySelectorAll("path");
    expect(paths[0]).toHaveAttribute("stroke", defaultProps.color);
    expect(paths[1]).toHaveAttribute("fill", defaultProps.color);
  });

  it("applies the provided className correctly", () => {
    const { container } = render(
      <Support className={defaultProps.className} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass(defaultProps.className!);
  });

  it("applies the provided color correctly", () => {
    const { container } = render(<Support color={defaultProps.color} />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    const paths = svg.querySelectorAll("path");
    expect(paths[0]).toHaveAttribute("stroke", defaultProps.color);
    expect(paths[1]).toHaveAttribute("fill", defaultProps.color);
  });

  it("applies the provided size correctly", () => {
    const { container } = render(<Support size={defaultProps.size} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", defaultProps.size!.toString());
    expect(svg).toHaveAttribute("height", defaultProps.size!.toString());
  });
});
