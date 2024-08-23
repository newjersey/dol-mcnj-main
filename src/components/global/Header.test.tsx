import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Header } from "./Header";
import { NavMenuProps } from "../../utils/types";

jest.mock("./NjHeader", () => ({
  NjHeader: ({ menu }: { menu: NavMenuProps }) => (
    <div className="global-header">{menu.title}</div>
  ),
}));

// jest.mock("../svgs/NJLogo", () => ({
//   NJLogo: ({ className }: { className: string }) => (
//     <div className={className}>NJLogo</div>
//   ),
// }));

jest.mock("../modules/Button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

jest.mock("../modules/LinkObject", () => ({
  LinkObject: ({
    children,
    url,
  }: {
    children: React.ReactNode;
    url: string;
  }) => <a href={url}>{children}</a>,
}));

describe("Header Component", () => {
  const globalNav: NavMenuProps = {
    sys: { id: "globalNav" },
    title: "Global Navigation",
    topLevelItemsCollection: { items: [] },
  };

  const mainNav: NavMenuProps = {
    sys: { id: "mainNav" },
    title: "Main Navigation",
    topLevelItemsCollection: { items: [] },
  };

  it("renders without crashing with default props", () => {
    const { container } = render(<Header globalNav={globalNav} />);
    expect(container).toBeInTheDocument();
  });

  it("renders with mainNav and globalNav props", () => {
    render(<Header mainNav={mainNav} globalNav={globalNav} />);

    const globalHeader = document.querySelector(".global-header");
    const mainNavMenu = document.querySelector(".main-nav");

    expect(globalHeader).toBeInTheDocument();
    expect(mainNavMenu).toBeInTheDocument();
  });

  it("renders NJLogo component", () => {
    const { getByText } = render(<Header globalNav={globalNav} />);

    const basicLogo = document.getElementById("basic-logo");
    const imageLogo = basicLogo?.querySelector("a svg");

    expect(imageLogo).toBeInTheDocument();
  });

  it("renders NavMenu components with correct labels", () => {
    render(<Header mainNav={mainNav} globalNav={globalNav} />);
    const mainNavMenu = document.querySelector(".main-nav");
    expect(mainNavMenu).toBeInTheDocument();
  });

  it("toggles navigation menu on button click", () => {
    const { getByText } = render(
      <Header mainNav={mainNav} globalNav={globalNav} />,
    );
    const button = getByText("Nav Toggle").parentElement as HTMLElement;
    const navMenu = document.querySelector(".main-nav");

    expect(navMenu).not.toHaveClass("open");
    fireEvent.click(button);
    expect(navMenu).toHaveClass("open");
    fireEvent.click(button);
    expect(navMenu).not.toHaveClass("open");
  });

  it("renders contact us link correctly", () => {
    const { getByText } = render(
      <Header mainNav={mainNav} globalNav={globalNav} />,
    );
    const contactLink = getByText("Contact Us") as HTMLAnchorElement;
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact");
  });
});
