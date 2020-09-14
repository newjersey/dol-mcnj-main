import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { OccupationPage } from "./OccupationPage";
import { buildOccupationDetail } from "../test-objects/factories";
import { act } from "react-dom/test-utils";
import { StubClient } from "../test-objects/StubClient";

describe("<OccupationPage />", () => {
  let stubClient: StubClient;

  beforeEach(() => {
    stubClient = new StubClient();
  });

  it("displays occupation details based on soc code", () => {
    const occupationDetail = buildOccupationDetail({
      soc: "12-3456",
      title: "Test SOC Code",
      description: "some cool description",
      tasks: ["task1", "task2"],
      education: "some education text",
      inDemand: true,
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText("Test SOC Code")).toBeInTheDocument();
    expect(subject.getByText("some cool description")).toBeInTheDocument();
    expect(subject.getByText("task1")).toBeInTheDocument();
    expect(subject.getByText("task2")).toBeInTheDocument();
    expect(subject.getByText("some education text")).toBeInTheDocument();
    expect(subject.queryByText("In Demand")).toBeInTheDocument();
  });

  it("does not display an in-demand tag when a occupation is not in-demand", () => {
    const subject = render(<OccupationPage client={stubClient} />);
    const notInDemand = buildOccupationDetail({ inDemand: false });
    act(() => stubClient.capturedObserver.onSuccess(notInDemand));

    expect(subject.queryByText("In Demand")).not.toBeInTheDocument();
  });

  it("displays data missing message if tasks are not available", () => {
    const occupationDetail = buildOccupationDetail({
      tasks: [],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(
      subject.getByText("This data is not yet available for this occupation.")
    ).toBeInTheDocument();
  });

  it("hides tasks beyond 5 behind a See More", () => {
    const occupationDetail = buildOccupationDetail({
      tasks: ["task1", "task2", "task3", "task4", "task5", "task6"],
    });
    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);
    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText("task1")).toBeInTheDocument();
    expect(subject.getByText("task2")).toBeInTheDocument();
    expect(subject.getByText("task3")).toBeInTheDocument();
    expect(subject.getByText("task4")).toBeInTheDocument();
    expect(subject.getByText("task5")).toBeInTheDocument();
    expect(subject.queryByText("task6")).not.toBeInTheDocument();

    fireEvent.click(subject.getByText("See More"));

    expect(subject.getByText("task1")).toBeInTheDocument();
    expect(subject.getByText("task2")).toBeInTheDocument();
    expect(subject.getByText("task3")).toBeInTheDocument();
    expect(subject.getByText("task4")).toBeInTheDocument();
    expect(subject.getByText("task5")).toBeInTheDocument();
    expect(subject.getByText("task6")).toBeInTheDocument();

    expect(subject.getByText("See Less")).toBeInTheDocument();
  });

  it("does not show See More if there are 5 tasks or fewer", () => {
    const occupationDetail = buildOccupationDetail({
      tasks: ["task1", "task2", "task3", "task4", "task5"],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.queryByText("See More")).not.toBeInTheDocument();
  });

  it("displays data missing message if education is not available", () => {
    const occupationDetail = buildOccupationDetail({
      education: "",
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(
      subject.getByText("This data is not yet available for this occupation.")
    ).toBeInTheDocument();
  });
});
