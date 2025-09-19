import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ResourceLinkBox } from "./ResourceLinkBox";
import { LinkProps } from "../../utils/types";

describe("ResourceLinkBox", () => {
  const links: LinkProps[] = [
    { sys: { id: "1" }, copy: "Link 1", url: "/link1" },
    { sys: { id: "2" }, copy: "Link 2", url: "/link2" },
  ];

  it("renders correctly with required props", () => {
    const { getByText } = render(<ResourceLinkBox links={links} />);
    expect(getByText("Link 1")).toBeInTheDocument();
    expect(getByText("Link 2")).toBeInTheDocument();
  });

  it("applies the className and theme props correctly", () => {
    const { container } = render(
      <ResourceLinkBox links={links} className="test-class" theme="green" />
    );
    expect(container.firstChild).toHaveClass("resourceLinkBox");
    expect(container.firstChild).toHaveClass("color-green");
    expect(container.firstChild).toHaveClass("test-class");
  });

  it("renders the heading with the correct level", () => {
    const { container } = render(
      <ResourceLinkBox links={links} heading="Test Heading" headingLevel={4} />
    );
    expect(container.querySelector("h4")).toHaveTextContent("Test Heading");
  });

  it("renders the links as buttons with the correct properties", () => {
    const { getByText } = render(
      <ResourceLinkBox links={links} theme="blue" />
    );
    links.forEach((link) => {
      const button = getByText("Link 1");
      expect(button).toBeInTheDocument();
      expect(button.parentElement?.tagName).toBe("A");
      expect(button.parentElement).toHaveAttribute("href", "/link1");
    });
  });
});
