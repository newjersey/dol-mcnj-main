import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Switch } from "./Switch";

describe("Switch", () => {
  const props = {
    inputId: "test-switch",
    label: "Test Label",
  };

  it("renders correctly with required props", () => {
    const { getByLabelText } = render(<Switch {...props} />);
    expect(getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("applies the className prop correctly", () => {
    const { container } = render(<Switch {...props} className="test-class" />);
    expect(container.firstChild).toHaveClass("switch test-class");
  });

  it("displays the helperText when provided", () => {
    const { getByText } = render(
      <Switch {...props} helperText="Helper Text" />,
    );
    expect(getByText("Helper Text")).toBeInTheDocument();
  });

  it("applies the labelClass prop correctly", () => {
    const { getByLabelText } = render(
      <Switch {...props} labelClass="label-class" />,
    );
    expect(getByLabelText("Test Label").closest("label")).toHaveClass(
      "label-class",
    );
  });

  it("handles the onChange event and updates the isChecked state", () => {
    const { getByLabelText } = render(<Switch {...props} />);
    const input = getByLabelText("Test Label");
    expect(input).not.toBeChecked();
    fireEvent.click(input);
    expect(input).toBeChecked();
  });

  it("applies additional props to the FormInput component correctly", () => {
    const { getByTestId } = render(
      <Switch
        inputId="test-switch"
        label="Test Label"
        readOnly
        required
        checked
        testId="form-input"
        value="test-value"
        inputClass="input-class"
      />,
    );
    const input = getByTestId("form-input");
    const inputElement = input.querySelector("input");
    expect(inputElement).toHaveAttribute("readonly");
    expect(inputElement).toBeRequired();
    expect(inputElement).toBeChecked();
    expect(inputElement).toHaveAttribute("value", "test-value");
    expect(inputElement).toHaveClass("input-class");
  });

  it("calls the onChange prop when the input is changed", () => {
    const handleChange = jest.fn();
    const { getByLabelText } = render(
      <Switch {...props} onChange={handleChange} />,
    );
    const input = getByLabelText("Test Label");
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalled();
  });
});
