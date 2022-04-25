import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { fireEvent, RenderResult } from "@testing-library/react";
import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { waitForEffect, renderWithRouter } from "../../test-objects/helpers";
import { SearchAndFilterStrings } from "../../localizations/SearchAndFilterStrings";

describe("filtering by online or in-person", () => {
  const online = buildTrainingResult({ name: "online training", online: true });
  const inPerson = buildTrainingResult({ name: "in-person training", online: false });

  let stubClient: StubClient;
  let subject: RenderResult;

  beforeEach(async () => {
    jest.setTimeout(10000);

    stubClient = new StubClient();
    const { container, history } = renderWithRouter(<App client={stubClient} />);
    subject = container;

    await history.navigate("/search/some-query");
    await waitForEffect();

    act(() => {
      stubClient.capturedObserver.onSuccess([online, inPerson]);
    });

    expect(subject.getByText("online training")).toBeInTheDocument();
    expect(subject.getByText("in-person training")).toBeInTheDocument();
  });

  it("filters by online", () => {
    fireEvent.click(subject.getByLabelText("Online"));

    expect(subject.queryByText("online training")).toBeInTheDocument();
    expect(subject.queryByText("in-person training"));
  });

  it("filters by in-person", () => {
    fireEvent.click(subject.getByLabelText("In-Person"));

    expect(subject.queryByText("online training")).not.toBeInTheDocument();
    expect(subject.queryByText("in-person training")).toBeInTheDocument();
  });

  it("does not filter when all or none are checked", async () => {
    fireEvent.click(subject.getByLabelText("Online"));
    fireEvent.click(subject.getByLabelText("In-Person"));

    expect(subject.getByText("online training")).toBeInTheDocument();
    expect(subject.getByText("in-person training")).toBeInTheDocument();

    fireEvent.click(subject.getByLabelText("Online"));
    fireEvent.click(subject.getByLabelText("In-Person"));

    expect(subject.getByText("online training")).toBeInTheDocument();
    expect(subject.getByText("in-person training")).toBeInTheDocument();
  });

  it("removes filter when clear button is clicked", async () => {
    fireEvent.click(subject.getByLabelText("In-Person"));
    expect(subject.getByLabelText("In-Person")).toBeChecked();

    fireEvent.click(subject.getByText(SearchAndFilterStrings.clearAllFiltersButtonLabel));

    await waitForEffect();

    expect(subject.getByLabelText("In-Person")).not.toBeChecked();
    expect(subject.queryByText("online training")).toBeInTheDocument();
    expect(subject.queryByText("in-person training")).toBeInTheDocument();
  });
});
