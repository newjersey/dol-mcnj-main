import { render, screen } from "@testing-library/react";
import { StatBlock } from "../StatBlock";

describe("StatBlock", () => {
  it("should render with default props", () => {
    render(
      <StatBlock
        title="StatBlock Title"
        data="StatBlock Data"
        backgroundColorClass="bg-light-green"
      />
    );

    expect(screen.getByText("StatBlock Title")).toBeInTheDocument();
    expect(screen.getByText("StatBlock Data")).toBeInTheDocument();
  });

  it("should render with custom props", () => {
    render(
      <StatBlock
        title="Different StatBlock"
        data="Different Data"
        backgroundColorClass="bg-light-purple"
      />
    );

    expect(screen.getByText("Different StatBlock")).toBeInTheDocument();
    expect(screen.getByText("Different Data")).toBeInTheDocument();
  });

  it("should render with missing data indicator", () => {
    render(
      <StatBlock
        title="Missing Data"
        data="N/A"
        backgroundColorClass="bg-light-purple"
      />
    );

    expect(screen.getByText("Missing Data")).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});