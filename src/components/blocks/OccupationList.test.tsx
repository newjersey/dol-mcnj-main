import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OccupationList } from "./OccupationList";
import { OccupationListItemProps } from "../../utils/types";

// Mocking OccupationListItem component
jest.mock("../modules/OccupationListItem", () => ({
  OccupationListItem: ({ title, items }: OccupationListItemProps) => (
    <div data-testid="occupation-list-item">
      <h2>{title}</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
    </div>
  ),
}));

describe("OccupationList Component", () => {
  const items: { [key: string]: OccupationListItemProps["items"] } = {
    Developer: [
      {
        soc: "123",
        title: "Frontend",
        majorGroup: "Tech",
        counties: ["County1", "County2"],
      },
      {
        soc: "124",
        title: "Backend",
        majorGroup: "Tech",
        counties: ["County3", "County4"],
      },
    ],
    Designer: [
      {
        soc: "125",
        title: "UI",
        majorGroup: "Design",
        counties: ["County5", "County6"],
      },
      {
        soc: "126",
        title: "UX",
        majorGroup: "Design",
        counties: ["County7", "County8"],
      },
    ],
    Manager: [
      {
        soc: "127",
        title: "Project Manager",
        majorGroup: "Management",
        counties: ["County9", "County10"],
      },
      {
        soc: "128",
        title: "Product Manager",
        majorGroup: "Management",
        counties: ["County11", "County12"],
      },
    ],
  };

  it("renders without crashing", () => {
    const { container } = render(<OccupationList items={{}} />);
    expect(container).toBeInTheDocument();
  });

  it("renders with items correctly and sorts them alphabetically", () => {
    const { getAllByTestId, getByText } = render(
      <OccupationList items={items} />,
    );

    const occupationListItems = getAllByTestId("occupation-list-item");
    expect(occupationListItems).toHaveLength(3);

    // Check the order of sorted occupations
    const titles = occupationListItems.map(
      (item) => item.querySelector("h2")?.textContent,
    );
    expect(titles).toEqual(["Designer", "Developer", "Manager"]);

    // Check the titles of sub-items
    Object.keys(items).forEach((occupation) => {
      items[occupation].forEach((subItem) => {
        expect(getByText(subItem.title)).toBeInTheDocument();
      });
    });
  });

  it("applies className correctly", () => {
    const { container } = render(
      <OccupationList items={items} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("occupationList custom-class");
  });

  it("renders OccupationListItem components with correct props", () => {
    const { getByText } = render(<OccupationList items={items} />);

    // Check if the OccupationListItem component is called with the correct props
    Object.keys(items).forEach((occupation) => {
      expect(getByText(occupation)).toBeInTheDocument();
      items[occupation].forEach((subItem) => {
        expect(getByText(subItem.title)).toBeInTheDocument();
      });
    });
  });

  it("handles empty items correctly", () => {
    const emptyItems: { [key: string]: OccupationListItemProps["items"] } = {};
    const { container } = render(<OccupationList items={emptyItems} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
