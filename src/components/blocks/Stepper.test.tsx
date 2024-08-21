import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Stepper } from "./Stepper";
import { IconSelector } from "../modules/IconSelector";

jest.mock("../modules/IconSelector", () => ({
  IconSelector: jest.fn(() => <div>Icon</div>),
}));

jest.mock("../modules/Markdown", () => ({
  Markdown: jest.fn(({ content }) => <div>{content}</div>),
}));

describe("Stepper", () => {
  const steps = [
    {
      sys: {
        id: "1",
      },
      heading: "Step 1",
      icon: "icon1",
      description: "Description 1",
    },
    {
      sys: {
        id: "2",
      },
      heading: "Step 2",
      icon: "icon2",
      description: "Description 2",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with given steps", () => {
    render(<Stepper steps={steps} />);
    steps.forEach((step) => {
      expect(screen.getByText(step.heading)).toBeInTheDocument();
      expect(screen.getByText(step.description)).toBeInTheDocument();
    });
  });

  it("renders with the correct theme", () => {
    render(<Stepper steps={steps} theme="blue" />);
    expect(
      screen.getByText("Step 1").parentElement?.parentElement?.className,
    ).toContain("theme-blue");
  });

  it("renders with the default theme when no theme is provided", () => {
    render(<Stepper steps={steps} theme="green" />);
    expect(
      screen.getByText("Step 1").parentElement?.parentElement?.className,
    ).toContain("theme-green");
  });

  it("applies the className prop", () => {
    render(<Stepper steps={steps} className="custom-class" />);
    expect(
      screen.getByText("Step 1").parentElement?.parentElement?.className,
    ).toContain("custom-class");
  });

  it("renders IconSelector for each step", () => {
    render(<Stepper steps={steps} />);
    expect(IconSelector).toHaveBeenCalledTimes(steps.length);
  });

  it("renders Markdown for each step description", () => {
    render(<Stepper steps={steps} />);
    steps.forEach((step) => {
      expect(screen.getByText(step.description)).toBeInTheDocument();
    });
  });
});
