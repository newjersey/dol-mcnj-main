import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NavMenu } from "./NavMenu";
import { NavMenuProps } from "../../utils/types";

// jest.mock("./NavSubMenu", () => ({
//   NavSubMenu: ({ open, onClick }: { open: boolean; onClick: () => void }) => (
//     <div data-testid="nav-submenu">
//       <button onClick={onClick}>{open ? "Close" : "Open"}</button>
//     </div>
//   ),
// }));
// jest.mock("../modules/LinkObject", () => ({
//   LinkObject: ({
//     children,
//     url,
//   }: {
//     children: React.ReactNode;
//     url: string;
//   }) => <a href={url}>{children}</a>,
// }));

describe("NavMenu Component", () => {
  const menu: NavMenuProps = {
    sys: { id: "menu" },
    title: "Main Navigation",
    heading: "Main Heading",
    topLevelItemsCollection: {
      items: [
        {
          sys: { id: "item1" },
          copy: "Item 1",
          url: "/item1",
          classes: "class1",
          subItemsCollection: {
            items: [
              {
                sys: { id: "subitem1" },
                copy: "SubItem 1",
                url: "/subitem1",
                classes: "subclass1",
              },
            ],
          },
        },
        {
          sys: { id: "item2" },
          copy: "Item 2",
          url: "/item2",
        },
      ],
    },
  };

  it("renders without crashing with default props", () => {
    const { container } = render(<NavMenu menu={menu} />);
    expect(container).toBeInTheDocument();
  });

  it("renders the menu heading and top-level items", () => {
    const { getByText } = render(<NavMenu menu={menu} />);
    expect(getByText("Main Heading")).toBeInTheDocument();
    expect(getByText("Item 1")).toBeInTheDocument();
    expect(getByText("Item 2")).toBeInTheDocument();
  });

  it("renders sub-items when provided", () => {
    const { getByText, queryByText } = render(<NavMenu menu={menu} />);
    fireEvent.click(getByText("Item 1"));
    expect(getByText("SubItem 1")).toBeInTheDocument();
    expect(queryByText("SubItem 1")).toBeInTheDocument();
  });

  it("renders extra items when provided", () => {
    const extraItems = <div>Extra Item</div>;
    const { getByText } = render(
      <NavMenu menu={menu} extraItems={extraItems} />,
    );
    expect(getByText("Extra Item")).toBeInTheDocument();
  });
});
