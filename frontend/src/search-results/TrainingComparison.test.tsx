import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { TrainingComparison } from "./TrainingComparison";
import { buildTrainingResult } from "../test-objects/factories";
import { en as Content } from "../locales/en";

const { comparisonCompare, comparisonCollapse, comparisonClear } = Content.SearchResultsPage;

// @todo: update test
xdescribe("<TrainingComparison />", () => {
  it("shows collapsed items by default", () => {
    const mockSetTrainings = jest.fn();
    const trainings = [buildTrainingResult({ name: "training1" })];

    const subject = render(<TrainingComparison comparisonItems={trainings} />);

    expect(subject.queryByTestId("training-comparison")).not.toHaveClass("expanded");
    expect(subject.queryByText(comparisonCompare)).toBeTruthy();
    expect(subject.queryByText(comparisonCollapse)).toBeFalsy();
    expect(mockSetTrainings).not.toHaveBeenCalled();
  });

  it("shows comparison table when compare is clicked", () => {
    const mockSetTrainings = jest.fn();
    const trainings = [buildTrainingResult({ name: "training1" })];

    const subject = render(<TrainingComparison comparisonItems={trainings} />);

    expect(subject.queryByTestId("training-comparison")).not.toHaveClass("expanded");
    expect(subject.queryByText(comparisonCompare)).toBeTruthy();
    expect(subject.queryByText(comparisonCollapse)).toBeFalsy();

    fireEvent.click(subject.getByText(comparisonCompare));

    expect(subject.queryByTestId("training-comparison")).toHaveClass("expanded");
    expect(subject.queryByText(comparisonCompare)).toBeFalsy();
    expect(subject.queryByText(comparisonCollapse)).toBeTruthy();
    expect(mockSetTrainings).not.toHaveBeenCalled();
  });

  it("removes a single item by clicking item delete button", () => {
    const mockSetTrainings = jest.fn();
    const trainings = [buildTrainingResult({ name: "training1" })];

    const subject = render(<TrainingComparison comparisonItems={trainings} />);

    expect(mockSetTrainings).not.toHaveBeenCalled();

    fireEvent.click(subject.getByRole("button", { name: "Cancel" }));

    expect(mockSetTrainings).toHaveBeenCalled();
  });

  it("it removes all items by clicking clear all", () => {
    const mockSetTrainings = jest.fn();
    const trainings = [
      buildTrainingResult({ name: "training1" }),
      buildTrainingResult({ name: "training2" }),
      buildTrainingResult({ name: "training3" }),
    ];

    const subject = render(<TrainingComparison comparisonItems={trainings} />);

    expect(mockSetTrainings).not.toHaveBeenCalled();

    fireEvent.click(subject.getByText(comparisonClear));

    expect(mockSetTrainings).toHaveBeenCalled();
  });
});
