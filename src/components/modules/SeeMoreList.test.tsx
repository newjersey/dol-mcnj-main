import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SeeMoreList } from "./SeeMoreList";

// Mock the LinkObject and Button components
jest.mock("./LinkObject", () => ({
  LinkObject: jest.fn(({ children, url }) => <a href={url}>{children}</a>),
}));

jest.mock("./Button", () => ({
  Button: jest.fn(({ children, onClick, className }) => (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  )),
}));

describe("SeeMoreList", () => {
  const items = [
    { copy: "Item 1", url: "/item1" },
    { copy: "Item 2", url: "/item2" },
    { copy: "Item 3" },
    { copy: "Item 4" },
    { copy: "Item 5" },
    { copy: "Item 6" },
  ];

  it("renders correctly with required props", () => {
    const { getByText } = render(<SeeMoreList items={items} />);
    expect(getByText("Item 1")).toBeInTheDocument();
    expect(getByText("Item 2")).toBeInTheDocument();
  });

  it("applies the className prop correctly", () => {
    const { container } = render(
      <SeeMoreList items={items} className="test-class" />,
    );
    expect(container.firstChild).toHaveClass("seeMoreList test-class");
  });

  it("displays the title when provided", () => {
    const { getByText } = render(
      <SeeMoreList items={items} title="Test Title" />,
    );
    expect(getByText("Test Title")).toBeInTheDocument();
  });

  it("shows only the initial set of items when showAll is false", () => {
    const { queryByText } = render(
      <SeeMoreList items={items} initialSeen={3} />,
    );
    expect(queryByText("Item 4")).not.toBeInTheDocument();
    expect(queryByText("Item 5")).not.toBeInTheDocument();
    expect(queryByText("Item 6")).not.toBeInTheDocument();
  });

  it("shows all items when showAll is true", () => {
    const { getByText } = render(<SeeMoreList items={items} />);
    fireEvent.click(getByText("See More"));
    expect(getByText("Item 4")).toBeInTheDocument();
    expect(getByText("Item 5")).toBeInTheDocument();
    expect(getByText("Item 6")).toBeInTheDocument();
  });

  it("toggles the showAll state when the button is clicked", () => {
    const { getByText, queryByText } = render(
      <SeeMoreList initialSeen={3} items={items} />,
    );
    const button = getByText("See More");
    fireEvent.click(button);
    expect(getByText("See Less")).toBeInTheDocument();
    fireEvent.click(getByText("See Less"));
    expect(queryByText("Item 4")).not.toBeInTheDocument();
    expect(queryByText("Item 5")).not.toBeInTheDocument();
    expect(queryByText("Item 6")).not.toBeInTheDocument();
  });

  it("handles items with and without URLs correctly", () => {
    const { getByText, container } = render(<SeeMoreList items={items} />);
    const linkItem = getByText("Item 1").closest("a");
    expect(linkItem).toHaveAttribute("href", "/item1");
    const nonLinkItem = container.querySelector("span");
    expect(nonLinkItem).toHaveTextContent("Item 3");
  });
});
