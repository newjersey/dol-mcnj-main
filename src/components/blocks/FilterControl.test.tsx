import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FilterControl } from "./FilterControl";

// Mocking..
// jest.mock("../modules/Button", () => ({
//   Button: ({ children, ...props }: any) => (
//     <button {...props}>{children || props.label}</button>
//   ),
// }));

jest.mock("../modules/FormInput", () => ({
  FormInput: ({ label, checked, onChange }: any) => (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  ),
}));

jest.mock("../modules/Heading", () => ({
  Heading: ({ children, level, className }: any) => (
    <h1 className={className} data-level={level}>
      {children}
    </h1>
  ),
}));

// jest.mock("../modules/LabelBox", () => ({
//   LabelBox: ({ title, children }: any) => (
//     <div className="labelBox">
//       <div className="title">{title}</div>
//       {children}
//     </div>
//   ),
// }));

describe("FilterControl Component", () => {
  const groups = [
    {
      heading: "Group 1",
      items: [
        { sys: { id: "1" }, title: "Item 1" },
        { sys: { id: "2" }, title: "Item 2" },
      ],
    },
    {
      heading: "Group 2",
      items: [
        { sys: { id: "3" }, title: "Item 3" },
        { sys: { id: "4" }, title: "Item 4" },
      ],
    },
  ];

  it("renders without crashing", () => {
    const { container } = render(
      <FilterControl boxLabel="Filter" groups={[]} />,
    );
    expect(container).toBeInTheDocument();
  });

  it("renders groups and allows selecting items", () => {
    const { getByLabelText } = render(
      <FilterControl boxLabel="Filter" groups={groups} />,
    );
    const item1 = getByLabelText("Item 1") as HTMLInputElement;
    fireEvent.click(item1);
    expect(item1.checked).toBe(true);
  });

  it('clears all selections when clicking "Clear All"', () => {
    const { getByLabelText, getByText } = render(
      <FilterControl boxLabel="Filter" groups={groups} />,
    );
    const item1 = getByLabelText("Item 1") as HTMLInputElement;
    fireEvent.click(item1);
    expect(item1.checked).toBe(true);

    const clearAllButton = getByText("Clear All");
    fireEvent.click(clearAllButton);
    expect(item1.checked).toBe(false);
  });

  it('selects all items in a group when clicking "Select All"', () => {
    const { getByLabelText, getAllByText } = render(
      <FilterControl boxLabel="Filter" groups={groups} />,
    );
    const selectAllButton = getAllByText("Select All")[0];
    fireEvent.click(selectAllButton);

    const item1 = getByLabelText("Item 1") as HTMLInputElement;
    const item2 = getByLabelText("Item 2") as HTMLInputElement;
    expect(item1.checked).toBe(true);
    expect(item2.checked).toBe(true);
  });

  it('clears selections for a specific group when clicking "Clear Selection"', () => {
    const { getByLabelText, getAllByText } = render(
      <FilterControl boxLabel="Filter" groups={groups} />,
    );
    const item1 = getByLabelText("Item 1") as HTMLInputElement;
    const item3 = getByLabelText("Item 3") as HTMLInputElement;
    fireEvent.click(item1);
    fireEvent.click(item3);
    expect(item1.checked).toBe(true);
    expect(item3.checked).toBe(true);

    const clearSelectionButton = getAllByText("Clear Selection")[0];
    fireEvent.click(clearSelectionButton);
    expect(item1.checked).toBe(false);
    expect(item3.checked).toBe(true);
  });

  it("calls onChange callback with selected items", () => {
    const onChangeMock = jest.fn();
    const { getByLabelText } = render(
      <FilterControl
        boxLabel="Filter"
        groups={groups}
        onChange={onChangeMock}
      />,
    );
    const item1 = getByLabelText("Item 1") as HTMLInputElement;
    fireEvent.click(item1);
    expect(onChangeMock).toHaveBeenCalledWith([
      { sys: { id: "1" }, title: "Item 1" },
    ]);
  });

  it("toggles open state when clicking on the label box title", () => {
    const { getByText, container } = render(
      <FilterControl boxLabel="Filter" groups={groups} />,
    );
    const title = getByText("Filter");
    fireEvent.click(title);
    expect(container.firstChild).toHaveClass("open");
  });
});
