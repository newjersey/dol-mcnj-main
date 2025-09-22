import React from "react";
import "@testing-library/jest-dom";
import { FilterControl } from "./FilterControl";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResourceTagProps } from "../../utils/types";

const createTag = (id: string, title: string): ResourceTagProps => ({
  sys: { id },
  title,
  category: {
    sys: { id: "cat-" + id },
    title: "Category " + id,
    slug: "category-" + id,
  },
});

const mockGroups = [
  {
    heading: "Group A",
    items: [createTag("1", "Item A1"), createTag("2", "Item A2")],
  },
  {
    heading: "Group B",
    items: [createTag("3", "Item B1"), createTag("4", "Item B2")],
  },
];

describe("FilterControl", () => {
  let selected: ResourceTagProps[] = [];
  const onChange = jest.fn((newSelected) => (selected = newSelected));
  const onType = jest.fn();
  const setSearchQuery = jest.fn();

  beforeEach(() => {
    selected = [];
    onChange.mockClear();
    onType.mockClear();
    setSearchQuery.mockClear();
  });

  it("renders all group headings", () => {
    render(
      <FilterControl
        boxLabel="Filters"
        groups={mockGroups}
        selected={selected}
        onChange={onChange}
        onType={onType}
        searchQuery=""
        setSearchQuery={setSearchQuery}
      />
    );

    expect(screen.getByText("Group A")).toBeInTheDocument();
    expect(screen.getByText("Group B")).toBeInTheDocument();
  });

  it("toggles filter group open/close", async () => {
    render(
      <FilterControl
        boxLabel="Filters"
        groups={mockGroups}
        selected={selected}
        onChange={onChange}
        onType={onType}
        searchQuery=""
        setSearchQuery={setSearchQuery}
      />
    );

    const toggleButton = screen.getByRole("button", { name: /Group B/i });
    expect(screen.queryByLabelText("Item B1")).not.toBeInTheDocument();

    await userEvent.click(toggleButton);
    expect(screen.getByLabelText("Item B1")).toBeInTheDocument();
  });

  it("selects and deselects an item", async () => {
    const { rerender } = render(
      <FilterControl
        boxLabel="Filters"
        groups={mockGroups}
        selected={selected}
        onChange={onChange}
        onType={onType}
        searchQuery=""
        setSearchQuery={setSearchQuery}
      />
    );

    const checkbox = screen.getByLabelText("Item A1");
    await userEvent.click(checkbox);

    // Simulate updated state manually
    selected = [createTag("1", "Item A1")];
    rerender(
      <FilterControl
        boxLabel="Filters"
        groups={mockGroups}
        selected={selected}
        onChange={onChange}
        onType={onType}
        searchQuery=""
        setSearchQuery={setSearchQuery}
      />
    );

    const checkboxChecked = screen.getByLabelText("Item A1");
    expect(checkboxChecked).toBeChecked();

    // Deselect
    await userEvent.click(checkboxChecked);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("handles Select All", async () => {
    render(
      <FilterControl
        boxLabel="Filters"
        groups={mockGroups}
        selected={selected}
        onChange={onChange}
        onType={onType}
        searchQuery=""
        setSearchQuery={setSearchQuery}
      />
    );

    const selectAllButtons = screen.getAllByRole("button", {
      name: /Select All/i,
    });

    await userEvent.click(selectAllButtons[0]);

    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ title: "Item A1" }),
        expect.objectContaining({ title: "Item A2" }),
      ])
    );
  });

  it("clears selections in a group", async () => {
    render(
      <FilterControl
        boxLabel="Filters"
        groups={mockGroups}
        selected={[createTag("1", "Item A1"), createTag("2", "Item A2")]}
        onChange={onChange}
        onType={onType}
        searchQuery=""
        setSearchQuery={setSearchQuery}
      />
    );

    const clearButton = screen.getByRole("button", {
      name: /Clear Selection/i,
    });
    await userEvent.click(clearButton);

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("filters with search box input", async () => {
    render(
      <FilterControl
        boxLabel="Filters"
        groups={mockGroups}
        selected={[]}
        onChange={onChange}
        onType={onType}
        searchQuery=""
        setSearchQuery={setSearchQuery}
      />
    );

    const input = screen.getByPlaceholderText("Start typing here");
    await userEvent.type(input, "abc");

    expect(onType).toHaveBeenLastCalledWith("c");
    expect(setSearchQuery).toHaveBeenLastCalledWith("c");
  });

  it("clears all selections and search query", async () => {
    render(
      <FilterControl
        boxLabel="Filters"
        groups={mockGroups}
        selected={[createTag("1", "Item A1")]}
        onChange={onChange}
        onType={onType}
        searchQuery="test"
        setSearchQuery={setSearchQuery}
      />
    );

    const clearAllButton = screen.getByRole("button", { name: "Clear All" });
    await userEvent.click(clearAllButton);

    expect(setSearchQuery).toHaveBeenCalledWith("");
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("applies custom className", () => {
    render(
      <FilterControl
        boxLabel="Filters"
        groups={mockGroups}
        className="custom-class"
        selected={[]}
        onChange={onChange}
      />
    );

    const container = screen.getByText("Filters").closest(".filterControl");
    expect(container).toHaveClass("custom-class");
  });
});
