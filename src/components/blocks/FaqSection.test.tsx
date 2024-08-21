import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FaqSection } from "./FaqSection";
import { dropNavItems } from "../../stories/mock/dropNavItems";
// import { Spinner } from "../modules/Spinner";

// jest.mock("../modules/Spinner", () => ({
//   Spinner: ({ size, color }: any) => (
//     <div
//       data-testid="spinner"
//       style={{ width: size, height: size, backgroundColor: color }}
//     />
//   ),
// }));

describe("FaqSection Component", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("renders without crashing", () => {
    const { container } = render(<FaqSection items={dropNavItems} />);
    expect(container).toBeInTheDocument();
  });

  it("renders DropNav and sets active topic correctly", () => {
    const { getByText } = render(<FaqSection items={dropNavItems} />);
    const dropNavItem = getByText("Tuition Assistance for Training");
    fireEvent.click(dropNavItem);
    expect(
      getByText("Can I get help paying for training?"),
    ).toBeInTheDocument();
  });

  it("renders Accordion with active topic items", () => {
    const { getByText } = render(<FaqSection items={dropNavItems} />);
    expect(
      getByText("What kinds of trainings can I find on this site?"),
    ).toBeInTheDocument();
  });

  it("applies className correctly", () => {
    const { container } = render(
      <FaqSection items={dropNavItems} className="test-class" />,
    );
    expect(container.firstChild).toHaveClass("faqSection test-class");
  });

  it("updates URL hash and sets active topic on DropNav change", () => {
    const { getByText } = render(<FaqSection items={dropNavItems} />);
    const dropNavItem = getByText("Tuition Assistance for Training");
    fireEvent.click(dropNavItem);

    expect(window.location.hash).toBe("#tuition-assistance-for-training");
  });
});
