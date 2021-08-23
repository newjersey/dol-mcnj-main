import React from "react";
import { StubClient } from "../test-objects/StubClient";
import { render } from "@testing-library/react";
import { TrainingPage } from "./TrainingPage";
import { act } from "react-dom/test-utils";
import {
  buildAddress,
  buildOccupation,
  buildProvider,
  buildTraining,
} from "../test-objects/factories";
import { CalendarLength } from "../domain/Training";
import { Error } from "../domain/Error";
import { SearchResultsPageStrings } from "../localizations/SearchResultsPageStrings";
import { TrainingPageStrings } from "../localizations/TrainingPageStrings";
import { ErrorPageStrings } from "../localizations/ErrorPageStrings";

/* eslint-disable @typescript-eslint/explicit-function-return-type */
function mockReachRouter() {
  const original = jest.requireActual("@reach/router");
  return {
    ...original,
    navigate: jest.fn(),
  };
}

jest.mock("@reach/router", () => mockReachRouter());

const { inDemandTag } = SearchResultsPageStrings;
const {
  missingProviderUrl,
  missingProviderAddress,
  associatedOccupationsText,
} = TrainingPageStrings;
const { notFoundHeader, somethingWentWrongHeader } = ErrorPageStrings;

describe("<TrainingPage />", () => {
  let stubClient: StubClient;

  beforeEach(() => {
    stubClient = new StubClient();
  });

  it("uses the url parameter id to fetch training data", () => {
    render(<TrainingPage client={stubClient} id="my-cool-id" />);
    expect(stubClient.capturedId).toEqual("my-cool-id");
  });

  it("executes an empty search when parameter does not exist", () => {
    render(<TrainingPage client={stubClient} id={undefined} />);
    expect(stubClient.capturedId).toEqual("");
  });

  it("displays training details data", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    const training = buildTraining({
      id: "12345",
      name: "my cool training",
      calendarLength: CalendarLength.SIX_TO_TWELVE_MONTHS,
      provider: buildProvider({
        url: "www.mycoolwebsite.com",
        name: "My Cool Provider",
        address: buildAddress({
          street1: "123 Main Street",
          street2: "",
          city: "Newark",
          state: "NJ",
          zipCode: "01234",
        }),
        contactName: "Ada Lovelace",
        contactTitle: "Computing Pioneer",
        phoneNumber: "6093800243",
        phoneExtension: "9876",
      }),
      occupations: [buildOccupation({ title: "Botanist" }), buildOccupation({ title: "Senator" })],
      description: "some cool description",
      certifications: "tree identifier",
      prerequisites: "High School Diploma/G.E.D. or Ability To Benefit",
      tuitionCost: 0,
      feesCost: 50,
      booksMaterialsCost: 608.9,
      suppliesToolsCost: 9.99,
      otherCost: 1000,
      totalCost: 1234.56,
      percentEmployed: 0.77523,
      averageSalary: 123456,
      online: false,
    });

    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(subject.getByText("my cool training", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("Completion time: 6-12 months", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("some cool description", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("Botanist", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("Senator", { exact: false })).toBeInTheDocument();
    expect(subject.getAllByText("My Cool Provider", { exact: false })).toHaveLength(2);
    expect(subject.getByText("www.mycoolwebsite.com", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("123 Main Street", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("Newark, NJ 01234", { exact: false })).toBeInTheDocument();

    expect(subject.getByText("$0.00", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("$50.00", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("$608.90", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("$1,000.00", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("$9.99", { exact: false })).toBeInTheDocument();

    expect(subject.getByText("$1,234.56", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("77.5%", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("$123,456")).toBeInTheDocument();
    expect(subject.getByText("Ada Lovelace", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("Computing Pioneer", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("(609) 380-0243 Ext: 9876", { exact: false })).toBeInTheDocument();
  });

  it("displays online instead of location when training is online", () => {
    const subject = render(<TrainingPage client={stubClient} />);

    const training = buildTraining({
      provider: buildProvider({
        address: buildAddress({
          city: "Newark",
        }),
      }),
      online: true,
    });

    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(subject.getByText("Online Class", { exact: false })).toBeInTheDocument();
    expect(subject.queryByText("Newark", { exact: false })).not.toBeInTheDocument();
  });

  it("displays an in-demand tag when a training is in-demand", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const inDemand = buildTraining({ inDemand: true });
    act(() => stubClient.capturedObserver.onSuccess(inDemand));

    expect(subject.queryByText(inDemandTag)).toBeInTheDocument();
  });

  it("does not display an in-demand tag when a training is not in-demand", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const notInDemand = buildTraining({ inDemand: false });
    act(() => stubClient.capturedObserver.onSuccess(notInDemand));

    expect(subject.queryByText(inDemandTag)).not.toBeInTheDocument();
  });

  it("displays both address lines if they exist", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    const training = buildTraining({
      online: false,
      provider: buildProvider({
        address: buildAddress({
          street1: "123 Main Street",
          street2: "Apartment 1",
          city: "Newark",
          state: "NJ",
          zipCode: "01234",
        }),
      }),
    });

    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(subject.getByText("123 Main Street", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("Apartment 1", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("Newark, NJ 01234", { exact: false })).toBeInTheDocument();
  });

  it("links each line of the address to a map using url-encoded name and address", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    act(() =>
      stubClient.capturedObserver.onSuccess(
        buildTraining({
          online: false,
          provider: buildProvider({
            name: "Cool Provider",
            address: buildAddress({
              street1: "123 Main Street",
              street2: "Apartment 1",
              city: "Newark",
              state: "NJ",
              zipCode: "01234",
            }),
          }),
        })
      )
    );

    const urlEncoded =
      "Cool%20Provider%20123%20Main%20Street%20Apartment%201%20Newark%20NJ%2001234";

    expect(
      subject
        .getByText("123 Main Street", { exact: false })
        .parentElement?.parentElement?.getAttribute("href")
    ).toEqual(`https://www.google.com/maps/search/?api=1&query=${urlEncoded}`);
  });

  it("does not link to a map when training is online", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    act(() => stubClient.capturedObserver.onSuccess(buildTraining({ online: true })));

    expect(
      subject.getByText("Online Class", { exact: false }).parentElement?.parentElement
    ).not.toHaveAttribute("href");
  });

  it("does not `Ext:` when provider contact has no phone extension", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const notInDemand = buildTraining({ provider: buildProvider({ phoneExtension: "" }) });
    act(() => stubClient.capturedObserver.onSuccess(notInDemand));

    expect(subject.queryByText("Ext:")).not.toBeInTheDocument();
  });

  it("links to the provider website with http", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    act(() =>
      stubClient.capturedObserver.onSuccess(
        buildTraining({ provider: buildProvider({ url: "www.mycoolwebsite.com" }) })
      )
    );

    expect(subject.getByText("www.mycoolwebsite.com").getAttribute("href")).toEqual(
      "http://www.mycoolwebsite.com"
    );
  });

  it("links to the provider website when url already includes http", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    act(() =>
      stubClient.capturedObserver.onSuccess(
        buildTraining({ provider: buildProvider({ url: "http://www.mycoolwebsite.com" }) })
      )
    );

    expect(subject.getByText("http://www.mycoolwebsite.com").getAttribute("href")).toEqual(
      "http://www.mycoolwebsite.com"
    );
  });

  it("displays -- and no hyperlink if provider has no URL", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    act(() =>
      stubClient.capturedObserver.onSuccess(buildTraining({ provider: buildProvider({ url: "" }) }))
    );

    expect(subject.getByText(missingProviderUrl)).toBeInTheDocument();
    expect(subject.getByText(missingProviderUrl)).not.toHaveAttribute("href");
  });

  it("displays helper text if training has no occupations or NO MATCH", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    act(() => stubClient.capturedObserver.onSuccess(buildTraining({ occupations: [] })));

    expect(subject.getByText("This is a general training", { exact: false })).toBeInTheDocument();

    act(() =>
      stubClient.capturedObserver.onSuccess(
        buildTraining({ occupations: [buildOccupation({ title: "NO MATCH" })] })
      )
    );

    expect(
      subject.getByText(associatedOccupationsText.substring(0, 10), { exact: false })
    ).toBeInTheDocument();
  });

  it("displays -- if training provider has no address", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    act(() =>
      stubClient.capturedObserver.onSuccess(
        buildTraining({
          online: false,
          provider: buildProvider({ address: buildAddress({ city: undefined }) }),
        })
      )
    );

    expect(subject.getByText(missingProviderAddress)).toBeInTheDocument();
  });

  it("displays share training text if training is in-demand", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const inDemand = buildTraining({ inDemand: true });
    act(() => stubClient.capturedObserver.onSuccess(inDemand));

    expect(subject.queryByTestId("shareInDemandTraining")).toBeInTheDocument();
  });

  it("does not display share training text if training is not in-demand", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const notInDemand = buildTraining({ inDemand: false });
    act(() => stubClient.capturedObserver.onSuccess(notInDemand));

    expect(subject.queryByTestId("shareInDemandTraining")).not.toBeInTheDocument();
  });

  it("displays the Not Found page on not found error", () => {
    const subject = render(<TrainingPage client={stubClient} id="notfound" />);

    act(() => stubClient.capturedObserver.onError(Error.NOT_FOUND));

    expect(subject.getByText(notFoundHeader, { exact: false })).toBeInTheDocument();
  });

  it("displays the Error page on server error", () => {
    const subject = render(<TrainingPage client={stubClient} id="notfound" />);

    act(() => stubClient.capturedObserver.onError(Error.SYSTEM_ERROR));

    expect(subject.getByText(somethingWentWrongHeader, { exact: false })).toBeInTheDocument();
  });

  it("converts carriage returns to newlines in the description", () => {
    const subject = render(<TrainingPage client={stubClient} id="1234" />);
    act(() =>
      stubClient.capturedObserver.onSuccess(
        buildTraining({ description: "some first line\nsome second line" })
      )
    );
    expect(subject.getByText("some first line")).toBeInTheDocument();
    expect(subject.getByText("some second line")).toBeInTheDocument();
  });
});
