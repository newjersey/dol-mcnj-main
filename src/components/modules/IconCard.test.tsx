import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { IconCard } from "./IconCard";
import { IconCardProps } from "../../utils/types";
import { IconSelector } from "./IconSelector";
import { LinkObject } from "./LinkObject";

// Mocking dependencies
jest.mock("./IconSelector", () => ({
  IconSelector: jest.fn(() => <div>IconSelector Mock</div>),
}));
jest.mock("./LinkObject", () => ({
  LinkObject: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock("../svgs", () => ({
  SomeSvgIcon: () => <div>SomeSvgIcon Mock</div>,
}));
jest.mock("./Markdown", () => ({
  Markdown: jest.fn(() => <div>Markdown Mock</div>),
}));

describe("IconCard component", () => {
  const defaultProps: IconCardProps = {
    sys: {
      id: "123",
    },
    centered: false,
    message: "Test message",
    icon: "Airplay",
    indicator: "Alien",
    systemIcon: "training",
    copy: "Test copy",
    className: "custom-class",
    fill: true,
    hoverFill: true,
    theme: "blue",
    url: "http://example.com",
  };

  const renderIconCard = (props: Partial<IconCardProps> = {}) =>
    render(<IconCard {...defaultProps} {...props} />);

  it("renders with LinkObject when url is provided", () => {
    renderIconCard();

    expect(LinkObject).toHaveBeenCalledWith(
      expect.objectContaining({ url: "http://example.com", noIndicator: true }),
      expect.anything(),
    );

    const allIconSelectors = screen.getAllByText("IconSelector Mock");

    allIconSelectors.forEach((iconSelector) => {
      expect(iconSelector).toBeInTheDocument();
    });

    expect(screen.getByText("Test copy")).toBeInTheDocument();
    expect(screen.getByText("Markdown Mock")).toBeInTheDocument();
  });

  it("renders without LinkObject when url is not provided", () => {
    renderIconCard({ url: undefined });

    // expect there to not be an anchor tag
    const allAtags = document.querySelectorAll("a");
    expect(allAtags).toHaveLength(0);

    const allIconSelectors = screen.getAllByText("IconSelector Mock");

    allIconSelectors.forEach((iconSelector) => {
      expect(iconSelector).toBeInTheDocument();
    });

    expect(screen.getByText("Test copy")).toBeInTheDocument();
    expect(screen.getByText("Markdown Mock")).toBeInTheDocument();
  });

  it("renders correct class names based on props", () => {
    renderIconCard({ centered: true });

    const cardElement = screen.getByText("IconSelector Mock").closest("div");
    expect(
      cardElement?.parentElement?.parentElement?.parentElement?.parentElement,
    ).toHaveClass("iconCard centered hoverFill");
  });

  it("renders CardContent with correct props", () => {
    renderIconCard({ centered: true });

    const iconSelectors = screen.getAllByText("IconSelector Mock");
    expect(iconSelectors).toHaveLength(1); // Only one icon when centered is true
    expect(screen.queryByText("Markdown Mock")).not.toBeInTheDocument();
  });

  it("renders systemIcon with correct svgName", () => {
    renderIconCard();

    expect(IconSelector).toHaveBeenCalledWith(
      expect.objectContaining({
        svgName: "TrainingBold",
        name: "Airplay",
        size: 32,
      }),
      expect.anything(),
    );
  });

  it("conditionally renders second IconSelector based on centered and indicator", () => {
    renderIconCard({ centered: false });

    const iconSelectors = screen.getAllByText("IconSelector Mock");
    expect(iconSelectors).toHaveLength(2); // Two icons when centered is false and indicator is present
  });

  it("does not render Markdown when centered is true", () => {
    renderIconCard({ centered: true });

    expect(screen.queryByText("Markdown Mock")).not.toBeInTheDocument();
  });

  it("renders with default className if none is provided", () => {
    renderIconCard({ className: undefined });

    const cardElement = screen
      .getAllByText("IconSelector Mock")[0]
      .closest("div");
    expect(
      cardElement?.parentElement?.parentElement?.parentElement?.parentElement,
    ).toHaveClass("iconCard");
  });
});
