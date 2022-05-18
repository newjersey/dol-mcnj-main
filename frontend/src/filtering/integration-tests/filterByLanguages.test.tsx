import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { fireEvent, RenderResult } from "@testing-library/react";
import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { waitForEffect, renderWithRouter } from "../../test-objects/helpers";
import { en as Content } from "../../locales/en";

describe("filtering by languages", () => {
  const training1 = buildTrainingResult({
    name: "training1",
    languages: ["Chinese", "French"],
  });
  const training2 = buildTrainingResult({
    name: "training2",
    languages: ["Chinese"],
  });
  const training3 = buildTrainingResult({
    name: "training3",
    languages: ["Arabic", "Indic/Hindu"],
  });
  const training4 = buildTrainingResult({
    name: "training4",
    languages: [],
  });

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
      stubClient.capturedObserver.onSuccess([training1, training2, training3, training4]);
    });

    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.getByText("training2")).toBeInTheDocument();
    expect(subject.getByText("training3")).toBeInTheDocument();
    expect(subject.getByText("training4")).toBeInTheDocument();
  });

  it("filters by one language when clicking on checkbox", () => {
    fireEvent.click(subject.getByLabelText("Chinese"));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
  });

  it("filters by multiple languages when clicking on checkboxes", () => {
    fireEvent.click(subject.getByLabelText("Arabic"));

    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();

    fireEvent.click(subject.getByLabelText("French"));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
  });

  it("removes filter when checkbox is unchecked", async () => {
    fireEvent.click(subject.getByLabelText("Arabic"));

    expect(subject.getByLabelText("Arabic")).toBeChecked();

    fireEvent.click(subject.getByLabelText("Arabic"));

    expect(subject.getByLabelText("Arabic")).not.toBeChecked();
    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).toBeInTheDocument();
  });

  it("removes filter when clear all button is clicked", async () => {
    fireEvent.click(subject.getByLabelText("Chinese"));
    expect(subject.getByLabelText("Chinese")).toBeChecked();

    fireEvent.click(subject.getByText(Content.SearchAndFilter.clearAllFiltersButtonLabel));

    await waitForEffect();

    expect(subject.getByLabelText("Chinese")).not.toBeChecked();
    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).toBeInTheDocument();
  });

  it("shows full language list when show more button is clicked", async () => {
    expect(subject.queryByText("Hindi")).not.toBeInTheDocument();

    fireEvent.click(subject.getByTestId("toggle-language-list"));

    expect(subject.queryByText("Hindi")).toBeInTheDocument();
    fireEvent.click(subject.getByLabelText("Hindi"));

    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
  });

  it("hides full language list when show less button is clicked", async () => {
    fireEvent.click(subject.getByTestId("toggle-language-list"));
    expect(subject.queryByText("Hindi")).toBeInTheDocument();
    fireEvent.click(subject.getByTestId("toggle-language-list"));
    expect(subject.queryByText("Hindi")).not.toBeInTheDocument();
  });
});
