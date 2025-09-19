import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CostTable } from "./CostTable";
import { toUsCurrency } from "../../utils/toUsCurrency";

jest.mock("../../utils/toUsCurrency", () => ({
  toUsCurrency: jest.fn((value) => `$${value.toFixed(2)}`),
}));

describe("CostTable Component", () => {
  const items = [
    { title: "Item 1", cost: 10 },
    { title: "Item 2", cost: 20 },
    { title: "Item 3", cost: 30 },
  ];

  const totalCost = items.reduce((acc, { cost }) => acc + cost, 0);

  it("renders without crashing", () => {
    render(<CostTable items={items} />);
    expect(screen.getByText("Total Cost")).toBeInTheDocument();
  });

  it("applies the correct class names based on props", () => {
    render(<CostTable items={items} className="custom-class" />);
    expect(screen.getByRole("table")).toHaveClass("costTable custom-class");
  });

  it("renders the correct total cost", () => {
    render(<CostTable items={items} />);
    expect(toUsCurrency).toHaveBeenCalledWith(totalCost);
    expect(screen.getByText(`$${totalCost.toFixed(2)}`)).toBeInTheDocument();
  });

  it("renders all items correctly", () => {
    render(<CostTable items={items} />);
    items.forEach(({ title, cost }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(`$${cost.toFixed(2)}`)).toBeInTheDocument();
    });
  });

  it("handles empty items array gracefully", () => {
    render(<CostTable items={[]} />);
    expect(screen.getByText("Total Cost")).toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });
});
