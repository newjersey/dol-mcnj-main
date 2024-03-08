import { render, screen } from "@testing-library/react";
import { Grouping } from "../Grouping";

describe("Grouping", () => {
  it("should render with default props", () => {
    render(
      <Grouping title="Grouping Title">
        <div>Grouping Content</div>
      </Grouping>
    );

    expect(screen.getByText("Grouping Title")).toBeInTheDocument();
    expect(screen.getByText("Grouping Content")).toBeInTheDocument();
  });

  it("should render with custom props", () => {
    render(
      <Grouping title="Different Group" backgroundColorClass="bg-light-purple">
        <div>Grouping Content</div>
      </Grouping>
    );

    expect(screen.getByText("Different Group")).toBeInTheDocument();
    expect(screen.getByText("Grouping Content")).toBeInTheDocument();
  });
});