import { render } from "@testing-library/react";
import React from "react";
import { withContextualInfo } from "../test-objects/helpers";
import { ContextualInfoPanel } from "./ContextualInfoPanel";

describe("<ContextualInfoPanel />", () => {
  it("is closed when isOpen is false", () => {
    const subject = render(
      withContextualInfo(
        <ContextualInfoPanel />,
        {
          isOpen: false,
          title: "Test Title",
          body: "Test Body",
          linkUrl: undefined,
          linkText: undefined,
        },
        jest.fn()
      )
    );
    expect(subject.queryByLabelText("Additional Information Panel")).not.toBeInTheDocument();
  });

  it("is open when isOpen is true", () => {
    const subject = render(
      withContextualInfo(
        <ContextualInfoPanel />,
        {
          isOpen: true,
          title: "Test Title",
          body: "Test Body",
          linkUrl: undefined,
          linkText: undefined,
        },
        jest.fn()
      )
    );
    expect(subject.getByLabelText("Additional Information Panel")).toBeInTheDocument();
  });

  it("Displays title and body in open panel", () => {
    const subject = render(
      withContextualInfo(
        <ContextualInfoPanel />,
        {
          isOpen: true,
          title: "Test Title",
          body: "Test Body",
          linkUrl: undefined,
          linkText: undefined,
        },
        jest.fn()
      )
    );
    expect(subject.getByText("Test Title")).toBeInTheDocument();
    expect(subject.getByText("Test Body")).toBeInTheDocument();
  });

  it("Displays link if both url and text are defined", () => {
    const subject = render(
      withContextualInfo(
        <ContextualInfoPanel />,
        {
          isOpen: true,
          title: "Test Title",
          body: "Test Body",
          linkUrl: "www.example.com",
          linkText: "Test Link",
        },
        jest.fn()
      )
    );
    expect(subject.getByText("Test Link")).toBeInTheDocument();
  });

  it("Does not display link if either url or text are undefined", () => {
    const subject = render(
      withContextualInfo(
        <ContextualInfoPanel />,
        {
          isOpen: true,
          title: "Test Title",
          body: "Test Body",
          linkUrl: undefined,
          linkText: "Test Link",
        },
        jest.fn()
      )
    );
    expect(subject.queryByText("Test Link")).not.toBeInTheDocument();
  });
});
