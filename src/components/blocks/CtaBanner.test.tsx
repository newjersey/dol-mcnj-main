import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CtaBanner } from "./CtaBanner";
import { ButtonProps, LinkProps } from "../../utils/types";

describe("CtaBanner Component", () => {
  const customLinks: ButtonProps[] = [
    { type: "link", label: "Custom Link 1", link: "/custom1" },
    { type: "link", label: "Custom Link 2", link: "/custom2" },
  ];

  const items: LinkProps[] = [
    { copy: "Link 1", url: "/link1" },
    { copy: "Link 2", url: "/link2" },
  ];

  beforeEach(() => {
    process.env.REACT_APP_FEATURE_CAREER_PATHWAYS = "true";
  });

  it("renders without crashing", () => {
    const { container } = render(<CtaBanner heading="Test Heading" />);
    expect(container).toBeInTheDocument();
  });

  it("applies className correctly", () => {
    const { container } = render(
      <CtaBanner heading="Test Heading" className="test-class" />,
    );
    expect(container.firstChild).toHaveClass("ctaBanner test-class");
  });

  it("renders Heading component correctly", () => {
    const { getByText } = render(<CtaBanner heading="Test Heading" />);
    expect(getByText("Test Heading")).toBeInTheDocument();
  });

  it("renders Button components with correct props when fullColor is true", () => {
    const { getByText } = render(
      <CtaBanner heading="Test Heading" items={items} fullColor />,
    );
    expect(getByText("Link 1")).toBeInTheDocument();
    expect(getByText("Link 2")).toBeInTheDocument();
  });

  it("renders Cta component correctly when fullColor is false", () => {
    render(<CtaBanner heading="Test Heading" items={items} />);
    const cta = document.querySelector(".cta");
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveTextContent("Test Heading");
    expect(cta).toHaveTextContent("Link 1Link 2");
  });

  it('filters out "NJ Career Pathways" when REACT_APP_FEATURE_CAREER_PATHWAYS is false', () => {
    process.env.REACT_APP_FEATURE_CAREER_PATHWAYS = "false";
    const itemsWithCareerPathways = [
      ...items,
      { label: "NJ Career Pathways", url: "/career-pathways" },
    ];
    const { queryByText } = render(
      <CtaBanner
        heading="Test Heading"
        items={itemsWithCareerPathways}
        fullColor
      />,
    );
    expect(queryByText("NJ Career Pathways")).not.toBeInTheDocument();
  });

  it("renders custom links correctly when fullColor is true", () => {
    const { getByText } = render(
      <CtaBanner heading="Test Heading" customLinks={customLinks} fullColor />,
    );
    expect(getByText("Custom Link 1")).toBeInTheDocument();
    expect(getByText("Custom Link 2")).toBeInTheDocument();
  });
});
