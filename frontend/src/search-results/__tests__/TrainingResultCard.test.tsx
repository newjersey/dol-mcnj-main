import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TrainingResultCard } from "../TrainingResultCard";
import { buildTrainingResult } from "../../test-objects/factories";

describe("<TrainingResultCard />", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the training result card correctly", () => {
    const trainingResult = buildTrainingResult({ name: "training1", totalCost: 1000 });
    render(<TrainingResultCard trainingResult={trainingResult} />);

    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByText(trainingResult.name, { exact: false })).toBeInTheDocument();
    expect(screen.getByText("$1,000", { exact: false })).toBeInTheDocument();
  });

  it.skip("dispatches ADD comparison action when checkbox is checked", async () => {
    const trainingResult = buildTrainingResult({ name: "training1" });
    render(
      <TrainingResultCard trainingResult={trainingResult} comparisonItems={[]} />
    );
    
    await act(async () => {
      fireEvent.click(screen.getByLabelText("Compare"));
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ADD",
      comparison: trainingResult,
      list: [],
    });
  });

  it.skip("dispatches REMOVE comparison action when checkbox is unchecked", () => {
    const trainingResult = buildTrainingResult({ name: "training1" });
    const { getByLabelText } = render(
      <TrainingResultCard trainingResult={trainingResult} comparisonItems={[trainingResult]} />
    );

    fireEvent.click(getByLabelText("Compare"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "REMOVE",
      comparison: trainingResult,
      list: [trainingResult],
    });
  });
});