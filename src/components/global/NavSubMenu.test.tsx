import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NavSubMenu } from "./NavSubMenu";
import { TopNavItemProps } from "../../utils/types";

jest.mock("../modules/LinkObject", () => ({
  LinkObject: ({
    children,
    url,
    className,
    onClick,
  }: {
    children: React.ReactNode;
    url: string;
    className?: string;
    onClick?: () => void;
  }) => (
    <a href={url} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}));
jest.mock("@phosphor-icons/react", () => ({
  CaretDown: ({ size }: { size: number }) => (
    <svg data-testid="caret-icon" width={size} height={size} />
  ),
}));

describe("NavSubMenu Component", () => {
  const subItemsCollection = {
    items: [
      {
        sys: { id: "subitem1" },
        copy: "SubItem 1",
        url: "/subitem1",
      },
      {
        sys: { id: "subitem2" },
        copy: "SubItem 2",
        url: "/subitem2",
      },
    ],
  };

  const topNavItemProps: TopNavItemProps = {
    sys: { id: "item1" },
    copy: "Item 1",
    url: "/item1",
    subItemsCollection: subItemsCollection,
  };

  it("renders without crashing with default props", () => {
    const { container } = render(
      <NavSubMenu {...topNavItemProps} onClick={jest.fn()} />,
    );
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent("Item 1");
  });

  it("renders sub-menu items when open is true", () => {
    const { getByText } = render(
      <NavSubMenu {...topNavItemProps} open onClick={jest.fn()} />,
    );
    expect(getByText("SubItem 1")).toBeInTheDocument();
    expect(getByText("SubItem 2")).toBeInTheDocument();
  });

  it("toggles sub-menu on click", () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <NavSubMenu {...topNavItemProps} open onClick={handleClick} />,
    );
    const button = getByText("Item 1");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with icons when icons prop is true", () => {
    const { getByTestId } = render(
      <NavSubMenu {...topNavItemProps} icons onClick={jest.fn()} />,
    );
    const caretIcon = getByTestId("caret-icon");
    expect(caretIcon).toBeInTheDocument();
  });

  it("calls onClick when sub-menu item is clicked", () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <NavSubMenu {...topNavItemProps} open onClick={handleClick} />,
    );
    const subItem = getByText("SubItem 1");
    fireEvent.click(subItem);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
