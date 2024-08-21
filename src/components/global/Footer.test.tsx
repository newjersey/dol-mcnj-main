/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Footer } from "./Footer";
import { NavMenuProps } from "../../utils/types";
import { footerLogo } from "./assets";
import { SubFooter } from "./SubFooter";

jest.mock("./NavMenu", () => ({
  NavMenu: ({ label }: { label: string }) => <div>{label}</div>,
}));
jest.mock("../modules/ResponsiveImage", () => ({
  ResponsiveImage: ({
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
}));
jest.mock("./SubFooter", () => ({
  SubFooter: () => <div>SubFooter</div>,
}));

describe("Footer Component", () => {
  it("renders without crashing with default props", () => {
    const { container, getByText } = render(<Footer />);
    expect(container).toBeInTheDocument();
    expect(getByText("SubFooter")).toBeInTheDocument();
  });

  it("renders with footerNav1 prop", () => {
    const footerNav1: NavMenuProps = {
      sys: { id: "1" },
      title: "Footer Nav 1",
      topLevelItemsCollection: { items: [] },
    };
    const { getByText } = render(<Footer items={{ footerNav1 }} />);
    expect(getByText("Footer Navigation 1")).toBeInTheDocument();
  });

  it("renders with footerNav2 prop", () => {
    const footerNav2: NavMenuProps = {
      sys: { id: "2" },
      title: "Footer Nav 2",
      topLevelItemsCollection: { items: [] },
    };
    const { getByText } = render(<Footer items={{ footerNav2 }} />);
    expect(getByText("Footer Navigation 2")).toBeInTheDocument();
  });

  it("renders with footerNav1 and footerNav2 props", () => {
    const footerNav1: NavMenuProps = {
      sys: { id: "1" },
      title: "Footer Nav 1",
      topLevelItemsCollection: { items: [] },
    };
    const footerNav2: NavMenuProps = {
      sys: { id: "2" },
      title: "Footer Nav 2",
      topLevelItemsCollection: { items: [] },
    };
    const { getByText } = render(<Footer items={{ footerNav1, footerNav2 }} />);
    expect(getByText("Footer Navigation 1")).toBeInTheDocument();
    expect(getByText("Footer Navigation 2")).toBeInTheDocument();
  });

  it("renders the ResponsiveImage component with correct attributes", () => {
    const footerNav2: NavMenuProps = {
      sys: { id: "2" },
      title: "Footer Nav 2",
      topLevelItemsCollection: { items: [] },
    };
    const { getByAltText } = render(<Footer items={{ footerNav2 }} />);
    const img = getByAltText("New Jersey logo") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(footerLogo);
    expect(img).toHaveAttribute("width", "210");
    expect(img).toHaveAttribute("height", "223");
  });

  it("always renders SubFooter component", () => {
    const { getByText } = render(<Footer />);
    expect(getByText("SubFooter")).toBeInTheDocument();
  });
});
