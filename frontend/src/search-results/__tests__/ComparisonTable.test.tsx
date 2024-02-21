import React from "react";
import { render } from "@testing-library/react";
import { ComparisonTable } from "../ComparisonTable";
import { buildTrainingResult } from "../../test-objects/factories";

describe("<ComparisonTable />", () => {
  it("renders the table correctly", () => {
    const data = [
      buildTrainingResult({ id: "1", name: "training1", providerName: "provider1", inDemand: true }),
      buildTrainingResult({ id: "2", name: "training2", providerName: "provider2", inDemand: false }),
      buildTrainingResult({ id: "3", name: "training3", providerName: "provider3", inDemand: false }),
    ];
    const scrollEnd = true;

    const { getByTestId, getByText } = render(<ComparisonTable data={data} scrollEnd={scrollEnd} />);

    expect(getByText("training1", { exact: false })).toBeInTheDocument();
    expect(getByText("training2", { exact: false })).toBeInTheDocument();
    expect(getByText("training3", { exact: false })).toBeInTheDocument();
    expect(getByText("provider1", { exact: false })).toBeInTheDocument();
    expect(getByText("provider2", { exact: false })).toBeInTheDocument();
    expect(getByText("provider3", { exact: false })).toBeInTheDocument();
    expect(getByText("Cost", { exact: false })).toBeInTheDocument();
    expect(getByTestId("in-demand-badge")).toBeInTheDocument();
  });

  it("renders the mobile table correctly", () => {
    const data = [
      buildTrainingResult({ id: "1", name: "training1", providerName: "provider1", inDemand: true }),
      buildTrainingResult({ id: "2", name: "training2", providerName: "provider2", inDemand: false }),
      buildTrainingResult({ id: "3", name: "training3", providerName: "provider3", inDemand: false }),
    ];
    const scrollEnd = true;

    const { getByText, getByTestId } = render(<ComparisonTable data={data} scrollEnd={scrollEnd} />);

    expect(getByText("training1")).toBeInTheDocument();
    expect(getByText("training2")).toBeInTheDocument();
    expect(getByText("training3")).toBeInTheDocument();
    expect(getByText("provider1")).toBeInTheDocument();
    expect(getByText("provider2")).toBeInTheDocument();
    expect(getByText("provider3")).toBeInTheDocument();
    expect(getByText("Cost")).toBeInTheDocument();
    expect(getByTestId("in-demand-badge")).toBeInTheDocument(); // Assuming you have a component called InDemandTag
  });
});