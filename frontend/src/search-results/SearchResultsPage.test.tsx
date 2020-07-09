import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { Client, Observer } from "../domain/Client";
import { act } from "react-dom/test-utils";
import { buildTraining, buildProvider } from "../test-helpers/factories";
import { Training } from "../domain/Training";
import { SearchResultsPage } from "./SearchResultsPage";
import { navigate } from "@reach/router";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
}));

describe("<SearchResultsPage />", () => {
  let stubClient: StubClient;

  beforeEach(() => {
    stubClient = new StubClient();
  });

  it("uses the url paramater in the search bar input", () => {
    const subject = render(<SearchResultsPage client={stubClient} searchQuery={"octopods"} />);
    expect(subject.getByPlaceholderText("Search for training courses")).toHaveValue("octopods");
  });

  it("uses the url parameter to execute a search", () => {
    render(<SearchResultsPage client={stubClient} searchQuery="octopods" />);
    expect(stubClient.capturedQuery).toEqual("octopods");
  });

  it("executes an empty search when parameter does not exist", () => {
    render(<SearchResultsPage client={stubClient} searchQuery={undefined} />);
    expect(stubClient.capturedQuery).toEqual("");
  });

  it("displays list of training names and their data", () => {
    const subject = render(<SearchResultsPage client={stubClient} />);

    const training1 = buildTraining({
      name: "training1",
      totalCost: 1000,
      percentEmployed: 0.6018342,
      provider: buildProvider({
        city: "Camden",
        name: "Cammy Community College",
      }),
    });
    const training2 = buildTraining({
      name: "training2",
      totalCost: 333.33,
      percentEmployed: 0.8,
      provider: buildProvider({
        city: "Newark",
        name: "New'rk School",
      }),
    });
    act(() => stubClient.capturedObserver.onSuccess([training1, training2]));

    expect(subject.getByText("training1", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("$1,000.00", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("60.1%", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("Camden", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("Cammy Community College", { exact: false })).toBeInTheDocument();

    expect(subject.getByText("training2", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("$333.33", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("80.0%", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("Newark", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("New'rk School", { exact: false })).toBeInTheDocument();
  });

  it("displays number of results returns for search query", () => {
    const subject = render(<SearchResultsPage client={stubClient} searchQuery={"frigate birds"} />);
    act(() => stubClient.capturedObserver.onSuccess([buildTraining({}), buildTraining({})]));

    expect(
      subject.getByText('2 results found for "frigate birds"', { exact: false })
    ).toBeInTheDocument();
  });

  it("displays correct grammar when 1 result returned for search query", () => {
    const subject = render(<SearchResultsPage client={stubClient} searchQuery={"cormorants"} />);
    act(() => stubClient.capturedObserver.onSuccess([buildTraining({})]));

    expect(
      subject.getByText('1 result found for "cormorants"', { exact: false })
    ).toBeInTheDocument();
  });

  it("displays percent employed as '--' when it is null", () => {
    const subject = render(<SearchResultsPage client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess([buildTraining({ percentEmployed: null })]));

    expect(subject.getByText("--", { exact: false })).toBeInTheDocument();
  });

  it("navigates to new search page when new search is executed", () => {
    const subject = render(<SearchResultsPage client={stubClient} />);
    fireEvent.change(subject.getByPlaceholderText("Search for training courses"), {
      target: { value: "penguins" },
    });
    fireEvent.click(subject.getByText("Search"));
    expect(navigate).toHaveBeenCalledWith("/search/penguins");
  });
});

class StubClient implements Client {
  capturedObserver: Observer<Training[]> = {
    onError: () => {},
    onSuccess: () => {},
  };

  capturedQuery: string | undefined = undefined;

  getTrainingsByQuery(query: string, observer: Observer<Training[]>): void {
    this.capturedObserver = observer;
    this.capturedQuery = query;
  }
}
