import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BetaBanner } from "./BetaBanner";

describe("BetaBanner Component", () => {
  it("renders without crashing with default props", () => {
    const { container, getByText } = render(<BetaBanner />);
    expect(container).toBeInTheDocument();
    const banner = container.querySelector(".beta-banner");
    expect(banner).toBeInTheDocument();
    expect(banner).not.toHaveClass("no-header-margin");

    const link = getByText("Share your feedback!");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://forms.gle/XSmLCPHBctFVSGsA6");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders with noHeader prop set to true", () => {
    const { container } = render(<BetaBanner noHeader />);
    const banner = container.querySelector(".beta-banner");
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveClass("no-header-margin");
  });

  it("renders with noHeader prop set to false", () => {
    const { container } = render(<BetaBanner noHeader={false} />);
    const banner = container.querySelector(".beta-banner");
    expect(banner).toBeInTheDocument();
    expect(banner).not.toHaveClass("no-header-margin");
  });

  it("renders the feedback link with correct attributes", () => {
    const { getByText } = render(<BetaBanner />);
    const link = getByText("Share your feedback!");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://forms.gle/XSmLCPHBctFVSGsA6");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
