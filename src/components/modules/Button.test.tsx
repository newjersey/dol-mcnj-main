import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "./Button";
import { IconNames } from "../../utils/enums";
import { ButtonProps } from "../../utils/types";

describe("Button Component", () => {
  const defaultProps: ButtonProps = {
    buttonId: "test-button",
    label: "Click Me",
    type: "button",
    defaultStyle: "primary",
  };

  it("renders without crashing", () => {
    render(<Button {...defaultProps} />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("applies the correct class names based on props", () => {
    const { rerender } = render(
      <Button {...defaultProps} className="custom-class" />,
    );
    expect(screen.getByRole("button")).toHaveClass(
      "usa-button primary custom-class",
    );

    rerender(<Button {...defaultProps} outlined />);
    expect(screen.getByRole("button")).toHaveClass(
      "usa-button primary usa-button--outline",
    );

    rerender(<Button {...defaultProps} highlight="blue" />);
    expect(screen.getByRole("button")).toHaveClass(
      "usa-button highlight-blue centered-text",
    );
  });

  it("renders with custom styles correctly", () => {
    const customStyles = {
      customBgColor: "#ff0000",
      customTextColor: "#00ff00",
      customBorderColor: "#0000ff",
    };
    render(<Button {...defaultProps} {...customStyles} />);
    const button = screen.getByRole("button");
    expect(button).toHaveStyle({
      backgroundColor: "#ff0000",
      color: "#00ff00",
      boxShadow: "inset 0 0 0 2px #0000ff",
    });
  });

  it("renders icons correctly", () => {
    render(<Button {...defaultProps} svgName="Down" />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();

    render(
      <Button
        {...defaultProps}
        iconPrefix={"Airplane" as IconNames.Airplane}
        label="Click Me 2"
      />,
    );
    expect(screen.getByText("Click Me 2")).toBeInTheDocument();

    render(
      <Button
        {...defaultProps}
        iconSuffix={IconNames.Anchor}
        label="Click me 3"
      />,
    );
    expect(screen.getByText("Click me 3")).toBeInTheDocument();
  });

  it("handles button click", () => {
    const handleClick = jest.fn();
    render(<Button {...defaultProps} onClick={handleClick} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });

  it("renders as link when type is not button", () => {
    render(<Button {...defaultProps} type="link" link="http://example.com" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "http://example.com");
    expect(link).toHaveClass("usa-button primary");
  });

  it("onClick is called when link is clicked", () => {
    const handleClick = jest.fn();
    render(
      <Button
        {...defaultProps}
        type="link"
        link="http://example.com"
        onClick={handleClick}
      />,
    );
    const link = screen.getByRole("link");
    fireEvent.click(link);
    expect(handleClick).toHaveBeenCalled();
  });
});
