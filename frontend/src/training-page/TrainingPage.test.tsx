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
import { PROVIDER_MISSING_INFO } from "../constants";
import { en as Content } from "../locales/en";

/* eslint-disable @typescript-eslint/explicit-function-return-type */
function mockReachRouter() {
  const original = jest.requireActual("@reach/router");
  return {
    ...original,
    navigate: jest.fn(),
  };
}

jest.mock("@reach/router", () => mockReachRouter());

const { inDemandTag } = Content.SearchResultsPage;
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
        addresses:
          [
            buildAddress({
              street1: "123 Main Street",
              street2: "",
              city: "Newark",
              state: "NJ",
              zipCode: "01234",
            }),
            buildAddress({
              street1: "456 Less Important Rd",
              street2: "",
              city: "Trenton",
              state: "NJ",
              zipCode: "98765",
            }),
          ],
        /*contactName: "Ada Lovelace",
        contactTitle: "Computing Pioneer",
        phoneNumber: "6093800243",
        phoneExtension: "9876",*/
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
    expect(
      subject.getByText("Completion time: " + Content.CalendarLengthLookup["7"], { exact: false })
    ).toBeInTheDocument();
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
        addresses:
          [
            buildAddress({
              city: "Newark",
            }),
            buildAddress({
              city: "Elizabeth",
            }),
            buildAddress({
              city: "Paterson",
            }),
          ]

      }),
      online: true,
    });

    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(
      subject.getByText(Content.TrainingPage.onlineClass, { exact: false })
    ).toBeInTheDocument();
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

  /*
    it("displays both address lines if they exist", () => {
      const subject = render(<TrainingPage client={stubClient} id="12345" />);

      const training = buildTraining({
        online: false,
        provider: buildProvider({
          addresses: [
            buildAddress({
              street1: "123 Main Street",
              street2: "Apartment 1",
              city: "Newark",
              state: "NJ",
              zipCode: "01234",
            }),
            buildAddress({
              street1: "528 Fearless Ave",
              street2: "",
              city: "Princeton",
              state: "NJ",
              zipCode: "01234",
            }),
          ]
        }),
      });

      act(() => stubClient.capturedObserver.onSuccess(training));

      expect(subject.getByText("123 Main Street", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("Apartment 1", { exact: false })).toBeInTheDocument();
      expect(subject.getByText("Newark, NJ 01234", { exact: false })).toBeInTheDocument();
    });
  */

  it("links each line of the address to a map using url-encoded name and address", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    act(() =>
      stubClient.capturedObserver.onSuccess(
        buildTraining({
          online: false,
          provider: buildProvider({
            name: "Cool Provider",
            addresses: [
              buildAddress({
                street1: "123 Main Street",
                street2: "Apartment 1",
                city: "Newark",
                state: "NJ",
                zipCode: "01234",
              })
            ]
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
      subject.getByText(Content.TrainingPage.onlineClass, { exact: false }).parentElement
        ?.parentElement
    ).not.toHaveAttribute("href");
  });

  /*
    it("does not `Ext:` when provider contact has no phone extension", () => {
      const subject = render(<TrainingPage client={stubClient} />);
      const notInDemand = buildTraining({ provider: buildProvider({ phoneExtension: "" }) });
      act(() => stubClient.capturedObserver.onSuccess(notInDemand));

      expect(subject.queryByText("Ext:")).not.toBeInTheDocument();
    });
  */

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

    expect(subject.getByText(PROVIDER_MISSING_INFO)).toBeInTheDocument();
    expect(subject.getByText(PROVIDER_MISSING_INFO)).not.toHaveAttribute("href");
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
      subject.getByText(
        "This is a general training that might prepare you for a wide variety of career paths Browse",
        {
          exact: false,
        }
      )
    ).toBeInTheDocument();
  });

  it("displays -- if training provider has no address", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    act(() =>
      stubClient.capturedObserver.onSuccess(
        buildTraining({
          online: false,
          provider: buildProvider({ addresses: [buildAddress({ city: undefined })] }),
        })
      )
    );

    expect(subject.getByText(PROVIDER_MISSING_INFO)).toBeInTheDocument();
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

    expect(
      subject.getByText(Content.ErrorPage.notFoundHeader, { exact: false })
    ).toBeInTheDocument();
  });

  it("displays the Error page on server error", () => {
    const subject = render(<TrainingPage client={stubClient} id="notfound" />);

    act(() => stubClient.capturedObserver.onError(Error.SYSTEM_ERROR));

    expect(
      subject.getByText(Content.ErrorPage.somethingWentWrongHeader, { exact: false })
    ).toBeInTheDocument();
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

  it("displays evening courses text if training has evening courses", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const training = buildTraining({ hasEveningCourses: true });
    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(subject.getByText(Content.TrainingPage.eveningCoursesServiceLabel)).toBeInTheDocument();
  });

  it("does not display evening courses text if training does not have evening courses", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const training = buildTraining({ hasEveningCourses: false });
    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(
      subject.queryByText(Content.TrainingPage.eveningCoursesServiceLabel)
    ).not.toBeInTheDocument();
  });

  it("displays languages text if training has languages", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const training = buildTraining({ languages: ["Spanish"] });
    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(subject.getByText(Content.TrainingPage.otherLanguagesServiceLabel)).toBeInTheDocument();
  });

  it("does not display languages text if training does not have languages", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const training = buildTraining({ languages: [] });
    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(
      subject.queryByText(Content.TrainingPage.otherLanguagesServiceLabel)
    ).not.toBeInTheDocument();
  });

  it("displays wheelchair accessible text if training is wheelchair accessible", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const training = buildTraining({ isWheelchairAccessible: true });
    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(
      subject.getByText(Content.TrainingPage.wheelchairAccessibleServiceLabel)
    ).toBeInTheDocument();
  });

  it("does not display wheelchair accessible text if training is not wheelchair accessible", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const training = buildTraining({ isWheelchairAccessible: false });
    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(
      subject.queryByText(Content.TrainingPage.wheelchairAccessibleServiceLabel)
    ).not.toBeInTheDocument();
  });

  it("displays childcare assistance text if training has childcare assistance", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const training = buildTraining({ hasChildcareAssistance: true });
    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(
      subject.getByText(Content.TrainingPage.childcareAssistanceServiceLabel)
    ).toBeInTheDocument();
  });

  it("does not display childcare assistance text if training does not have childcare assistance", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const training = buildTraining({ hasChildcareAssistance: false });
    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(
      subject.queryByText(Content.TrainingPage.childcareAssistanceServiceLabel)
    ).not.toBeInTheDocument();
  });

  it("displays job assistance text if training has job assistance", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const training = buildTraining({ hasJobPlacementAssistance: true });
    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(subject.getByText(Content.TrainingPage.jobAssistanceServiceLabel)).toBeInTheDocument();
  });

  it("does not display job assistance text if training does not have job assistance", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const training = buildTraining({ hasJobPlacementAssistance: false });
    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(
      subject.queryByText(Content.TrainingPage.jobAssistanceServiceLabel)
    ).not.toBeInTheDocument();
  });
});
