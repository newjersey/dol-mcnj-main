import { StubClient } from "../test-objects/StubClient";
import { fireEvent, render, screen } from "@testing-library/react";
import { InDemandOccupationsPage } from "./InDemandOccupationsPage";
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

describe("<InDemandOccupationsPage />", () => {
  let stubClient: StubClient;

  beforeEach(() => {
    stubClient = new StubClient();
  });

  it("calls to get occupations from client", () => {
    act(() => {
      render(<InDemandOccupationsPage client={stubClient} />);
    });
    expect(stubClient.getOccupationsWasCalled).toEqual(true);
  });

  it("displays unique major groups and not titles on the page", () => {
    act(() => {
      render(<InDemandOccupationsPage client={stubClient} />);
    })

    act(() =>
      stubClient.capturedObserver.onSuccess([
        buildInDemandOccupation({ majorGroup: "Welding Occupations", title: "Underwater Welder" }),
        buildInDemandOccupation({ majorGroup: "Welding Occupations", title: "Magma Welder" }),
        buildInDemandOccupation({ majorGroup: "Artists", title: "Volcano Painter" }),
      ]),
    );

    expect(screen.getByText("Welding Occupations")).toBeInTheDocument();
    expect(screen.getByText("Artists")).toBeInTheDocument();
    expect(screen.queryByText("Underwater Welder")).not.toBeInTheDocument();
    expect(screen.queryByText("Magma Welder")).not.toBeInTheDocument();
    expect(screen.queryByText("Volcano Painter")).not.toBeInTheDocument();
  });

  it("displays major groups in alphabetical order", () => {
    act(() => {
      render(<InDemandOccupationsPage client={stubClient} />);
    })

    act(() =>
      stubClient.capturedObserver.onSuccess([
        buildInDemandOccupation({ majorGroup: "Miners" }),
        buildInDemandOccupation({ majorGroup: "Artists" }),
        buildInDemandOccupation({ majorGroup: "Welders" }),
      ]),
    );

    const majorGroups = screen.getAllByTestId("majorGroup");
    expect(majorGroups[0].textContent).toContain("Artists");
    expect(majorGroups[1].textContent).toContain("Miners");
    expect(majorGroups[2].textContent).toContain("Welders");
  });

  it("displays occupations for a category when it is clicked", () => {
    act(() => {
      render(<InDemandOccupationsPage client={stubClient} />);
    });

    act(() =>
      stubClient.capturedObserver.onSuccess([
        buildInDemandOccupation({ majorGroup: "Welding Occupations", title: "Underwater Welder" }),
        buildInDemandOccupation({ majorGroup: "Welding Occupations", title: "Magma Welder" }),
        buildInDemandOccupation({ majorGroup: "Artists", title: "Volcano Painter" }),
      ]),
    );

    expect(screen.getByText("Welding Occupations")).toBeInTheDocument();
    expect(screen.getByText("Artists")).toBeInTheDocument();
    expect(screen.queryByText("Underwater Welder")).not.toBeInTheDocument();
    expect(screen.queryByText("Magma Welder")).not.toBeInTheDocument();
    expect(screen.queryByText("Volcano Painter")).not.toBeInTheDocument();

    screen.getByText("Welding Occupations").click();

    expect(screen.getByText("Welding Occupations")).toBeInTheDocument();
    expect(screen.getByText("Artists")).toBeInTheDocument();
    expect(screen.queryByText("Underwater Welder")).toBeInTheDocument();
    expect(screen.queryByText("Magma Welder")).toBeInTheDocument();
    expect(screen.queryByText("Volcano Painter")).not.toBeInTheDocument();
  });

  it("changes arrow to indicate open/close state", () => {
    act(() => {
      render(<InDemandOccupationsPage client={stubClient} />);
    })

    act(() =>
      stubClient.capturedObserver.onSuccess([
        buildInDemandOccupation({ majorGroup: "Artists", title: "Volcano Painter" }),
      ]),
    );

    expect(screen.queryByText("keyboard_arrow_down")).toBeInTheDocument();
    expect(screen.queryByText("keyboard_arrow_up")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Artists"));

    expect(screen.queryByText("keyboard_arrow_down")).not.toBeInTheDocument();
    expect(screen.queryByText("keyboard_arrow_up")).toBeInTheDocument();
  });

  it("typeahead searches for and navigates to in-demand ", () => {
    act(() => {
      render(<InDemandOccupationsPage client={stubClient} />);
    })

    act(() =>
      stubClient.capturedObserver.onSuccess([
        buildInDemandOccupation({ title: "Data Scientist", soc: "12-3456" }),
        buildInDemandOccupation({ title: "Data Artist" }),
        buildInDemandOccupation({ title: "Something else" }),
      ]),
    );

    fireEvent.change(screen.getByPlaceholderText("Search for occupations"), {
      target: { value: "data" },
    });
    fireEvent.click(screen.getByText("Data Scientist"));

    expect(navigate).toHaveBeenCalledWith("/occupation/12-3456");
  });
});
