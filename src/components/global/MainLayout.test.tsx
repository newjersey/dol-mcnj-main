import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MainLayout } from "./MainLayout";

jest.mock("./Header", () => ({
  Header: ({ globalNav, mainNav }: { globalNav: any; mainNav: any }) => (
    <div>
      {globalNav.title} {mainNav?.title}
    </div>
  ),
}));

jest.mock("./Footer", () => ({
  Footer: ({ items }: { items: any }) => (
    <div>
      {items.footerNav1?.title} {items.footerNav2?.title}
    </div>
  ),
}));

jest.mock("../modules/SkipToMain", () => ({
  SkipToMain: () => <div>SkipToMain</div>,
}));

jest.mock("../modules/Alert", () => ({
  Alert: ({ heading, copy }: { heading?: string; copy: string }) => (
    <div>{heading ? `${heading}: ${copy}` : copy}</div>
  ),
}));

describe("MainLayout Component", () => {
  const globalNav = {
    sys: { id: "globalNav" },
    title: "Global Navigation",
    topLevelItemsCollection: { items: [] },
  };

  const mainNav = {
    sys: { id: "mainNav" },
    title: "Main Navigation",
    topLevelItemsCollection: { items: [] },
  };

  const footerNav1 = {
    sys: { id: "footerNav1" },
    title: "Footer Navigation 1",
    topLevelItemsCollection: { items: [] },
  };

  const footerNav2 = {
    sys: { id: "footerNav2" },
    title: "Footer Navigation 2",
    topLevelItemsCollection: { items: [] },
  };

  const props = {
    globalNav,
    mainNav,
    footerNav1,
    footerNav2,
  };

  it("renders without crashing with default props", () => {
    const { container } = render(
      <MainLayout {...props}>
        <div>Children Content</div>
      </MainLayout>,
    );
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent("Global Navigation Main Navigation");
    expect(container).toHaveTextContent(
      "Footer Navigation 1 Footer Navigation 2",
    );
    expect(container).toHaveTextContent("SkipToMain");
    expect(container).toHaveTextContent("Children Content");
  });
});
