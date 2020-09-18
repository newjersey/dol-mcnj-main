import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { OccupationPage } from "./OccupationPage";
import { buildOccupationDetail } from "../test-objects/factories";
import { act } from "react-dom/test-utils";
import { StubClient } from "../test-objects/StubClient";
import { Error } from "../domain/Error";

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
      medianSalary: 97820,
      openJobsCount: 1010,
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText("Test SOC Code")).toBeInTheDocument();
    expect(subject.getByText("some cool description")).toBeInTheDocument();
    expect(subject.getByText("task1")).toBeInTheDocument();
    expect(subject.getByText("task2")).toBeInTheDocument();
    expect(subject.getByText("some education text")).toBeInTheDocument();
    expect(subject.queryByText("In Demand")).toBeInTheDocument();
    expect(subject.getByText("1,010")).toBeInTheDocument();
    expect(subject.getByText("$97,820")).toBeInTheDocument();
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

  it("displays the Not Found page on not found error", () => {
    const subject = render(<OccupationPage client={stubClient} />);

    act(() => stubClient.capturedObserver.onError(Error.NOT_FOUND));

    expect(
      subject.getByText("Sorry, we can't seem to find that page", { exact: false })
    ).toBeInTheDocument();
  });

  it("displays the Error page on server error", () => {
    const subject = render(<OccupationPage client={stubClient} />);

    act(() => stubClient.capturedObserver.onError(Error.SYSTEM_ERROR));

    expect(subject.getByText("Sorry, something went wrong", { exact: false })).toBeInTheDocument();
  });

  it("displays -- message if open jobs count is null", () => {
    const occupationDetail = buildOccupationDetail({
      openJobsCount: null,
    });
    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);
    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));
    expect(subject.getByText("--")).toBeInTheDocument();
  });

  it("displays -- message if median salary is not available", () => {
    const occupationDetail = buildOccupationDetail({
      medianSalary: null,
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText("--")).toBeInTheDocument();
  });
});
