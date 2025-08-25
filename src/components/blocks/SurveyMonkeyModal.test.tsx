import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SurveyMonkeyModal } from "./SurveyMonkeyModal";

// Mock the Button component
jest.mock("../modules/Button", () => ({
  Button: ({ children, onClick, className, iconPrefix }: any) => (
    <button onClick={onClick} className={className} data-icon={iconPrefix}>
      {children}
    </button>
  ),
}));

// Mock Phosphor icons
jest.mock("@phosphor-icons/react", () => ({
  X: ({ size, weight }: any) => (
    <svg data-testid="x-icon" data-size={size} data-weight={weight}>
      <path d="mock-x-icon" />
    </svg>
  ),
}));

describe("SurveyMonkeyModal", () => {
  const defaultProps = {
    surveyUrl: "https://example.surveymonkey.com/r/test",
    buttonText: "Take Survey",
    title: "Test Survey",
  };

  beforeEach(() => {
    // Reset document body overflow style before each test
    document.body.style.overflow = "auto";
  });

  it("renders trigger button with correct text", () => {
    render(<SurveyMonkeyModal {...defaultProps} />);
    
    const button = screen.getByRole("button", { name: "Take Survey" });
    expect(button).toBeInTheDocument();
  });

  it("opens modal when trigger button is clicked", () => {
    render(<SurveyMonkeyModal {...defaultProps} />);
    
    const button = screen.getByRole("button", { name: "Take Survey" });
    fireEvent.click(button);
    
    const modal = screen.getByRole("dialog");
    expect(modal).toHaveClass("surveyMonkeyModal open");
  });

  it("displays modal title correctly", () => {
    render(<SurveyMonkeyModal {...defaultProps} />);
    
    const button = screen.getByRole("button", { name: "Take Survey" });
    fireEvent.click(button);
    
    const title = screen.getByText("Test Survey");
    expect(title).toBeInTheDocument();
  });

  it("closes modal when close button is clicked", () => {
    render(<SurveyMonkeyModal {...defaultProps} />);
    
    // Open modal
    const triggerButton = screen.getByRole("button", { name: "Take Survey" });
    fireEvent.click(triggerButton);
    
    const modal = document.querySelector('.surveyMonkeyModal');
    expect(modal).toHaveClass("surveyMonkeyModal open");
    
    // Close modal
    const closeButton = screen.getByLabelText("Close survey modal");
    fireEvent.click(closeButton);
    
    expect(modal).toHaveClass("surveyMonkeyModal");
    expect(modal).not.toHaveClass("open");
  });

  it("closes modal when Escape key is pressed", () => {
    render(<SurveyMonkeyModal {...defaultProps} />);
    
    // Open modal
    const button = screen.getByRole("button", { name: "Take Survey" });
    fireEvent.click(button);
    
    const modal = document.querySelector('.surveyMonkeyModal');
    expect(modal).toHaveClass("surveyMonkeyModal open");
    
    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });
    
    expect(modal).toHaveClass("surveyMonkeyModal");
    expect(modal).not.toHaveClass("open");
  });

  it("renders iframe when modal is open", async () => {
    render(<SurveyMonkeyModal {...defaultProps} />);
    
    const button = screen.getByRole("button", { name: "Take Survey" });
    fireEvent.click(button);
    
    const iframe = screen.getByTitle("Survey");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveClass("survey-iframe");
  });

  it("does not render iframe when modal is closed", () => {
    render(<SurveyMonkeyModal {...defaultProps} />);
    
    const iframe = screen.queryByTitle("Survey");
    expect(iframe).not.toBeInTheDocument();
  });

  it("sets body overflow to hidden when modal is open", () => {
    render(<SurveyMonkeyModal {...defaultProps} />);
    
    const button = screen.getByRole("button", { name: "Take Survey" });
    fireEvent.click(button);
    
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("supports auto-open mode", () => {
    render(<SurveyMonkeyModal {...defaultProps} autoOpen={true} />);
    
    const modal = screen.getByRole("dialog");
    expect(modal).toHaveClass("surveyMonkeyModal open");
  });

  it("does not render trigger button in auto-open mode", () => {
    render(<SurveyMonkeyModal {...defaultProps} autoOpen={true} />);
    
    const button = screen.queryByRole("button", { name: "Take Survey" });
    expect(button).not.toBeInTheDocument();
  });

  it("uses custom button text and icon", () => {
    render(
      <SurveyMonkeyModal
        {...defaultProps}
        buttonText="Custom Survey"
        buttonIcon="CustomIcon"
      />
    );
    
    const button = screen.getByRole("button", { name: "Custom Survey" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-icon", "CustomIcon");
  });
});