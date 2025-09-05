import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { JobsBold } from "./JobsBold";
import { SvgProps } from "../../utils/types";

describe("JobsBold Component", () => {
  const defaultProps: SvgProps = {
    className: "test-class",
    color: "#123456",
    size: 48,
  };

  it("renders without crashing with default props", () => {
    const { container } = render(<JobsBold />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
    expect(svg).toHaveAttribute("fill", "none");
    expect(svg).toHaveAttribute("viewBox", "0 0 32 32");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    const paths = svg.querySelectorAll("path");
    expect(paths[0]).toHaveAttribute("stroke", "#0066AA");
    expect(paths[1]).toHaveAttribute("fill", "#0066AA");
  });

  it("renders with custom className, color, and size props", () => {
    const { container } = render(<JobsBold {...defaultProps} />);
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
      <JobsBold className={defaultProps.className} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass(defaultProps.className!);
  });

  it("applies the provided color correctly", () => {
    const { container } = render(<JobsBold color={defaultProps.color} />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    const paths = svg.querySelectorAll("path");
    expect(paths[0]).toHaveAttribute("stroke", defaultProps.color);
    expect(paths[1]).toHaveAttribute("fill", defaultProps.color);
  });

  it("applies the provided size correctly", () => {
    const { container } = render(<JobsBold size={defaultProps.size} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", defaultProps.size!.toString());
    expect(svg).toHaveAttribute("height", defaultProps.size!.toString());
  });
});
