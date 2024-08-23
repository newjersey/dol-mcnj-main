import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Tabs } from "./Tabs";
import { slugify } from "../../utils/slugify";
import { tabContent } from "../../stories/mock/tabs";

jest.mock("../modules/Spinner", () => ({
  Spinner: jest.fn(({ size, color }) => (
    <div data-testid="spinner">Spinner</div>
  )),
}));

describe("Tabs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState({}, "", "/");
  });

  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  it("renders correctly with given items", () => {
    render(<Tabs items={tabContent} />);
    expect(screen.getAllByText("Introduction")[0]).toBeInTheDocument();
    expect(
      screen.getByText("Center for Occupational Employment Information (COEI)"),
    ).toBeInTheDocument();
  });

  it("handles tab click and updates the active tab", async () => {
    render(<Tabs items={tabContent} />);
    fireEvent.click(screen.getAllByText("ETPL")[0]);
    expect(screen.getAllByText("ETPL")[0]).toHaveClass("usa-current");
    expect(
      screen.getAllByText(
        "What is the Eligible Training Provider List (ETPL)?",
      )[1],
    ).toBeInTheDocument();
  });

  it("updates the URL hash when a tab is clicked", async () => {
    render(<Tabs items={tabContent} />);
    fireEvent.click(screen.getByText("ETPL"));
    await waitFor(() => {
      expect(window.location.hash).toBe("#etpl");
    });
  });

  it("scrolls to the heading when a sub-heading is clicked", async () => {
    render(<Tabs items={tabContent} />);
    fireEvent.click(screen.getAllByText("Introduction")[0]);
    await waitFor(() => {
      expect(window.location.hash).toBe("#introduction");
    });
  });

  it("displays a spinner when no active tab is found", () => {
    render(<Tabs />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("assigns IDs to headings based on the slugified text", () => {
    render(<Tabs items={tabContent} />);
    const headingElements = document.querySelectorAll(
      ".content h1, .content h2, .content h3, .content h4",
    );
    headingElements.forEach((heading) => {
      expect(heading.id).toBe(slugify(heading.textContent || ""));
    });
  });

  it("toggles navigation menu on button click", () => {
    render(<Tabs items={tabContent} />);
    const toggleButton = screen.getAllByText("Table of Contents")[0];
    fireEvent.click(toggleButton);
    expect(screen.getByRole("navigation")).not.toHaveClass("closed");
    fireEvent.click(toggleButton);
    expect(screen.getByRole("navigation")).toHaveClass("closed");
  });
});
