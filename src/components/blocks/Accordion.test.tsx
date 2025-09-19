import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Accordion, AccordionProps } from "./Accordion";
import { FaqItem } from "../../utils/types";

// Mocking components
jest.mock("../modules/AccordionItem", () => ({
  AccordionItem: ({ keyValue, title, content }: any) => (
    <div data-testid={`accordion-item-${keyValue}`}>
      <h3>{title}</h3>
      <div>{JSON.stringify(content)}</div>
    </div>
  ),
}));

jest.mock("../utility/Flex", () => ({
  Flex: ({ children, gap, fill, direction, className }: any) => (
    <div
      className={`flex ${className}`}
      data-gap={gap}
      data-fill={fill}
      data-direction={direction}
    >
      {children}
    </div>
  ),
}));

describe("Accordion Component", () => {
  const items: FaqItem[] = [
    {
      sys: { id: "1" },
      question: "Question 1",
      answer: { json: { content: "Answer 1" } } as any,
      category: "Category 1",
      topic: "Topic 1",
    },
    {
      sys: { id: "2" },
      question: "Question 2",
      answer: { json: { content: "Answer 2" } } as any,
      category: "Category 2",
      topic: "Topic 2",
    },
  ];

  const props: AccordionProps = {
    items,
    className: "test-class",
  };

  it("renders without crashing", () => {
    const { container } = render(<Accordion {...props} />);
    expect(container).toBeInTheDocument();
  });

  it("applies className correctly", () => {
    const { container } = render(<Accordion {...props} />);
    expect(container.firstChild).toHaveClass("accordion-block test-class");
  });

  it("renders AccordionItem components with correct props", () => {
    const { getByTestId } = render(<Accordion {...props} />);

    items.forEach((item, index) => {
      const accordionItem = getByTestId(`accordion-item-${index}`);
      expect(accordionItem).toHaveTextContent(item.question);
      expect(accordionItem).toHaveTextContent(JSON.stringify(item.answer.json));
    });
  });

  it("renders without optional className prop", () => {
    const { container } = render(<Accordion items={items} />);
    expect(container.firstChild).toHaveClass("accordion-block");
  });
});
