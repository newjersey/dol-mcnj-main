import { StubClient } from "../test-objects/StubClient";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { InDemandCareersPage } from "./InDemandCareersPage";
import { act } from "react-dom/test-utils";
import { buildInDemandOccupation } from "../test-objects/factories";
import { navigate } from "@reach/router";

/* eslint-disable @typescript-eslint/explicit-function-return-type */
function mockReachRouter() {
  const original = jest.requireActual("@reach/router");
  return {
    ...original,
    navigate: jest.fn(),
  };
}

jest.mock("@reach/router", () => mockReachRouter());

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: "BODY",
    ownerDocument: document,
  },
});

describe("<InDemandCareersPage />", () => {
  let stubClient: StubClient;

  beforeEach(() => {
    stubClient = new StubClient();
  });

  it("calls to get occupations from client", () => {
    render(<InDemandCareersPage client={stubClient} />);
    expect(stubClient.getOccupationsWasCalled).toEqual(true);
  });

  it("displays unique major groups and not titles on the page", () => {
    const subject = render(<InDemandCareersPage client={stubClient} />);

    act(() =>
      stubClient.capturedObserver.onSuccess([
        buildInDemandOccupation({ majorGroup: "Welding Occupations", title: "Underwater Welder" }),
        buildInDemandOccupation({ majorGroup: "Welding Occupations", title: "Magma Welder" }),
        buildInDemandOccupation({ majorGroup: "Artists", title: "Volcano Painter" }),
      ])
    );

    expect(subject.getByText("Welding Occupations")).toBeInTheDocument();
    expect(subject.getByText("Artists")).toBeInTheDocument();
    expect(subject.queryByText("Underwater Welder")).not.toBeInTheDocument();
    expect(subject.queryByText("Magma Welder")).not.toBeInTheDocument();
    expect(subject.queryByText("Volcano Painter")).not.toBeInTheDocument();
  });

  it("displays major groups in alphabetical order", () => {
    const subject = render(<InDemandCareersPage client={stubClient} />);

    act(() =>
      stubClient.capturedObserver.onSuccess([
        buildInDemandOccupation({ majorGroup: "Miners" }),
        buildInDemandOccupation({ majorGroup: "Artists" }),
        buildInDemandOccupation({ majorGroup: "Welders" }),
      ])
    );

    const majorGroups = subject.getAllByTestId("majorGroup");
    expect(majorGroups[0].textContent).toContain("Artists");
    expect(majorGroups[1].textContent).toContain("Miners");
    expect(majorGroups[2].textContent).toContain("Welders");
  });

  it("displays occupations for a category when it is clicked", () => {
    const subject = render(<InDemandCareersPage client={stubClient} />);

    act(() =>
      stubClient.capturedObserver.onSuccess([
        buildInDemandOccupation({ majorGroup: "Welding Occupations", title: "Underwater Welder" }),
        buildInDemandOccupation({ majorGroup: "Welding Occupations", title: "Magma Welder" }),
        buildInDemandOccupation({ majorGroup: "Artists", title: "Volcano Painter" }),
      ])
    );

    expect(subject.getByText("Welding Occupations")).toBeInTheDocument();
    expect(subject.getByText("Artists")).toBeInTheDocument();
    expect(subject.queryByText("Underwater Welder")).not.toBeInTheDocument();
    expect(subject.queryByText("Magma Welder")).not.toBeInTheDocument();
    expect(subject.queryByText("Volcano Painter")).not.toBeInTheDocument();

    subject.getByText("Welding Occupations").click();

    expect(subject.getByText("Welding Occupations")).toBeInTheDocument();
    expect(subject.getByText("Artists")).toBeInTheDocument();
    expect(subject.queryByText("Underwater Welder")).toBeInTheDocument();
    expect(subject.queryByText("Magma Welder")).toBeInTheDocument();
    expect(subject.queryByText("Volcano Painter")).not.toBeInTheDocument();
  });

  it("changes arrow to indicate open/close state", () => {
    const subject = render(<InDemandCareersPage client={stubClient} />);

    act(() =>
      stubClient.capturedObserver.onSuccess([
        buildInDemandOccupation({ majorGroup: "Artists", title: "Volcano Painter" }),
      ])
    );

    expect(subject.queryByText("keyboard_arrow_down")).toBeInTheDocument();
    expect(subject.queryByText("keyboard_arrow_up")).not.toBeInTheDocument();

    fireEvent.click(subject.getByText("Artists"));

    expect(subject.queryByText("keyboard_arrow_down")).not.toBeInTheDocument();
    expect(subject.queryByText("keyboard_arrow_up")).toBeInTheDocument();
  });

  it("typeahead searches for and navigates to in-demand careers", () => {
    const subject = render(<InDemandCareersPage client={stubClient} />);

    act(() =>
      stubClient.capturedObserver.onSuccess([
        buildInDemandOccupation({ title: "Data Scientist", soc: "12-3456" }),
        buildInDemandOccupation({ title: "Data Artist" }),
        buildInDemandOccupation({ title: "Something else" }),
      ])
    );

    fireEvent.change(subject.getByPlaceholderText("Search for occupations"), {
      target: { value: "data" },
    });
    fireEvent.click(subject.getByText("Data Scientist"));

    expect(navigate).toHaveBeenCalledWith("/occupation/12-3456");
  });
});
