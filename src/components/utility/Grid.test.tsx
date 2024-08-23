import React from "react";
import { render } from "@testing-library/react";
import { Grid } from "./Grid";
import { ColumnSize, FlexGridProps } from "../../utils/types";

describe("Grid component", () => {
  const defaultProps: FlexGridProps & { columns?: ColumnSize } = {
    columns: 3,
    children: (
      <>
        <div>Child 1</div>
        <div>Child 2</div>
      </>
    ),
  };

  const renderComponent = (props = {}) =>
    render(<Grid {...defaultProps} {...props} />);

  it("renders with default props", () => {
    const { container } = renderComponent();
    expect(container.firstChild).toHaveClass(
      "wdrlscw-grid gap-undefined columns-3",
    );
  });

  it("applies custom className", () => {
    const { container } = renderComponent({ className: "custom-class" });
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders children", () => {
    const { getByText } = renderComponent();
    expect(getByText("Child 1")).toBeInTheDocument();
    expect(getByText("Child 2")).toBeInTheDocument();
  });

  it("handles columns prop", () => {
    const { container } = renderComponent({ columns: 4 });
    expect(container.firstChild).toHaveClass("columns-4");
  });

  it("handles gap prop", () => {
    const { container } = renderComponent({ gap: "lg" });
    expect(container.firstChild).toHaveClass("gap-lg");
  });

  it("handles ariaLabel prop", () => {
    const { getByLabelText } = renderComponent({ ariaLabel: "grid-container" });
    expect(getByLabelText("grid-container")).toBeInTheDocument();
  });

  it("applies role prop", () => {
    const { container } = renderComponent({ role: "main" });
    expect(container.firstChild).toHaveAttribute("role", "main");
  });

  it("applies style prop", () => {
    const style = { backgroundColor: "blue" };
    const { container } = renderComponent({ style });
    expect(container.firstChild).toHaveStyle("background-color: blue");
  });

  it("applies componentId prop", () => {
    const { container } = renderComponent({ componentId: "grid-1" });
    expect(container.firstChild).toHaveAttribute("id", "grid-1");
  });

  it("applies testId prop", () => {
    const { getByTestId } = renderComponent({ testId: "grid-container" });
    expect(getByTestId("grid-container")).toBeInTheDocument();
  });

  it("handles elementTag prop", () => {
    const { container } = renderComponent({ elementTag: "section" });
    expect(container.firstChild).not.toBeNull();
    expect((container.firstChild as HTMLElement).tagName).toBe("SECTION");
  });
});
