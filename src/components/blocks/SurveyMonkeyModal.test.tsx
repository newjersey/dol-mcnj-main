import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SurveyMonkeyModal } from "./SurveyMonkeyModal";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Phosphor icons
jest.mock("@phosphor-icons/react", () => ({
  X: ({ size, weight }: any) => (
    <svg data-testid="x-icon" data-size={size} data-weight={weight}>
      <path d="mock-x-icon" />
    </svg>
  ),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

describe("SurveyMonkeyModal", () => {
  const defaultProps = {
    surveyUrl: "https://example.surveymonkey.com/r/test",
    title: "Test Survey",
    storageKey: "test_survey_status",
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset document body overflow style
    document.body.style.overflow = "auto";
    
    // Clear any pending navigation data
    delete (window as any).__pendingNavigation;
  });

  it("renders modal with correct structure", () => {
    render(<SurveyMonkeyModal {...defaultProps} />);
    
    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveClass("surveyMonkeyModal");
    expect(modal).not.toHaveClass("open");
  });

  it("does not show modal initially", () => {
    render(<SurveyMonkeyModal {...defaultProps} />);
    
    const modal = screen.getByRole("dialog");
    expect(modal).toHaveAttribute("aria-hidden", "true");
    expect(modal).not.toHaveClass("open");
  });

  it("shows modal when navigation is attempted", async () => {
    render(
      <div>
        <SurveyMonkeyModal {...defaultProps} />
        <a href="/test-page">Test Link</a>
      </div>
    );
    
    const link = screen.getByRole("link", { name: "Test Link" });
    fireEvent.click(link);
    
    await waitFor(() => {
      const modal = screen.getByRole("dialog");
      expect(modal).toHaveClass("surveyMonkeyModal open");
      expect(modal).toHaveAttribute("aria-hidden", "false");
    });
  });
  it("displays modal title correctly", async () => {
    render(
      <div>
        <SurveyMonkeyModal {...defaultProps} />
        <a href="/test-page">Test Link</a>
      </div>
    );
    
    const link = screen.getByRole("link", { name: "Test Link" });
    fireEvent.click(link);
    
    await waitFor(() => {
      const title = screen.getByText("Test Survey");
      expect(title).toBeInTheDocument();
    });
  });

  it("closes modal when close button is clicked and marks as dismissed", async () => {
    render(
      <div>
        <SurveyMonkeyModal {...defaultProps} />
        <a href="/test-page">Test Link</a>
      </div>
    );
    
    // Open modal by clicking link
    const link = screen.getByRole("link", { name: "Test Link" });
    fireEvent.click(link);
    
    await waitFor(() => {
      const modal = document.querySelector('.surveyMonkeyModal');
      expect(modal).toHaveClass("surveyMonkeyModal open");
    });
    
    // Close modal
    const closeButton = screen.getByLabelText("Close survey modal");
    fireEvent.click(closeButton);
    
    const modal = document.querySelector('.surveyMonkeyModal');
    expect(modal).not.toHaveClass("open");
    expect(localStorageMock.setItem).toHaveBeenCalledWith("test_survey_status", "dismissed");
  });

  it("closes modal when Escape key is pressed", async () => {
    render(
      <div>
        <SurveyMonkeyModal {...defaultProps} />
        <a href="/test-page">Test Link</a>
      </div>
    );
    
    // Open modal by clicking link
    const link = screen.getByRole("link", { name: "Test Link" });
    fireEvent.click(link);
    
    await waitFor(() => {
      const modal = document.querySelector('.surveyMonkeyModal');
      expect(modal).toHaveClass("surveyMonkeyModal open");
    });
    
    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });
    
    const modal = document.querySelector('.surveyMonkeyModal');
    expect(modal).not.toHaveClass("open");
  });

  it("renders iframe when modal is open", async () => {
    render(
      <div>
        <SurveyMonkeyModal {...defaultProps} />
        <a href="/test-page">Test Link</a>
      </div>
    );
    
    // Open modal by clicking link
    const link = screen.getByRole("link", { name: "Test Link" });
    fireEvent.click(link);
    
    await waitFor(() => {
      const iframe = screen.getByTitle("Survey");
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveClass("survey-iframe");
    });
  });

  it("does not render iframe when modal is closed", () => {
    render(<SurveyMonkeyModal {...defaultProps} />);
    
    const iframe = screen.queryByTitle("Survey");
    expect(iframe).not.toBeInTheDocument();
  });

  it("sets body overflow to hidden when modal is open", async () => {
    render(
      <div>
        <SurveyMonkeyModal {...defaultProps} />
        <a href="/test-page">Test Link</a>
      </div>
    );
    
    const link = screen.getByRole("link", { name: "Test Link" });
    fireEvent.click(link);
    
    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  it("does not show modal if user has already completed survey", () => {
    localStorageMock.getItem.mockReturnValue("completed");
    
    render(
      <div>
        <SurveyMonkeyModal {...defaultProps} />
        <a href="/test-page">Test Link</a>
      </div>
    );
    
    const link = screen.getByRole("link", { name: "Test Link" });
    fireEvent.click(link);
    
    const modal = screen.getByRole("dialog");
    expect(modal).not.toHaveClass("open");
  });

  it("does not show modal if user has already dismissed survey", () => {
    localStorageMock.getItem.mockReturnValue("dismissed");
    
    render(
      <div>
        <SurveyMonkeyModal {...defaultProps} />
        <a href="/test-page">Test Link</a>
      </div>
    );
    
    const link = screen.getByRole("link", { name: "Test Link" });
    fireEvent.click(link);
    
    const modal = screen.getByRole("dialog");
    expect(modal).not.toHaveClass("open");
  });

  it("uses custom storage key", async () => {
    const customStorageKey = "custom_survey_key";
    render(
      <div>
        <SurveyMonkeyModal {...defaultProps} storageKey={customStorageKey} />
        <a href="/test-page">Test Link</a>
      </div>
    );
    
    const link = screen.getByRole("link", { name: "Test Link" });
    fireEvent.click(link);
    
    await waitFor(() => {
      const modal = screen.getByRole("dialog");
      expect(modal).toHaveClass("open");
    });
    
    const closeButton = screen.getByLabelText("Close survey modal");
    fireEvent.click(closeButton);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(customStorageKey, "dismissed");
  });
});