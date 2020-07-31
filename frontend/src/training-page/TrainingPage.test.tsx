import React from "react";
import { StubClient } from "../test-objects/StubClient";
import { render } from "@testing-library/react";
import { TrainingPage } from "./TrainingPage";
import { act } from "react-dom/test-utils";
import { buildAddress, buildProvider, buildTraining } from "../test-objects/factories";
import { CalendarLength } from "../domain/Training";

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
        address: buildAddress({
          street1: "123 Main Street",
          street2: "",
          city: "Newark",
          state: "NJ",
          zipCode: "01234",
        }),
      }),
      occupations: ["Botanist", "Senator"],
      description: "some cool description",
    });

    act(() => stubClient.capturedObserver.onSuccess(training));

    expect(subject.getByText("my cool training", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("www.mycoolwebsite.com", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("6-12 months to complete", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("some cool description", { exact: false })).toBeInTheDocument();
    expect(
      subject.getByText("Career Track: Botanist, Senator", { exact: false })
    ).toBeInTheDocument();
    expect(subject.getByText("123 Main Street", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("Newark, NJ 01234", { exact: false })).toBeInTheDocument();
  });

  it("displays an in-demand tag when a training is in-demand", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const inDemand = buildTraining({ inDemand: true });
    act(() => stubClient.capturedObserver.onSuccess(inDemand));

    expect(subject.queryByText("In Demand")).toBeInTheDocument();
  });

  it("does not display an in-demand tag when a training is not in-demand", () => {
    const subject = render(<TrainingPage client={stubClient} />);
    const notInDemand = buildTraining({ inDemand: false });
    act(() => stubClient.capturedObserver.onSuccess(notInDemand));

    expect(subject.queryByText("In Demand")).not.toBeInTheDocument();
  });

  it("displays both address lines if they exist", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    const training = buildTraining({
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

    expect(subject.getByText("--")).toBeInTheDocument();
    expect(subject.getByText("--")).not.toHaveAttribute("href");
  });

  it("displays -- if training has no occupations", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    act(() => stubClient.capturedObserver.onSuccess(buildTraining({ occupations: [] })));

    expect(subject.getByText("Career Track: --")).toBeInTheDocument();
  });

  it("displays -- if training provider has no address", () => {
    const subject = render(<TrainingPage client={stubClient} id="12345" />);

    act(() =>
      stubClient.capturedObserver.onSuccess(
        buildTraining({
          provider: buildProvider({ address: buildAddress({ city: undefined }) }),
        })
      )
    );

    expect(subject.getByText("--")).toBeInTheDocument();
  });

  it("displays the Not Found page on server error", () => {
    const subject = render(<TrainingPage client={stubClient} id="notfound" />);

    act(() => stubClient.capturedObserver.onError());

    expect(
      subject.getByText("Sorry, we can't seem to find that page", { exact: false })
    ).toBeInTheDocument();
  });
});
