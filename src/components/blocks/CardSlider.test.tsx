import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CardSlider } from "./CardSlider";
import { CardSliderProps } from "../../utils/types";

// Mocking components
jest.mock("../modules/IconCard", () => ({
  IconCard: ({ title, description, theme, indicator, systemIcon }: any) => (
    <div data-testid="icon-card" className={`icon-card ${theme}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div>{indicator}</div>
      <div>{systemIcon}</div>
    </div>
  ),
}));

jest.mock("../modules/SectionHeading", () => ({
  SectionHeading: ({ color, heading }: any) => (
    <div data-testid="section-heading" className={color}>
      <h2>{heading}</h2>
    </div>
  ),
}));

jest.mock("../utility/Grid", () => ({
  Grid: ({ children, gap, columns, className }: any) => (
    <div className={`grid ${className}`} data-gap={gap} data-columns={columns}>
      {children}
    </div>
  ),
}));

describe("CardSlider Component", () => {
  const props: CardSliderProps = {
    className: "test-class",
    theme: "blue",
    heading: "Test Heading",
    sectionId: "test-section",
    cards: [
      {
        sys: { id: "1" },
        copy: "Card 1",
        description: "Description 1",
        url: "http://example.com",
      },
      {
        sys: { id: "2" },
        copy: "Card 2",
        description: "Description 2",
        url: "/internal-link",
      },
    ],
  };

  it("renders without crashing", () => {
    const { container } = render(<CardSlider {...props} />);
    expect(container).toBeInTheDocument();
  });

  it("applies className correctly", () => {
    const { container } = render(<CardSlider {...props} />);
    expect(container.firstChild).toHaveClass("cardSlider test-class");
  });

  it("renders SectionHeading component with correct props", () => {
    const { getByTestId } = render(<CardSlider {...props} />);
    const sectionHeading = getByTestId("section-heading");
    expect(sectionHeading).toHaveClass(props.theme as string);
    expect(sectionHeading).toHaveTextContent(props.heading as string);
  });

  it("renders IconCard components with correct props", () => {
    const { getAllByTestId } = render(<CardSlider {...props} />);
    const iconCards = getAllByTestId("icon-card");

    expect(iconCards).toHaveLength(props.cards.length);

    iconCards.forEach((iconCard, index) => {
      const card = props.cards[index];
      expect(iconCard).toHaveTextContent(card.description || "");

      if (card.url?.includes("http")) {
        expect(iconCard).toHaveTextContent("ArrowSquareOut");
      }

      expect(iconCard).toHaveClass(props.theme as string);
      expect(iconCard).toHaveTextContent(props.sectionId as string);
    });
  });

  it("renders without optional props", () => {
    const { container } = render(<CardSlider cards={props.cards} />);
    expect(container).toBeInTheDocument();
    expect(container.querySelector(".section-heading")).toBeNull();
  });
});
