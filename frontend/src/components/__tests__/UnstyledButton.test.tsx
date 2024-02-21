import { render, screen } from "@testing-library/react";
import { UnstyledButton } from "../UnstyledButton";

describe("UnstyledButton", () => {
  it("should render with default props", () => {
    render(<UnstyledButton>UnstyledButton</UnstyledButton>);

    expect(screen.getByText("UnstyledButton")).toBeInTheDocument();
  });

  it("should render with custom props", () => {
    render(
      <UnstyledButton className="test-class">UnstyledButton</UnstyledButton>,
    );

    expect(screen.getByText("UnstyledButton")).toHaveClass("test-class");
  });
});