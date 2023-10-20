import React from "react";
import { fireEvent, render, act } from "@testing-library/react";
import { OccupationPage } from "./OccupationPage";
import {
  buildOccupation,
  buildOccupationDetail,
  buildTrainingResult,
} from "../test-objects/factories";
import { StubClient } from "../test-objects/StubClient";
import { Error } from "../domain/Error";
import { STAT_MISSING_DATA_INDICATOR } from "../constants";
import { en as Content } from "../locales/en";

const { inDemandTag } = Content.SearchResultsPage;
const { dataUnavailableText, seeLess, seeMore, relatedTrainingSeeMore } = Content.OccupationPage;

describe("<OccupationPage />", () => {
  let stubClient: StubClient;

  beforeEach(() => {
    stubClient = new StubClient();
  });

  it("displays occupation details based on soc code", async () => {
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

    await act(async () => stubClient.capturedObserver.onSuccess(occupationDetail));

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

  it("does not display an in-demand tag when a occupation is not in-demand", async () => {
    const subject = render(<OccupationPage client={stubClient} />);
    const notInDemand = buildOccupationDetail({ inDemand: false, relatedTrainings: [] });
    await act(async () => stubClient.capturedObserver.onSuccess(notInDemand));

    expect(subject.queryByText(inDemandTag)).not.toBeInTheDocument();
  });

  it("displays data missing message if tasks are not available", async () => {
    const occupationDetail = buildOccupationDetail({
      tasks: [],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    await act(async () => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText(dataUnavailableText)).toBeInTheDocument();
  });

  it("displays data missing message if related occupations are not available", async () => {
    const occupationDetail = buildOccupationDetail({
      relatedOccupations: [],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    await act(async () => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText(dataUnavailableText)).toBeInTheDocument();
  });

  it("hides tasks beyond 5 behind a See More", async () => {
    const occupationDetail = buildOccupationDetail({
      tasks: ["task1", "task2", "task3", "task4", "task5", "task6"],
    });
    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);
    await act(async () => stubClient.capturedObserver.onSuccess(occupationDetail));

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

  it("does not show See More if there are 5 tasks or fewer", async () => {
    const occupationDetail = buildOccupationDetail({
      tasks: ["task1", "task2", "task3", "task4", "task5"],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    await act(async () => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.queryByText(seeMore)).not.toBeInTheDocument();
  });

  it("displays data missing message if education is not available", async () => {
    const occupationDetail = buildOccupationDetail({
      education: "",
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    await act(async () => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText(dataUnavailableText)).toBeInTheDocument();
  });

  it("displays the Not Found page on not found error", async () => {
    const subject = render(<OccupationPage client={stubClient} />);

    await act(async () => stubClient.capturedObserver.onError(Error.NOT_FOUND));

    expect(
      subject.getByText(Content.ErrorPage.notFoundHeader, { exact: false }),
    ).toBeInTheDocument();
  });

  it("displays the Error page on server error", async () => {
    const subject = render(<OccupationPage client={stubClient} />);

    await act(async () => stubClient.capturedObserver.onError(Error.SYSTEM_ERROR));

    expect(
      subject.getByText(Content.ErrorPage.somethingWentWrongHeader, { exact: false }),
    ).toBeInTheDocument();
  });

  it("displays -- message if open jobs count is null", async () => {
    const occupationDetail = buildOccupationDetail({
      openJobsCount: null,
    });
    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);
    await act(async () => stubClient.capturedObserver.onSuccess(occupationDetail));
    expect(subject.getByText(STAT_MISSING_DATA_INDICATOR)).toBeInTheDocument();
  });

  it("displays -- message if median salary is not available", async () => {
    const occupationDetail = buildOccupationDetail({
      medianSalary: null,
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    await act(async () => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText(STAT_MISSING_DATA_INDICATOR)).toBeInTheDocument();
  });

  it("displays data missing message if related trainings is not available", async () => {
    const occupationDetail = buildOccupationDetail({
      relatedTrainings: [],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    await act(async () => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText(dataUnavailableText)).toBeInTheDocument();
  });

  it("shows 'See More Results' if more than 3 related trainings", async () => {
    const occupationDetail = buildOccupationDetail({
      relatedTrainings: [
        buildTrainingResult({ name: "Training 1" }),
        buildTrainingResult({ name: "Training 2" }),
        buildTrainingResult({ name: "Training 3" }),
        buildTrainingResult({ name: "Training 4" }),
      ],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);
    await act(async () => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.getByText("Training 1")).toBeInTheDocument();
    expect(subject.getByText("Training 2")).toBeInTheDocument();
    expect(subject.getByText("Training 3")).toBeInTheDocument();
    expect(subject.queryByText("Training 4")).not.toBeInTheDocument();

    expect(subject.queryByText(relatedTrainingSeeMore)).toBeInTheDocument();
  });

  it("does not show See More Results if there are 3 related trainings or fewer", async () => {
    const occupationDetail = buildOccupationDetail({
      relatedTrainings: [
        buildTrainingResult({ name: "Training 1" }),
        buildTrainingResult({ name: "Training 2" }),
        buildTrainingResult({ name: "Training 3" }),
      ],
    });

    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);

    await act(async () => stubClient.capturedObserver.onSuccess(occupationDetail));

    expect(subject.queryByText(relatedTrainingSeeMore)).not.toBeInTheDocument();
  });

  it("does not display job openings link if there are no job openings", async () => {
    const occupationDetail = buildOccupationDetail({
      openJobsCount: null,
    });
    const subject = render(<OccupationPage soc="12-3456" client={stubClient} />);
    await act(async () => stubClient.capturedObserver.onSuccess(occupationDetail));

    const jobOpenings = subject.queryAllByTestId("jobOpenings");
    expect(jobOpenings).toHaveLength(0);
  });
});
