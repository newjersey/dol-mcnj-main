import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ResultCard } from "./ResultCard";

// Mock utility functions and components
jest.mock("../../utils/toUsCurrency", () => ({
  toUsCurrency: jest.fn((num) => `$${num.toFixed(2)}`),
}));

jest.mock("../../utils/calendarLength", () => ({
  calendarLength: jest.fn((num) => `${num} weeks`),
}));

jest.mock("../../utils/replaceDoubleBracketsWithStrong", () => ({
  replaceDoubleBracketsWithStrong: jest.fn((str) =>
    str.replace(/\[\[(.*?)\]\]/g, "<strong>$1</strong>"),
  ),
}));

jest.mock("./Heading", () => ({
  Heading: jest.fn(({ children }) => <h3>{children}</h3>),
}));

jest.mock("./Tag", () => ({
  Tag: jest.fn(({ title }) => <span>{title}</span>),
}));

jest.mock("./FormInput", () => ({
  FormInput: jest.fn(({ inputId, type, label, onChange, disabled }) => (
    <input
      id={inputId}
      type={type}
      aria-label={label}
      onChange={onChange}
      disabled={disabled}
    />
  )),
}));

jest.mock("./LinkObject", () => ({
  LinkObject: jest.fn(({ children, url }) => <a href={url}>{children}</a>),
}));

describe("ResultCard", () => {
  const props = {
    title: "Test Title",
    trainingId: "12345",
    url: "/test-url",
    cost: 1000,
    description: "This is a [[test]] description.",
    education: "Bachelor's Degree",
    percentEmployed: 0.85,
    location: "Test Location",
    timeToComplete: 10,
    cipDefinition: {
      cipcode: "123456",
    },
    inDemandLabel: "In Demand",
    compare: true,
    disableCompare: false,
    onCompare: jest.fn(),
  };

  it("renders correctly with required props", () => {
    const { getByText } = render(<ResultCard {...props} />);
    expect(getByText("Test Title")).toBeInTheDocument();
  });

  it("applies the className prop correctly", () => {
    const { container } = render(
      <ResultCard {...props} className="test-class" />,
    );
    expect(container.firstChild).toHaveClass("resultCard test-class");
  });

  it("displays the cost in USD format using toUsCurrency", () => {
    const { getByText } = render(<ResultCard {...props} />);
    expect(getByText("$1000.00")).toBeInTheDocument();
  });

  it("displays the education and employment percentage", () => {
    const { getByText } = render(<ResultCard {...props} />);
    expect(getByText("Bachelor's Degree")).toBeInTheDocument();
    expect(getByText("85% employed")).toBeInTheDocument();
  });

  it("displays the location", () => {
    const { getByText } = render(<ResultCard {...props} />);
    expect(getByText("Test Location")).toBeInTheDocument();
  });

  it("displays the time to complete the training", () => {
    const { getByText } = render(<ResultCard {...props} />);
    expect(getByText("10 weeks to complete")).toBeInTheDocument();
  });

  it("displays the CIP code", () => {
    const { getByText } = render(<ResultCard {...props} />);
    expect(getByText("CIP: 12.3456")).toBeInTheDocument();
  });

  it("displays the description with double brackets replaced by <strong>", () => {
    const { container } = render(<ResultCard {...props} />);
    expect(container.querySelector(".description")?.innerHTML).toContain(
      "<strong>test</strong>",
    );
  });

  it("displays the in-demand label with the Tag component", () => {
    const { getByText } = render(<ResultCard {...props} />);
    expect(getByText("In Demand")).toBeInTheDocument();
  });

  it("handles the compare checkbox correctly", () => {
    const { getByLabelText } = render(<ResultCard {...props} />);
    const checkbox = getByLabelText("Compare");
    fireEvent.click(checkbox);
    expect(props.onCompare).toHaveBeenCalledWith("12345");
  });

  it("disables the compare checkbox correctly", () => {
    const { getByLabelText } = render(
      <ResultCard {...props} disableCompare={true} />,
    );
    const checkbox = getByLabelText("Compare");
    expect(checkbox).toBeDisabled();
  });
});
