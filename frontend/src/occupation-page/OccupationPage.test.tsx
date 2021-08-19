import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { OccupationPage } from "./OccupationPage";
import {
  buildOccupation,
  buildOccupationDetail,
  buildTrainingResult,
} from "../test-objects/factories";
import { act } from "react-dom/test-utils";
import { StubClient } from "../test-objects/StubClient";
import { Error } from "../domain/Error";
import { SearchResultsPageStrings } from "../localizations/SearchResultsPageStrings";
import { OccupationPageStrings } from "../localizations/OccupationPageStrings";
import { ErrorPageStrings } from "../localizations/ErrorPageStrings";
import { StatBlockStrings } from "../localizations/StatBlockStrings";

const { inDemandTag } = SearchResultsPageStrings;
const { dataUnavailableText, seeLess, seeMore, relatedTrainingSeeMore } = OccupationPageStrings;
const { notFoundHeader, somethingWentWrongHeader } = ErrorPageStrings;
const { missingDataIndicator } = StatBlockStrings;

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
      relatedOccupations: [
        buildOccupation({ title: "Related 1" }),
        buildOccupation({ title: "Related 2" }),
      ],
      relatedTrainings: [
        buildTrainingResult({ name: "Training 1", inDemand: false }),
        buildTrainingResult({ name: "Training 2", inDemand: false }),
      ],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText("Test SOC Code")).toBeInTheDocument();
    expect(subject.getByText("some cool description")).toBeInTheDocument();
    expect(subject.getByText("task1")).toBeInTheDocument();
    expect(subject.getByText("task2")).toBeInTheDocument();
    expect(subject.getByText("some education text")).toBeInTheDocument();
    expect(subject.queryByText(inDemandTag)).toBeInTheDocument();
    expect(subject.getByText("1,010")).toBeInTheDocument();
    expect(subject.getByText("$97,820")).toBeInTheDocument();
    expect(subject.getByText("Related 1")).toBeInTheDocument();
    expect(subject.getByText("Related 2")).toBeInTheDocument();
    expect(subject.getByText("Training 1")).toBeInTheDocument();
    expect(subject.getByText("Training 2")).toBeInTheDocument();

    const jobOpenings = subject.getAllByTestId("jobOpenings");
    expect(jobOpenings).toHaveLength(1);
  });

  it("does not display an in-demand tag when a occupation is not in-demand", () => {
    const subject = render(<OccupationPage client={stubClient} />);
    const notInDemand = buildOccupationDetail({ inDemand: false, relatedTrainings: [] });
    act(() => stubClient.capturedObserver.onSuccess(notInDemand));

    expect(subject.queryByText(inDemandTag)).not.toBeInTheDocument();
  });

  it("displays data missing message if tasks are not available", () => {
    const occupationDetail = buildOccupationDetail({
      tasks: [],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText(dataUnavailableText)).toBeInTheDocument();
  });

  it("displays data missing message if related occupations are not available", () => {
    const occupationDetail = buildOccupationDetail({
      relatedOccupations: [],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText(dataUnavailableText)).toBeInTheDocument();
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

    expect(subject.getByText(seeLess)).toBeInTheDocument();
  });

  it("does not show See More if there are 5 tasks or fewer", () => {
    const occupationDetail = buildOccupationDetail({
      tasks: ["task1", "task2", "task3", "task4", "task5"],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.queryByText(seeMore)).not.toBeInTheDocument();
  });

  it("displays data missing message if education is not available", () => {
    const occupationDetail = buildOccupationDetail({
      education: "",
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText(dataUnavailableText)).toBeInTheDocument();
  });

  it("displays the Not Found page on not found error", () => {
    const subject = render(<OccupationPage client={stubClient} />);

    act(() => stubClient.capturedObserver.onError(Error.NOT_FOUND));

    expect(subject.getByText(notFoundHeader, { exact: false })).toBeInTheDocument();
  });

  it("displays the Error page on server error", () => {
    const subject = render(<OccupationPage client={stubClient} />);

    act(() => stubClient.capturedObserver.onError(Error.SYSTEM_ERROR));

    expect(subject.getByText(somethingWentWrongHeader, { exact: false })).toBeInTheDocument();
  });

  it("displays -- message if open jobs count is null", () => {
    const occupationDetail = buildOccupationDetail({
      openJobsCount: null,
    });
    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);
    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));
    expect(subject.getByText(missingDataIndicator)).toBeInTheDocument();
  });

  it("displays -- message if median salary is not available", () => {
    const occupationDetail = buildOccupationDetail({
      medianSalary: null,
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText(missingDataIndicator)).toBeInTheDocument();
  });

  it("displays data missing message if related trainings is not available", () => {
    const occupationDetail = buildOccupationDetail({
      relatedTrainings: [],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText(dataUnavailableText)).toBeInTheDocument();
  });

  it("shows 'See More Results' if more than 3 related trainings", () => {
    const occupationDetail = buildOccupationDetail({
      relatedTrainings: [
        buildTrainingResult({ name: "Training 1" }),
        buildTrainingResult({ name: "Training 2" }),
        buildTrainingResult({ name: "Training 3" }),
        buildTrainingResult({ name: "Training 4" }),
      ],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);
    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText("Training 1")).toBeInTheDocument();
    expect(subject.getByText("Training 2")).toBeInTheDocument();
    expect(subject.getByText("Training 3")).toBeInTheDocument();
    expect(subject.queryByText("Training 4")).not.toBeInTheDocument();

    expect(subject.queryByText(relatedTrainingSeeMore)).toBeInTheDocument();
  });

  it("does not show See More Results if there are 3 related trainings or fewer", () => {
    const occupationDetail = buildOccupationDetail({
      relatedTrainings: [
        buildTrainingResult({ name: "Training 1" }),
        buildTrainingResult({ name: "Training 2" }),
        buildTrainingResult({ name: "Training 3" }),
      ],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.queryByText(relatedTrainingSeeMore)).not.toBeInTheDocument();
  });

  it("does not display job openings link if there are no job openings", () => {
    const occupationDetail = buildOccupationDetail({
      openJobsCount: null,
    });
    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);
    act(() => stubClient.capturedObserver.onSuccess(occupationDetail));

    const jobOpenings = subject.queryAllByTestId("jobOpenings");
    expect(jobOpenings).toHaveLength(0);
  });
});
