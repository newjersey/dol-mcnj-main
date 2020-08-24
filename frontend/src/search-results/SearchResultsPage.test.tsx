import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { buildTrainingResult } from "../test-objects/factories";
import { SearchResultsPage, SortOrder } from "./SearchResultsPage";
import { navigate } from "@reach/router";
import { StubClient } from "../test-objects/StubClient";
import { CalendarLength } from "../domain/Training";
import { useMediaQuery } from "@material-ui/core";
import { Error } from "../domain/Error";

/* eslint-disable @typescript-eslint/explicit-function-return-type */
function mockReachRouter() {
  const original = jest.requireActual("@reach/router");
  return {
    ...original,
    navigate: jest.fn(),
  };
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
function mockMaterialUI() {
  const original = jest.requireActual("@material-ui/core");
  return {
    ...original,
    useMediaQuery: jest.fn(),
  };
}

jest.mock("@material-ui/core", () => mockMaterialUI());
jest.mock("@reach/router", () => mockReachRouter());

describe("<SearchResultsPage />", () => {
  let stubClient: StubClient;

  beforeEach(() => {
    stubClient = new StubClient();
  });

  describe("when handling initial pageload search", () => {
    it("uses the url parameter in the search bar input", () => {
      const subject = render(<SearchResultsPage client={stubClient} searchQuery={"octopods"} />);
      expect(subject.getByPlaceholderText("Search for training courses")).toHaveValue("octopods");
    });

    it("cleans the url parameter of uri encoding for search bar input", () => {
      const subject = render(
        <SearchResultsPage client={stubClient} searchQuery={"octopods%2Foctopi"} />
      );
      expect(subject.getByPlaceholderText("Search for training courses")).toHaveValue(
        "octopods/octopi"
      );
    });

    it("uses the url parameter to execute a search", () => {
      render(<SearchResultsPage client={stubClient} searchQuery="octopods" />);
      expect(stubClient.capturedQuery).toEqual("octopods");
    });

    it("executes an empty search when parameter does not exist", () => {
      render(<SearchResultsPage client={stubClient} searchQuery={undefined} />);
      expect(stubClient.capturedQuery).toEqual("");
    });

    it("displays error page when search fails", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);

      act(() => stubClient.capturedObserver.onError(Error.SYSTEM_ERROR));

      expect(subject.queryByText("Sorry, something went wrong")).toBeInTheDocument();
    });
  });

  describe("when displaying data", () => {
    it("displays list of training names and their data", async () => {
      const subject = render(<SearchResultsPage client={stubClient} />);

      const training1 = buildTrainingResult({
        name: "training1",
        totalCost: 1000,
        percentEmployed: 0.6018342,
        calendarLength: CalendarLength.FOUR_TO_ELEVEN_WEEKS,
        city: "Camden",
        providerName: "Cammy Community College",
        highlight: "some [[text]] here",
        online: false,
      });
      const training2 = buildTrainingResult({
        name: "training2",
        totalCost: 333.33,
        percentEmployed: 0.8,
        calendarLength: CalendarLength.LESS_THAN_ONE_DAY,
        city: "Newark",
        providerName: "New'rk School",
        highlight: "",
        online: false,
      });

      act(() => stubClient.capturedObserver.onSuccess([training1, training2]));

      expect(subject.getByText("training1", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("$1,000.00", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("60.1%", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("Camden", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("Cammy Community College", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("4-11 weeks to complete", { exact: false })).toBeInTheDocument();
      expect(subject.getByText('"...', { exact: false }).parentElement?.innerHTML).toEqual(
        '<span>"...</span><span>some </span><b>text</b><span> here</span><span>..."</span>'
      );

      expect(subject.getByText("training2", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("$333.33", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("80.0%", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("Newark", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("New'rk School", { exact: false })).toBeInTheDocument();
      expect(
        subject.getByText("Less than 1 day to complete", { exact: false })
      ).toBeInTheDocument();
    });

    it("displays online instead of location when training is online", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);

      const training = buildTrainingResult({
        city: "Camden",
        online: true,
      });

      act(() => stubClient.capturedObserver.onSuccess([training]));

      expect(subject.getByText("Online Class", { exact: false })).toBeInTheDocument();
      expect(subject.queryByText("Camden", { exact: false })).not.toBeInTheDocument();
    });

    it("displays an in-demand tag when a training is in-demand", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      const inDemand = buildTrainingResult({ name: "in-demand", inDemand: true });
      act(() => stubClient.capturedObserver.onSuccess([inDemand]));

      expect(subject.queryByText("In Demand")).toBeInTheDocument();
    });

    it("does not display an in-demand tag when a training is not in-demand", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      const notInDemand = buildTrainingResult({ name: "not-in-demand", inDemand: false });
      act(() => stubClient.capturedObserver.onSuccess([notInDemand]));

      expect(subject.queryByText("In Demand")).not.toBeInTheDocument();
    });

    it("displays county waiver tags when a training has a local exception", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      const trainingResult = buildTrainingResult({
        localExceptionCounty: ["Atlantic", "Middlesex"],
      });
      act(() => stubClient.capturedObserver.onSuccess([trainingResult]));

      expect(subject.queryByText("Waiver for Atlantic County")).toBeInTheDocument();
      expect(subject.queryByText("Waiver for Middlesex County")).toBeInTheDocument();
    });

    it("does not display a county waiver tag when a training has empty local exception", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      const trainingResult = buildTrainingResult({ localExceptionCounty: [] });
      act(() => stubClient.capturedObserver.onSuccess([trainingResult]));

      expect(subject.queryByText("Waiver for", { exact: false })).not.toBeInTheDocument();
    });

    it("displays percent employed as '--' when it is null", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);

      act(() =>
        stubClient.capturedObserver.onSuccess([buildTrainingResult({ percentEmployed: null })])
      );

      expect(subject.getByText("--", { exact: false })).toBeInTheDocument();
    });

    it("displays calendar length as '--' when it is null", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);

      act(() =>
        stubClient.capturedObserver.onSuccess([
          buildTrainingResult({ calendarLength: CalendarLength.NULL }),
        ])
      );

      expect(subject.getByText("--", { exact: false })).toBeInTheDocument();
    });
  });

  describe("when results are loading", () => {
    it("displays a spinner until success occurs", () => {
      const subject = render(<SearchResultsPage client={stubClient} searchQuery={"some query"} />);

      expect(subject.queryByRole("progressbar")).toBeInTheDocument();
      expect(subject.queryByText("0 results found", { exact: false })).not.toBeInTheDocument();

      act(() =>
        stubClient.capturedObserver.onSuccess([buildTrainingResult({}), buildTrainingResult({})])
      );

      expect(subject.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("displays a spinner until error occurs", () => {
      const subject = render(<SearchResultsPage client={stubClient} searchQuery={"some query"} />);

      expect(subject.queryByRole("progressbar")).toBeInTheDocument();
      expect(subject.queryByText("0 results found", { exact: false })).not.toBeInTheDocument();

      act(() => stubClient.capturedObserver.onError(Error.SYSTEM_ERROR));

      expect(subject.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  describe("when displaying result count", () => {
    it("displays number of results returns for search query", () => {
      const subject = render(
        <SearchResultsPage client={stubClient} searchQuery={"frigate birds"} />
      );
      act(() =>
        stubClient.capturedObserver.onSuccess([buildTrainingResult({}), buildTrainingResult({})])
      );

      expect(
        subject.getByText('2 results found for "frigate birds"', { exact: false })
      ).toBeInTheDocument();
    });

    it("displays empty string for search query when undefined", () => {
      const subject = render(<SearchResultsPage client={stubClient} searchQuery={undefined} />);

      act(() => stubClient.capturedObserver.onSuccess([]));

      expect(subject.getByText('0 results found for ""', { exact: false })).toBeInTheDocument();
    });

    it("displays correct grammar when 1 result returned for search query", () => {
      const subject = render(<SearchResultsPage client={stubClient} searchQuery={"cormorants"} />);
      act(() => stubClient.capturedObserver.onSuccess([buildTrainingResult({})]));

      expect(
        subject.getByText('1 result found for "cormorants"', { exact: false })
      ).toBeInTheDocument();
    });

    it("decodes uri components in the search query", () => {
      const subject = render(
        <SearchResultsPage client={stubClient} searchQuery={"birds%2Fbats"} />
      );
      act(() =>
        stubClient.capturedObserver.onSuccess([buildTrainingResult({}), buildTrainingResult({})])
      );

      expect(
        subject.getByText('2 results found for "birds/bats"', { exact: false })
      ).toBeInTheDocument();
    });
  });

  describe("when executing a new search", () => {
    it("removes results, loads, and navigates to new search page when new search is executed", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      act(() =>
        stubClient.capturedObserver.onSuccess([buildTrainingResult({ name: "some name" })])
      );
      expect(subject.queryByText("some name")).toBeInTheDocument();
      expect(subject.queryByRole("progressbar")).not.toBeInTheDocument();

      fireEvent.change(subject.getByPlaceholderText("Search for training courses"), {
        target: { value: "penguins" },
      });
      fireEvent.click(subject.getByText("Search"));

      expect(subject.queryByText("some name")).not.toBeInTheDocument();
      expect(subject.queryByRole("progressbar")).toBeInTheDocument();
      expect(navigate).toHaveBeenCalledWith("/search/penguins");
    });

    it("does not navigate to new page when search query is the same", () => {
      const subject = render(<SearchResultsPage client={stubClient} searchQuery={"penguins"} />);
      act(() =>
        stubClient.capturedObserver.onSuccess([buildTrainingResult({ name: "some name" })])
      );
      expect(subject.queryByText("some name")).toBeInTheDocument();
      expect(subject.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(navigate).toBeCalledTimes(1);

      fireEvent.change(subject.getByPlaceholderText("Search for training courses"), {
        target: { value: "penguins" },
      });
      fireEvent.click(subject.getByText("Search"));

      expect(subject.queryByText("some name")).toBeInTheDocument();
      expect(subject.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(navigate).toBeCalledTimes(1);
    });

    it("encodes uri components in search query", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      fireEvent.change(subject.getByPlaceholderText("Search for training courses"), {
        target: { value: "penguins / penglings" },
      });
      fireEvent.click(subject.getByText("Search"));
      expect(navigate).toHaveBeenCalledWith("/search/penguins%20%2F%20penglings");
    });
  });

  describe("sorting", () => {
    it("defaults to sort order from backend", () => {
      const training1 = buildTrainingResult({ name: "training1" });
      const training2 = buildTrainingResult({ name: "training2" });
      const training3 = buildTrainingResult({ name: "training3" });

      const subject = render(<SearchResultsPage client={stubClient} />);

      act(() => stubClient.capturedObserver.onSuccess([training1, training2, training3]));

      const cards = subject.getAllByTestId("card");
      expect(cards[0].textContent).toContain("training1");
      expect(cards[1].textContent).toContain("training2");
      expect(cards[2].textContent).toContain("training3");
    });

    it("sorts by price low to high", () => {
      const training1 = buildTrainingResult({ name: "training1", totalCost: 300 });
      const training2 = buildTrainingResult({ name: "training2", totalCost: 100 });
      const training3 = buildTrainingResult({ name: "training3", totalCost: 200 });

      const subject = render(<SearchResultsPage client={stubClient} />);

      act(() => stubClient.capturedObserver.onSuccess([training1, training2, training3]));

      fireEvent.change(subject.getByLabelText("Sort by"), {
        target: { value: SortOrder.PRICE_LOW_TO_HIGH },
      });

      const cards = subject.getAllByTestId("card");
      expect(cards[0].textContent).toContain("training2");
      expect(cards[1].textContent).toContain("training3");
      expect(cards[2].textContent).toContain("training1");
    });

    it("sorts by price high to low", () => {
      const training1 = buildTrainingResult({ name: "training1", totalCost: 300 });
      const training2 = buildTrainingResult({ name: "training2", totalCost: 100 });
      const training3 = buildTrainingResult({ name: "training3", totalCost: 200 });

      const subject = render(<SearchResultsPage client={stubClient} />);

      act(() => stubClient.capturedObserver.onSuccess([training1, training2, training3]));

      fireEvent.change(subject.getByLabelText("Sort by"), {
        target: { value: SortOrder.PRICE_HIGH_TO_LOW },
      });

      const cards = subject.getAllByTestId("card");
      expect(cards[0].textContent).toContain("training1");
      expect(cards[1].textContent).toContain("training3");
      expect(cards[2].textContent).toContain("training2");
    });

    it("sorts by rank as relevance", () => {
      const training1 = buildTrainingResult({ name: "training1", rank: 2 });
      const training2 = buildTrainingResult({ name: "training2", rank: 1 });
      const training3 = buildTrainingResult({ name: "training3", rank: 3 });

      const subject = render(<SearchResultsPage client={stubClient} />);

      act(() => stubClient.capturedObserver.onSuccess([training1, training2, training3]));

      fireEvent.change(subject.getByLabelText("Sort by"), {
        target: { value: SortOrder.PRICE_HIGH_TO_LOW },
      });
      fireEvent.change(subject.getByLabelText("Sort by"), {
        target: { value: SortOrder.RELEVANCE },
      });

      const cards = subject.getAllByTestId("card");
      expect(cards[0].textContent).toContain("training3");
      expect(cards[1].textContent).toContain("training1");
      expect(cards[2].textContent).toContain("training2");
    });
  });

  it("[MOBILE] hides search results when filters are open", () => {
    useMobileSize();
    const subject = render(<SearchResultsPage client={stubClient} />);

    act(() =>
      stubClient.capturedObserver.onSuccess([buildTrainingResult({ name: "my cool training" })])
    );

    expect(subject.queryByText("my cool training")).toBeInTheDocument();
    fireEvent.click(subject.getByText("Filters"));
    expect(subject.queryByText("my cool training")).not.toBeInTheDocument();
  });

  const useMobileSize = (): void => {
    (useMediaQuery as jest.Mock).mockImplementation(() => false);
  };
});
