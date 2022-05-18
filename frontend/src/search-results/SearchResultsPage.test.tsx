import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { buildTrainingResult } from "../test-objects/factories";
import { SearchResultsPage } from "./SearchResultsPage";
import { navigate } from "@reach/router";
import { StubClient } from "../test-objects/StubClient";
import { CalendarLength } from "../domain/Training";
import { useMediaQuery } from "@material-ui/core";
import { Error } from "../domain/Error";
import { en as Content } from "../locales/en";

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

const { searchBarDefaultPlaceholderText } = Content.SearchAndFilter;

const { inDemandTag, percentEmployedUnavailable } = Content.SearchResultsPage;

describe("<SearchResultsPage />", () => {
  let stubClient: StubClient;

  beforeEach(() => {
    stubClient = new StubClient();
  });

  describe("when handling initial pageload search", () => {
    it("uses the url parameter in the search bar input", () => {
      const subject = render(<SearchResultsPage client={stubClient} searchQuery={"octopods"} />);
      expect(
        subject.getByPlaceholderText(Content.SearchAndFilter.searchBarDefaultPlaceholderText)
      ).toHaveValue("octopods");
    });

    it("cleans the url parameter of uri encoding for search bar input", () => {
      const subject = render(
        <SearchResultsPage client={stubClient} searchQuery={"octopods%2Foctopi"} />
      );
      expect(
        subject.getByPlaceholderText(Content.SearchAndFilter.searchBarDefaultPlaceholderText)
      ).toHaveValue("octopods/octopi");
    });

    it("uses the url parameter to execute a search", () => {
      render(<SearchResultsPage client={stubClient} searchQuery="octopods" />);
      expect(stubClient.capturedQuery).toEqual("octopods");
    });

    it("executes an empty search and displays starting instructions when parameter does not exist", () => {
      const subject = render(<SearchResultsPage client={stubClient} searchQuery={undefined} />);
      expect(stubClient.capturedQuery).toEqual("");
      expect(subject.getByTestId("gettingStarted")).toBeInTheDocument();
    });

    it("displays error page when search fails", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);

      act(() => stubClient.capturedObserver.onError(Error.SYSTEM_ERROR));

      expect(subject.queryByText(Content.ErrorPage.somethingWentWrongHeader)).toBeInTheDocument();
    });
  });

  describe("when displaying data", () => {
    it("displays list of training names and their data", async () => {
      useTabletSize();

      const subject = render(<SearchResultsPage client={stubClient} />);

      const training1 = buildTrainingResult({
        name: "training1",
        totalCost: 1000,
        percentEmployed: 0.6018342,
        calendarLength: CalendarLength.FOUR_TO_ELEVEN_WEEKS,
        city: "Camden",
        county: "Camden County",
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
        county: "Essex County",
        providerName: "New'rk School",
        highlight: "",
        online: false,
      });

      act(() => stubClient.capturedObserver.onSuccess([training1, training2]));

      expect(subject.getByText("training1", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("$1,000.00", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("60.1%", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("Camden", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("Camden County", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("Cammy Community College", { exact: false })).toBeInTheDocument();
      expect(
        subject.getByText(Content.CalendarLengthLookup["5"] + " to complete", { exact: false })
      ).toBeInTheDocument();
      expect(subject.getByText('"...', { exact: false }).parentElement?.innerHTML).toEqual(
        '<span>"...</span><span>some </span><b>text</b><span> here</span><span>..."</span>'
      );

      expect(subject.getByText("training2", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("$333.33", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("80.0%", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("Newark", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("Essex County", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("New'rk School", { exact: false })).toBeInTheDocument();
      expect(
        subject.getByText(Content.CalendarLengthLookup["1"] + " to complete", { exact: false })
      ).toBeInTheDocument();
    });

    it("displays online instead of city/county when training is online", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);

      const training = buildTrainingResult({
        city: "Camden",
        county: "My Cool County",
        online: true,
      });

      act(() => stubClient.capturedObserver.onSuccess([training]));

      expect(subject.getByText("Online Class", { exact: false })).toBeInTheDocument();
      expect(subject.queryByText("Camden", { exact: false })).not.toBeInTheDocument();
      expect(subject.queryByText("My Cool County", { exact: false })).not.toBeInTheDocument();
    });

    it("displays an in-demand tag when a training is in-demand", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      const inDemand = buildTrainingResult({ name: "in-demand", inDemand: true });
      act(() => stubClient.capturedObserver.onSuccess([inDemand]));

      expect(subject.queryByText(inDemandTag)).toBeInTheDocument();
    });

    it("does not display an in-demand tag when a training is not in-demand", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      const notInDemand = buildTrainingResult({ name: "not-in-demand", inDemand: false });
      act(() => stubClient.capturedObserver.onSuccess([notInDemand]));

      expect(subject.queryByText(inDemandTag)).not.toBeInTheDocument();
    });

    it("displays percent employed as '--' when it is null", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);

      act(() =>
        stubClient.capturedObserver.onSuccess([buildTrainingResult({ percentEmployed: null })])
      );

      expect(subject.getByText(percentEmployedUnavailable, { exact: false })).toBeInTheDocument();
    });

    it("displays calendar length as '--' when it is null", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);

      act(() =>
        stubClient.capturedObserver.onSuccess([
          buildTrainingResult({ calendarLength: CalendarLength.NULL }),
        ])
      );

      expect(
        subject.getByText(Content.CalendarLengthLookup["0"], { exact: false })
      ).toBeInTheDocument();
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

    it("displays does not display, shows getting started message when undefined", () => {
      const subject = render(<SearchResultsPage client={stubClient} searchQuery={undefined} />);

      act(() => stubClient.capturedObserver.onSuccess([]));

      expect(
        subject.queryByText('0 results found for ""', { exact: false })
      ).not.toBeInTheDocument();
      expect(subject.getByText("Getting Started", { exact: false })).toBeInTheDocument();
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

  describe("when displaying search tips", () => {
    it("displays search tips when less than 5 training results", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);

      const training1 = buildTrainingResult({
        name: "training1",
        totalCost: 1000,
        percentEmployed: 0.6018342,
        calendarLength: CalendarLength.FOUR_TO_ELEVEN_WEEKS,
        city: "Camden",
        county: "Camden County",
        providerName: "Cammy Community College",
        highlight: "some [[text]] here",
        online: false,
      });

      act(() => stubClient.capturedObserver.onSuccess([training1]));

      expect(subject.getByTestId("searchTips")).toBeInTheDocument();
    });

    it("displays search tips when greater than 5 training results", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      const trainings = new Array(51);

      for (let i = 0; i < trainings.length; i++) {
        trainings[i] = buildTrainingResult({
          name: "training" + i,
        });
      }

      act(() => stubClient.capturedObserver.onSuccess(trainings));

      expect(subject.queryByTestId("searchTips")).not.toBeInTheDocument();
    });

    it("does not display search tips when exactly 5 training results", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      const trainings = new Array(5);

      for (let i = 0; i < trainings.length; i++) {
        trainings[i] = buildTrainingResult({
          name: "training" + i,
        });
      }

      act(() => stubClient.capturedObserver.onSuccess(trainings));

      expect(subject.queryByTestId("searchTips")).not.toBeInTheDocument();
    });

    it("does not display search tips when exactly 50 training results", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      const trainings = new Array(50);

      for (let i = 0; i < trainings.length; i++) {
        trainings[i] = buildTrainingResult({
          name: "training" + i,
        });
      }

      act(() => stubClient.capturedObserver.onSuccess(trainings));

      expect(subject.queryByTestId("searchTips")).not.toBeInTheDocument();
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

      fireEvent.change(subject.getAllByPlaceholderText(searchBarDefaultPlaceholderText)[0], {
        target: { value: "penguins" },
      });
      fireEvent.click(subject.getAllByText("Search")[0]);

      expect(subject.queryByText("some name")).not.toBeInTheDocument();
      expect(subject.queryByRole("progressbar")).toBeInTheDocument();
      expect(navigate).toHaveBeenCalledWith("/search/penguins");
    });

    it("does not navigate to new page when search query is the same", () => {
      useMobileSize();
      const subject = render(<SearchResultsPage client={stubClient} searchQuery={"penguins"} />);
      act(() =>
        stubClient.capturedObserver.onSuccess([buildTrainingResult({ name: "some name" })])
      );
      expect(subject.queryByText("some name")).toBeInTheDocument();
      expect(subject.queryByRole("progressbar")).not.toBeInTheDocument();

      fireEvent.change(subject.getByPlaceholderText(searchBarDefaultPlaceholderText), {
        target: { value: "penguins" },
      });
      fireEvent.click(subject.getByText("Edit Search or Filter"));

      expect(subject.queryByText("some name")).toBeInTheDocument();
      expect(subject.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(navigate).not.toHaveBeenCalled();
    });

    it("encodes uri components in search query", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      fireEvent.change(subject.getAllByPlaceholderText(searchBarDefaultPlaceholderText)[0], {
        target: { value: "penguins / penglings" },
      });
      fireEvent.click(subject.getAllByText("Search")[0]);
      expect(navigate).toHaveBeenCalledWith("/search/penguins%20%2F%20penglings");
    });
  });

  const useMobileSize = (): void => {
    (useMediaQuery as jest.Mock).mockImplementation(() => false);
  };

  const useTabletSize = (): void => {
    (useMediaQuery as jest.Mock).mockImplementation(() => true);
  };
});
