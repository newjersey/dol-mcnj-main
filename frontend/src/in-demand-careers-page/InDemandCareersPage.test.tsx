import { StubClient } from "../test-objects/StubClient";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { InDemandCareersPage } from "./InDemandCareersPage";
import { act } from "react-dom/test-utils";
import { buildOccupation } from "../test-objects/factories";

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
        buildOccupation({ majorGroup: "Welding Occupations", title: "Underwater Welder" }),
        buildOccupation({ majorGroup: "Welding Occupations", title: "Magma Welder" }),
        buildOccupation({ majorGroup: "Artists", title: "Volcano Painter" }),
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
        buildOccupation({ majorGroup: "Miners" }),
        buildOccupation({ majorGroup: "Artists" }),
        buildOccupation({ majorGroup: "Welders" }),
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
        buildOccupation({ majorGroup: "Welding Occupations", title: "Underwater Welder" }),
        buildOccupation({ majorGroup: "Welding Occupations", title: "Magma Welder" }),
        buildOccupation({ majorGroup: "Artists", title: "Volcano Painter" }),
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
        buildOccupation({ majorGroup: "Artists", title: "Volcano Painter" }),
      ])
    );

    expect(subject.queryByText("keyboard_arrow_down")).toBeInTheDocument();
    expect(subject.queryByText("keyboard_arrow_up")).not.toBeInTheDocument();

    fireEvent.click(subject.getByText("Artists"));

    expect(subject.queryByText("keyboard_arrow_down")).not.toBeInTheDocument();
    expect(subject.queryByText("keyboard_arrow_up")).toBeInTheDocument();
  });
});
