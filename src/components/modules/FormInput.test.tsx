import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FormInput } from "./FormInput";
import { FormInputProps } from "../../utils/types";

// Utility function to render the FormInput component with default props
const renderFormInput = (props: Partial<FormInputProps> = {}) => {
  const defaultProps: FormInputProps = {
    inputId: "test-input",
    label: "Test Label",
    type: "text",
    ...props,
  };

  return render(<FormInput {...defaultProps} />);
};

describe("FormInput component", () => {
  it("renders text input with label and helper text", () => {
    renderFormInput({
      helperText: "Helper text",
      placeholder: "Enter text here",
    });

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter text here")).toBeInTheDocument();
    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });

  it("renders textarea input", () => {
    renderFormInput({
      type: "textarea",
      placeholder: "Enter text here",
    });

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter text here")).toBeInTheDocument();
  });

  it("renders select input with options", () => {
    renderFormInput({
      type: "select",
      options: [
        { key: "Option 1", value: "1" },
        { key: "Option 2", value: "2" },
      ],
    });

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("renders checkbox input", () => {
    renderFormInput({
      type: "checkbox",
    });

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("renders radio input", () => {
    renderFormInput({
      type: "radio",
    });

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("renders error message when error prop is provided", () => {
    renderFormInput({
      error: "This is an error",
    });

    expect(screen.getByText("This is an error")).toBeInTheDocument();
  });

  it("calls onChange handler when input value changes", () => {
    const handleChange = jest.fn();
    renderFormInput({
      onChange: handleChange,
    });

    fireEvent.change(screen.getByLabelText("Test Label"), {
      target: { value: "new value" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("calls onBlur handler when input loses focus", () => {
    const handleBlur = jest.fn();
    renderFormInput({
      onBlur: handleBlur,
    });

    fireEvent.blur(screen.getByLabelText("Test Label"));

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("renders input with custom class names", () => {
    renderFormInput({
      className: "custom-class",
      inputClass: "custom-input-class",
      labelClass: "custom-label-class",
    });

    expect(screen.getByLabelText("Test Label")).toHaveClass(
      "custom-input-class",
    );
    expect(screen.getByText("Test Label")).toHaveClass("custom-label-class");
    expect(screen.getByRole("textbox").parentElement).toHaveClass(
      "custom-class",
    );
  });

  it("renders required mark when required prop is true", () => {
    renderFormInput({
      required: true,
    });

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("hides label when hideLabel prop is true", () => {
    renderFormInput({
      hideLabel: true,
    });

    expect(screen.getByText("Test Label").parentElement).toHaveClass(
      "hideLabel",
    );
  });

  it("renders input as select", () => {
    renderFormInput({
      type: "select",
    });

    const inputElement = screen.getByLabelText("Test Label");
    expect(inputElement.tagName).toBe("SELECT");
  });

  it("renders input as checkbox", () => {
    renderFormInput({
      type: "checkbox",
    });

    const inputElement = screen.getByLabelText("Test Label");
    expect(inputElement.tagName).toBe("INPUT");
    expect(inputElement).toHaveAttribute("type", "checkbox");
  });

  it("renders input as radio", () => {
    renderFormInput({
      type: "radio",
    });

    const inputElement = screen.getByLabelText("Test Label");
    expect(inputElement.tagName).toBe("INPUT");
    expect(inputElement).toHaveAttribute("type", "radio");
  });

  it("renders input as textarea", () => {
    renderFormInput({
      type: "textarea",
    });

    const inputElement = screen.getByLabelText("Test Label");
    expect(inputElement.tagName).toBe("TEXTAREA");
  });

  it("renders input with different types", () => {
    const types = [
      "email",
      "password",
      "number",
      "date",
      "time",
      "url",
      "week",
      "month",
      "tel",
      "search",
      "color",
      "datetime-local",
      "file",
      "hidden",
      "image",
      "range",
      "reset",
      "submit",
      "time",
      "url",
      "week",
    ] as const;

    types.forEach((type) => {
      renderFormInput({
        type,
      });

      const inputElement = screen.getByLabelText("Test Label");

      expect(inputElement.tagName).toBe("INPUT");
    });
  });

  it("handles select input blur and change events", () => {
    const handleBlur = jest.fn();
    const handleChange = jest.fn();
    renderFormInput({
      type: "select",
      options: [
        { key: "Option 1", value: "1" },
        { key: "Option 2", value: "2" },
      ],
      onBlurSelect: handleBlur,
      onChangeSelect: handleChange,
    });

    const selectElement = screen.getByLabelText("Test Label");
    fireEvent.change(selectElement, { target: { value: "1" } });
    fireEvent.blur(selectElement);

    expect(handleBlur).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("handles textarea blur and change events", () => {
    const handleBlur = jest.fn();
    const handleChange = jest.fn();
    renderFormInput({
      type: "textarea",
      onBlurArea: handleBlur,
      onChangeArea: handleChange,
    });

    const textareaElement = screen.getByLabelText("Test Label");
    fireEvent.change(textareaElement, { target: { value: "new value" } });
    fireEvent.blur(textareaElement);

    expect(handleBlur).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
