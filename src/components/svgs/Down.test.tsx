import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Down } from "./Down";
import { SvgProps } from "../../utils/types";

describe("Down Component", () => {
  it("renders without crashing with default props", () => {
    const { container } = render(<Down />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
    expect(svg).toHaveAttribute("fill", "#000000");
    expect(svg).toHaveAttribute("viewBox", "0 0 256 256");
  });

  it("renders with custom className, color, and size props", () => {
    const customProps: SvgProps = {
      className: "custom-class",
      color: "#ff0000",
      size: 64,
    };
    const { container } = render(<Down {...customProps} />);
    expect(container).toBeInTheDocument();
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("custom-class");
    expect(svg).toHaveAttribute("width", "64");
    expect(svg).toHaveAttribute("height", "64");
    expect(svg).toHaveAttribute("fill", "#ff0000");
  });

  it("applies the provided className correctly", () => {
    const { container } = render(<Down className="test-class" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("test-class");
  });

  it("applies the provided color correctly", () => {
    const { container } = render(<Down color="#123456" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("fill", "#123456");
  });

  it("applies the provided size correctly", () => {
    const { container } = render(<Down size="48" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "48");
    expect(svg).toHaveAttribute("height", "48");
  });
});
