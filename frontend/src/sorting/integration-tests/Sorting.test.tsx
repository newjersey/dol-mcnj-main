import { renderWithRouter, waitForEffect } from "../../test-objects/helpers";
import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { fireEvent, RenderResult } from "@testing-library/react";
import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { SortOrder } from "../SortOrder";
import { en as Content } from "../../locales/en";

const { sortByLabel } = Content.SearchAndFilterStrings;

describe("sorting", () => {
  let stubClient: StubClient;
  let subject: RenderResult;

  beforeEach(async () => {
    stubClient = new StubClient();
    const { container, history } = renderWithRouter(<App client={stubClient} />);
    subject = container;

    await history.navigate("/search/some-query");
    await waitForEffect();
  });

  it("defaults to best match sort", () => {
    const training1 = buildTrainingResult({ name: "training1", rank: 10 });
    const training2 = buildTrainingResult({ name: "training2", rank: 2 });
    const training3 = buildTrainingResult({ name: "training3", rank: 5 });

    act(() => stubClient.capturedObserver.onSuccess([training1, training2, training3]));

    const cards = subject.getAllByTestId("card");
    expect(cards[0].textContent).toContain("training1");
    expect(cards[1].textContent).toContain("training3");
    expect(cards[2].textContent).toContain("training2");
  });

  it("sorts by cost low to high", () => {
    const training1 = buildTrainingResult({ name: "training1", totalCost: 300 });
    const training2 = buildTrainingResult({ name: "training2", totalCost: 100 });
    const training3 = buildTrainingResult({ name: "training3", totalCost: 200 });

    act(() => stubClient.capturedObserver.onSuccess([training1, training2, training3]));

    fireEvent.change(subject.getByLabelText(sortByLabel), {
      target: { value: SortOrder.COST_LOW_TO_HIGH },
    });

    const cards = subject.getAllByTestId("card");
    expect(cards[0].textContent).toContain("training2");
    expect(cards[1].textContent).toContain("training3");
    expect(cards[2].textContent).toContain("training1");
  });

  it("sorts by cost high to low", () => {
    const training1 = buildTrainingResult({ name: "training1", totalCost: 300 });
    const training2 = buildTrainingResult({ name: "training2", totalCost: 100 });
    const training3 = buildTrainingResult({ name: "training3", totalCost: 200 });

    act(() => stubClient.capturedObserver.onSuccess([training1, training2, training3]));

    fireEvent.change(subject.getByLabelText(sortByLabel), {
      target: { value: SortOrder.COST_HIGH_TO_LOW },
    });

    const cards = subject.getAllByTestId("card");
    expect(cards[0].textContent).toContain("training1");
    expect(cards[1].textContent).toContain("training3");
    expect(cards[2].textContent).toContain("training2");
  });

  it("sorts by rank as best match", () => {
    const training1 = buildTrainingResult({ name: "training1", rank: 2 });
    const training2 = buildTrainingResult({ name: "training2", rank: 1 });
    const training3 = buildTrainingResult({ name: "training3", rank: 3 });

    act(() => stubClient.capturedObserver.onSuccess([training1, training2, training3]));

    fireEvent.change(subject.getByLabelText(sortByLabel), {
      target: { value: SortOrder.COST_HIGH_TO_LOW },
    });
    fireEvent.change(subject.getByLabelText(sortByLabel), {
      target: { value: SortOrder.BEST_MATCH },
    });

    const cards = subject.getAllByTestId("card");
    expect(cards[0].textContent).toContain("training3");
    expect(cards[1].textContent).toContain("training1");
    expect(cards[2].textContent).toContain("training2");
  });

  it("sorts by employment rate (high to low)", () => {
    const training1 = buildTrainingResult({ name: "training1", percentEmployed: 50 });
    const training2 = buildTrainingResult({ name: "training2", percentEmployed: null });
    const training3 = buildTrainingResult({ name: "training3", percentEmployed: 99 });

    act(() => stubClient.capturedObserver.onSuccess([training1, training2, training3]));

    fireEvent.change(subject.getByLabelText(sortByLabel), {
      target: { value: SortOrder.EMPLOYMENT_RATE },
    });

    const cards = subject.getAllByTestId("card");
    expect(cards[0].textContent).toContain("training3");
    expect(cards[1].textContent).toContain("training1");
    expect(cards[2].textContent).toContain("training2");
  });
});
