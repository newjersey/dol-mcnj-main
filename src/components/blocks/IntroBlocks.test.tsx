import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { IntroBlocks } from "./IntroBlocks";
import { IntroBlocksProps } from "../../utils/types";

// Mocking Button component
jest.mock("../modules/Button", () => ({
  Button: ({ className, type, link, iconSuffix, children }: any) => (
    <a
      href={link}
      className={className}
      data-type={type}
      data-icon-suffix={iconSuffix}
    >
      {children}
    </a>
  ),
}));

describe("IntroBlocks Component", () => {
  const props: IntroBlocksProps = {
    heading: "Main Heading",
    message: "Main message for the intro blocks.",
    sectionsHeading: "Sections Heading",
    sections: [
      {
        title: "Section 1",
        heading: "Section 1 Heading",
        message: "Section 1 Message",
        link: { url: "/section1", copy: "Learn More" },
      },
      {
        title: "Section 2",
        heading: "Section 2 Heading",
        message: "Section 2 Message",
        link: { url: "/section2", copy: "Learn More" },
      },
    ],
  };

  it("renders without crashing", () => {
    const { container } = render(<IntroBlocks {...props} />);
    expect(container).toBeInTheDocument();
  });

  it("renders heading and message correctly", () => {
    const { getByText } = render(<IntroBlocks {...props} />);
    expect(getByText("Main Heading")).toBeInTheDocument();
    expect(getByText("Main message for the intro blocks.")).toBeInTheDocument();
  });

  it("renders sections heading correctly", () => {
    const { getByText } = render(<IntroBlocks {...props} />);
    expect(getByText("Sections Heading")).toBeInTheDocument();
  });

  it("renders sections and switches between them correctly", () => {
    const { getByText, getByRole } = render(<IntroBlocks {...props} />);

    // Check initial active section
    expect(getByText("Section 1 Heading")).toBeInTheDocument();
    expect(getByText("Section 1 Message")).toBeInTheDocument();

    // Click to switch to the second section
    const section2Button = getByText("Section 2");
    fireEvent.click(section2Button);

    // Check if the second section content is displayed
    expect(getByText("Section 2 Heading")).toBeInTheDocument();
    expect(getByText("Section 2 Message")).toBeInTheDocument();
  });

  it("applies active class to the correct button", () => {
    const { getByText } = render(<IntroBlocks {...props} />);

    const section1Button = getByText("Section 1");
    const section2Button = getByText("Section 2");

    // Initially, section 1 button should be active
    expect(section1Button).toHaveClass("active");
    expect(section2Button).not.toHaveClass("active");

    // Click to switch to the second section
    fireEvent.click(section2Button);

    // Now, section 2 button should be active
    expect(section2Button).toHaveClass("active");
    expect(section1Button).not.toHaveClass("active");
  });

  it("renders the Button component with correct props based on active section", () => {
    const { getByText, getByRole } = render(<IntroBlocks {...props} />);

    // Check the initial button
    let button = getByRole("link", { name: /Learn More/i });
    expect(button).toHaveAttribute("href", "/section1");
    expect(button).toHaveClass("usa-button secondary");

    // Click to switch to the second section
    const section2Button = getByText("Section 2");
    fireEvent.click(section2Button);

    // Check the button for the second section
    button = getByRole("link", { name: /Learn More/i });
    expect(button).toHaveAttribute("href", "/section2");
    expect(button).toHaveClass("usa-button primary");
  });

  it("handles absence of sections correctly", () => {
    const { container } = render(<IntroBlocks {...props} sections={[]} />);
    expect(container.querySelector(".buttons")).toBeEmptyDOMElement();
  });
});
