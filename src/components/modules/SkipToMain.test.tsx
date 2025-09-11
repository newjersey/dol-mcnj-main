import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SkipToMain } from "./SkipToMain";

describe("SkipToMain", () => {
  it("renders the button correctly", () => {
    const { getByText } = render(<SkipToMain />);
    expect(getByText("Skip to main content")).toBeInTheDocument();
  });

  it("focuses on the main content when the button is clicked and no focusable elements are present", () => {
    document.body.innerHTML = '<div id="main-content" tabindex="-1"></div>';
    const { getByText } = render(<SkipToMain />);
    const mainContent = document.getElementById("main-content") as HTMLElement;
    const focusSpy = jest.spyOn(mainContent, "focus");

    fireEvent.click(getByText("Skip to main content"));
    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it("focuses on the first focusable element within the main content when the button is clicked", () => {
    document.body.innerHTML = `
      <div id="main-content" tabindex="-1">
        <a href="#" tabindex="0">Focusable Link</a>
      </div>
    `;
    const { getByText } = render(<SkipToMain />);
    const focusableLink = document.querySelector(
      "#main-content a",
    ) as HTMLElement;
    const focusSpy = jest.spyOn(focusableLink, "focus");

    fireEvent.click(getByText("Skip to main content"));
    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it("does not throw an error if the main content is not found", () => {
    const { getByText } = render(<SkipToMain />);
    expect(() => {
      fireEvent.click(getByText("Skip to main content"));
    }).not.toThrow();
  });
});
