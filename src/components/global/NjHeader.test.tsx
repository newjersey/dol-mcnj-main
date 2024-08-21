/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/display-name */
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NjHeader } from "./NjHeader";
import { NavMenuProps } from "../../utils/types";

jest.mock("@phosphor-icons/react", () => ({
  Envelope: ({ weight }: { weight: string }) => (
    <svg data-testid="envelope-icon" data-weight={weight} />
  ),
  MagnifyingGlass: ({ weight }: { weight: string }) => (
    <svg data-testid="search-icon" data-weight={weight} />
  ),
}));

jest.mock(
  "next/image",
  () =>
    ({
      src,
      alt,
      width,
      height,
    }: {
      src: string;
      alt: string;
      width: number;
      height: number;
    }) => <img src={src} alt={alt} width={width} height={height} />,
);

describe("NjHeader Component", () => {
  const menu: NavMenuProps = {
    sys: { id: "menu" },
    title: "Global Navigation",
    heading: "Main Heading",
    topLevelItemsCollection: {
      items: [
        {
          sys: { id: "item1" },
          copy: "Item 1",
          url: "/item1",
        },
        {
          sys: { id: "item2" },
          copy: "Search [search]",
          url: "/item2",
        },
        {
          sys: { id: "item3" },
          copy: "Contact [envelope]",
          url: "/item3",
        },
      ],
    },
  };

  it("renders without crashing with default props", () => {
    const { container } = render(<NjHeader menu={menu} />);
    expect(container).toBeInTheDocument();
  });

  it("renders the logo and official site text", () => {
    const { getByAltText, getByText } = render(<NjHeader menu={menu} />);
    expect(getByAltText("New Jersey State Seal")).toBeInTheDocument();
    expect(
      getByText("Official Site Of The State Of New Jersey"),
    ).toBeInTheDocument();
  });

  it("renders the navigation items", () => {
    const { getByText } = render(<NjHeader menu={menu} />);
    expect(getByText("Item 1")).toBeInTheDocument();
    expect(getByText("Search")).toBeInTheDocument();
    expect(getByText("Contact")).toBeInTheDocument();
  });

  it("renders the icons in the navigation items", () => {
    const { getByTestId, getByText } = render(<NjHeader menu={menu} />);
    expect(getByText("Search")).toBeInTheDocument();
    expect(getByTestId("search-icon")).toBeInTheDocument();
    expect(getByTestId("envelope-icon")).toBeInTheDocument();
  });

  it("renders the governor and lieutenant governor information", () => {
    const { getByText } = render(<NjHeader menu={menu} />);
    expect(
      getByText("Governor Phil Murphy • Lt. Governor Sheila Oliver"),
    ).toBeInTheDocument();
  });

  it("opens external links in a new tab", () => {
    const { getByText } = render(<NjHeader menu={menu} />);
    const link = getByText(
      "Governor Phil Murphy • Lt. Governor Sheila Oliver",
    ).closest("a");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
