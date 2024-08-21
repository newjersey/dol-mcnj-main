import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DropNav } from "./DropNav";

// Mocking DropGroup component
jest.mock("../modules/DropGroup", () => ({
  DropGroup: ({ title, onChange, activeItem }: any) => (
    <li>
      <button
        data-testid={`drop-group-${title}`}
        onClick={() => onChange({ topic: title })}
        className={activeItem?.topic === title ? "active" : ""}
      >
        {title}
      </button>
    </li>
  ),
}));

describe("DropNav Component", () => {
  const items = [
    {
      sys: { id: "1" },
      title: "Category 1",
      topics: {
        items: [{ topic: "Topic 1" }, { topic: "Topic 2" }],
      },
    },
    {
      sys: { id: "2" },
      title: "Category 2",
      topics: {
        items: [{ topic: "Topic 3" }, { topic: "Topic 4" }],
      },
    },
  ];

  it("renders without crashing", () => {
    const { container } = render(
      <DropNav elementId="test-nav" items={items} />,
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with items correctly", () => {
    const { getByTestId } = render(
      <DropNav elementId="test-nav" items={items} />,
    );
    const topicSelector = getByTestId("topic-selector");
    expect(topicSelector).toBeInTheDocument();
  });

  it("applies className correctly", () => {
    const { container } = render(
      <DropNav elementId="test-nav" items={items} className="test-class" />,
    );
    expect(container.firstChild).toHaveClass("dropNav test-class");
  });

  it("calls onChange with the correct selected item", () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <DropNav elementId="test-nav" items={items} onChange={onChangeMock} />,
    );

    const dropGroupButton = getByTestId("drop-group-Category 1");
    fireEvent.click(dropGroupButton);

    expect(onChangeMock).toHaveBeenCalledWith({ topic: "Category 1" });
  });

  it("sets active topic correctly on DropGroup interaction", () => {
    const { getByTestId } = render(
      <DropNav elementId="test-nav" items={items} />,
    );

    const dropGroupButton = getByTestId("drop-group-Category 2");
    fireEvent.click(dropGroupButton);

    expect(dropGroupButton).toHaveClass("active");
  });
});
