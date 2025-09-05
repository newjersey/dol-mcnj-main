import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Breadcrumbs } from "./Breadcrumbs";
import { LinkProps } from "../../utils/types";

describe("Breadcrumbs Component", () => {
  const crumbs: LinkProps[] = [
    { copy: "Home", url: "/" },
    { copy: "Section", url: "/section" },
    { copy: "Subsection", url: "/section/subsection" },
  ];

  const defaultProps = {
    crumbs,
    pageTitle: "Current Page",
  };

  it("renders without crashing", () => {
    render(<Breadcrumbs {...defaultProps} />);
    expect(screen.getByLabelText("Breadcrumbs")).toBeInTheDocument();
  });

  it("applies the correct class names based on props", () => {
    render(<Breadcrumbs {...defaultProps} className="custom-class" />);
    expect(screen.getByLabelText("Breadcrumbs")).toHaveClass(
      "usa-breadcrumb custom-class",
    );
  });

  it("renders all breadcrumb items correctly", () => {
    render(<Breadcrumbs {...defaultProps} />);
    crumbs.forEach((crumb) => {
      if (crumb.copy) {
        const link = screen.getByText(crumb.copy);
        expect(link).toBeInTheDocument();
        if (crumb.url) {
          expect(link).toHaveAttribute("href", crumb.url);
        }
      }
    });
  });

  it("renders the current page title correctly", () => {
    render(<Breadcrumbs {...defaultProps} />);
    expect(screen.getByTestId("title")).toHaveTextContent("Current Page");
  });
});
