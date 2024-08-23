import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OccupationListItem } from "./OccupationListItem";

// Mock the Button and LinkObject components
jest.mock("./Button", () => ({
  Button: jest.fn(({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  )),
}));

jest.mock("./LinkObject", () => ({
  LinkObject: jest.fn(({ children, url }) => <a href={url}>{children}</a>),
}));

// Mock the convertToPascalCase function
jest.mock("../../utils/convertToPascalCase", () => ({
  convertToPascalCase: jest.fn((str) =>
    str.replace(/(^\w|-\w)/g, (match) => match.replace("-", "").toUpperCase()),
  ),
}));

// Mock the Icon components
jest.mock("../svgs/occupations", () => ({
  ExampleOccupations: jest.fn(() => <svg data-testid="example-icon" />),
}));

describe("OccupationListItem", () => {
  const items = [
    { soc: "12345", title: "Job Title 1", counties: ["County 1", "County 2"] },
    { soc: "67890", title: "Job Title 2", counties: [] },
  ];

  it("renders correctly with required props", () => {
    const { getByText } = render(
      <OccupationListItem title="Example" items={items} />,
    );
    expect(getByText("Example")).toBeInTheDocument();
  });

  it("toggles the open state when the button is clicked", () => {
    const { getByText, queryByText } = render(
      <OccupationListItem title="Example" items={items} />,
    );
    expect(queryByText("Job Title 1")).not.toBeInTheDocument();

    fireEvent.click(getByText("Example"));
    expect(getByText("Job Title 1")).toBeInTheDocument();

    fireEvent.click(getByText("Example"));
    expect(queryByText("Job Title 1")).not.toBeInTheDocument();
  });

  it("displays the correct icon based on the open state", () => {
    const { getByText, getByTestId } = render(
      <OccupationListItem title="Example" items={items} />,
    );
    fireEvent.click(getByText("Example"));
    expect(getByTestId("example-icon")).toBeInTheDocument();
  });

  it("renders the list of items when open is true", () => {
    const { getByText } = render(
      <OccupationListItem title="Example" items={items} />,
    );
    fireEvent.click(getByText("Example"));
    expect(getByText("Job Title 1")).toBeInTheDocument();
    expect(getByText("Job Title 2")).toBeInTheDocument();
  });

  it("renders the LinkObject for each item correctly", () => {
    const { getByText } = render(
      <OccupationListItem title="Example" items={items} />,
    );
    fireEvent.click(getByText("Example"));
    expect(getByText("Job Title 1").closest("a")).toHaveAttribute(
      "href",
      "/occupation/12345",
    );
    expect(getByText("Job Title 2").closest("a")).toHaveAttribute(
      "href",
      "/occupation/67890",
    );
  });

  it("displays the correct counties information for each item", () => {
    const { getByText } = render(
      <OccupationListItem title="Example" items={items} />,
    );
    fireEvent.click(getByText("Example"));
    expect(
      getByText("(In-demad only in County 1, County 2 Counties)"),
    ).toBeInTheDocument();
    expect(
      getByText("(In-demad only in County 1, County 2 Counties)"),
    ).toBeInTheDocument();
  });
});
