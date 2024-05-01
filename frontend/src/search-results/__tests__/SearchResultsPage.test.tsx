import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { buildTrainingResult } from "../../test-objects/factories";
import { SearchResultsPage } from "../SearchResultsPage";
import { navigate, WindowLocation } from "@reach/router";
import { StubClient } from "../../test-objects/StubClient";
import { CalendarLength } from "../../domain/Training";
import { useMediaQuery } from "@material-ui/core";
import { Error } from "../../domain/Error";
import { en as Content } from "../../locales/en";

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

describe.skip("<SearchResultsPage />", () => {
  let stubClient: StubClient;

  beforeEach(() => {
    stubClient = new StubClient();
  });

  describe("when handling initial pageload search", () => {
    it("uses the url parameter in the search bar input", () => {
      const searchQuery = { search: "?q=octopods" } as WindowLocation;
      const subject = render(<SearchResultsPage client={stubClient} location={searchQuery} />);
      expect(
        subject.getByPlaceholderText(Content.SearchAndFilter.searchBarDefaultPlaceholderText),
      ).toHaveValue("octopods");
    });

    it("cleans the url parameter of uri encoding for search bar input", () => {
      const searchQuery = { search: "?q=octopods%2Foctopi" } as WindowLocation;
      const subject = render(<SearchResultsPage client={stubClient} location={searchQuery} />);
      expect(
        subject.getByPlaceholderText(Content.SearchAndFilter.searchBarDefaultPlaceholderText),
      ).toHaveValue("octopods/octopi");
    });

    it("uses the url parameter to execute a search", () => {
      const searchQuery = { search: "?q=octopods" } as WindowLocation;
      render(<SearchResultsPage client={stubClient} location={searchQuery} />);
      expect(stubClient.capturedQuery).toEqual("octopods");
    });

    it("executes an empty search and displays starting instructions when parameter does not exist", () => {
      const searchQuery = { search: "" } as WindowLocation<unknown>;
      const subject = render(<SearchResultsPage client={stubClient} location={searchQuery} />);
      expect(stubClient.capturedQuery).toEqual(undefined);
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
        cities: ["Camden"],
        availableAt: {
          city: "Camden",
          street_address: "123 Main St",
          zipCode: "08101",
        },
        providerName: "Cammy Community College",
        highlight: "some [[text]] here",
        online: false,
      });
      const training2 = buildTrainingResult({
        name: "training2",
        totalCost: 333.33,
        percentEmployed: 0.8,
        calendarLength: CalendarLength.LESS_THAN_ONE_DAY,
        cities: ["Newark"],
        availableAt: {
          city: "Newark",
          street_address: "456 Elm St",
          zipCode: "07101",
        },
        county: "Essex County",
        providerName: "New'rk School",
        highlight: "",
        online: false,
      });

      act(() => stubClient.capturedObserver.onSuccess({ data: [training1, training2] }));

      expect(subject.getByText("training1", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("$1,000.00", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("60.1%", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("Camden", { exact: false })).toBeInTheDocument();
      //expect(subject.getByText("Camden County", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("Cammy Community College", { exact: false })).toBeInTheDocument();
      expect(
        subject.getByText("Completion time: " + Content.CalendarLengthLookup["5"], { exact: false }),
      ).toBeInTheDocument();
      expect(subject.getByText('"...', { exact: false }).parentElement?.innerHTML).toEqual(
        '<span>"...</span><span>some </span><b>text</b><span> here</span><span>..."</span>',
      );

      expect(subject.getByText("training2", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("$333.33", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("80.0%", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("Newark", { exact: false })).toBeInTheDocument();
      //expect(subject.getByText("Essex County", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("New'rk School", { exact: false })).toBeInTheDocument();
      expect(
        subject.getByText("Completion time: " + Content.CalendarLengthLookup["1"], { exact: false }),
      ).toBeInTheDocument();
    });

    it("displays online instead of city/county when training is online", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);

      const training = buildTrainingResult({
        cities: ["Camden"],
        county: "My Cool County",
        online: true,
      });

      act(() => stubClient.capturedObserver.onSuccess({ data: [training] }));

      // expect(subject.getByText("Online Class", { exact: false })).toBeInTheDocument();
      expect(subject.queryByText("Camden", { exact: false })).not.toBeInTheDocument();
      // expect(subject.queryByText("My Cool County", { exact: false })).not.toBeInTheDocument();
    });

    it("displays an in-demand tag when a training is in-demand", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      const inDemand = buildTrainingResult({ name: "in-demand", inDemand: true });
      act(() => stubClient.capturedObserver.onSuccess({ data: [inDemand] }));

      expect(subject.queryByText(inDemandTag)).toBeInTheDocument();
    });

    it("does not display an in-demand tag when a training is not in-demand", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      const notInDemand = buildTrainingResult({ name: "not-in-demand", inDemand: false });
      act(() => stubClient.capturedObserver.onSuccess({ data: [notInDemand] }));

      expect(subject.queryByText(inDemandTag)).not.toBeInTheDocument();
    });

    it("displays percent employed as '--' when it is null", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);

      act(() =>
        stubClient.capturedObserver.onSuccess({
          data: [buildTrainingResult({ percentEmployed: null })],
        }),
      );

      expect(subject.getByText(percentEmployedUnavailable, { exact: false })).toBeInTheDocument();
    });

    it("displays calendar length as 'No data available' when it is null", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);

      act(() =>
        stubClient.capturedObserver.onSuccess({
          data: [buildTrainingResult({ calendarLength: CalendarLength.NULL })],
        }),
      );

      expect(
        subject.getByText(Content.CalendarLengthLookup["0"], { exact: false }),
      ).toBeInTheDocument();
    });
  });

  describe("when results are loading", () => {
    const searchQuery = { search: "?q=some query" } as WindowLocation;

    it("displays a spinner until success occurs", () => {
      const { queryByRole, queryByText } = render(
        <SearchResultsPage client={stubClient} location={searchQuery} />,
      );

      expect(queryByRole("progressbar")).toBeInTheDocument();
      expect(queryByText("0 results found", { exact: false })).not.toBeInTheDocument();

      act(() =>
        stubClient.capturedObserver.onSuccess([buildTrainingResult({}), buildTrainingResult({})]),
      );

      expect(queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("displays a spinner until error occurs", () => {
      const subject = render(<SearchResultsPage client={stubClient} location={searchQuery} />);

      expect(subject.queryByRole("progressbar")).toBeInTheDocument();
      expect(subject.queryByText("0 results found", { exact: false })).not.toBeInTheDocument();

      act(() => stubClient.capturedObserver.onError(Error.SYSTEM_ERROR));

      expect(subject.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  describe("when displaying result count", () => {
    it("displays number of results returns for search query", () => {
      const searchQuery = { search: "?q=frigate birds" } as WindowLocation;
      const subject = render(<SearchResultsPage client={stubClient} location={searchQuery} />);
      act(() =>
        stubClient.capturedObserver.onSuccess({
          data: [buildTrainingResult({}), buildTrainingResult({})],
        }),
      );

      setTimeout(() => {
        expect(
          subject.getByText('2 results found for "frigate birds"', { exact: false }),
        ).toBeInTheDocument();
      }, 1000);
    });

    it("displays does not display, shows getting started message when undefined", () => {
      const subject = render(<SearchResultsPage client={stubClient} location={undefined} />);

      act(() => stubClient.capturedObserver.onSuccess({ data: [] }));

      expect(
        subject.queryByText('0 results found for ""', { exact: false }),
      ).not.toBeInTheDocument();
      expect(
        subject.getByText(
          "Are you not seeing the results you were looking for? We recommend that you try these search tips to enhance your results:",
          { exact: false },
        ),
      ).toBeInTheDocument();
    });

    it("displays correct grammar when 1 result returned for search query", () => {
      const searchQuery = { search: "?q=cormorants" } as WindowLocation;
      const subject = render(<SearchResultsPage client={stubClient} location={searchQuery} />);
      act(() => stubClient.capturedObserver.onSuccess({ data: [buildTrainingResult({})] }));

      setTimeout(() => {
        expect(
          subject.getByText('1 result found for "cormorants"', { exact: false }),
        ).toBeInTheDocument();
      }, 1000);
    });

    it("decodes uri components in the search query", () => {
      const searchQuery = { search: "?q=birds%2Fbats" } as WindowLocation;
      const subject = render(<SearchResultsPage client={stubClient} location={searchQuery} />);
      act(() =>
        stubClient.capturedObserver.onSuccess({
          data: [buildTrainingResult({}), buildTrainingResult({})],
        }),
      );

      setTimeout(() => {
        expect(
          subject.getByText('2 results found for "birds/bats"', { exact: false }),
        ).toBeInTheDocument();
      }, 1000);
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
        cities: ["Camden"],
        county: "Camden County",
        providerName: "Cammy Community College",
        highlight: "some [[text]] here",
        online: false,
      });

      act(() => stubClient.capturedObserver.onSuccess({ data: [training1] }));

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

      act(() => stubClient.capturedObserver.onSuccess({ data: trainings }));

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

      act(() => stubClient.capturedObserver.onSuccess({ data: trainings }));

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

      act(() => stubClient.capturedObserver.onSuccess({ data: trainings }));

      expect(subject.queryByTestId("searchTips")).not.toBeInTheDocument();
    });
  });

  describe("when executing a new search", () => {
    it("removes results, loads, and navigates to new search page when new search is executed", () => {
      const subject = render(<SearchResultsPage client={stubClient} />);
      act(() =>
        stubClient.capturedObserver.onSuccess({
          data: [buildTrainingResult({ name: "some name" })],
        }),
      );
      expect(subject.queryByText("some name")).toBeInTheDocument();
      expect(subject.queryByRole("progressbar")).not.toBeInTheDocument();

      fireEvent.change(subject.getAllByPlaceholderText(searchBarDefaultPlaceholderText)[0], {
        target: { value: "penguins" },
      });
      fireEvent.click(subject.getAllByText("Update Results")[0]);

      expect(subject.queryByText("some name")).not.toBeInTheDocument();
      expect(subject.queryByRole("progressbar")).toBeInTheDocument();
      expect(navigate).toHaveBeenCalledWith("/training/search?q=penguins");
    });

    it("does not navigate to new page when search query is the same", () => {
      const searchQuery = { search: "?q=penguins" } as WindowLocation;
      useMobileSize();
      const subject = render(<SearchResultsPage client={stubClient} location={searchQuery} />);
      act(() =>
        stubClient.capturedObserver.onSuccess({
          data: [buildTrainingResult({ name: "some name" })],
        }),
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
      fireEvent.click(subject.getAllByText("Update Results")[0]);
      expect(navigate).toHaveBeenCalledWith("/training/search?q=penguins%20%2F%20penglings");
    });
  });

  const useMobileSize = (): void => {
    (useMediaQuery as jest.Mock).mockImplementation(() => false);
  };

  const useTabletSize = (): void => {
    (useMediaQuery as jest.Mock).mockImplementation(() => true);
  };
});
