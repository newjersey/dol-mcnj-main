import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UpdateNotifier } from "./UpdateNotifier";
import fetchMock from "jest-fetch-mock";

// Mock the LinkObject and FormInput components
jest.mock("../modules/LinkObject", () => ({
  LinkObject: jest.fn(({ children, url }) => <a href={url}>{children}</a>),
}));

jest.mock("../../utils/checkValidEmail", () => ({
  checkValidEmail: jest.fn((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
}));

describe("UpdateNotifier", () => {
  const email = "test@example.com";
  const invalidEmail = "test@invalid";

  beforeEach(() => {
    jest.resetAllMocks();
    fetchMock.resetMocks();
  });

  it("renders correctly without drawer", () => {
    render(<UpdateNotifier />);
    expect(screen.getByText("Sign Up for Updates")).toBeInTheDocument();
  });

  it("renders correctly with drawer", () => {
    render(<UpdateNotifier isDrawer />);
    expect(screen.getAllByText("Sign Up for Updates")[0]).toBeInTheDocument();
  });

  it("opens and closes the drawer when button is clicked", () => {
    render(<UpdateNotifier isDrawer />);
    const button = screen.getAllByText("Sign Up for Updates")[0];
    fireEvent.click(button);
    expect(
      screen.queryByText("Close")?.parentElement?.parentElement?.classList,
    ).toContain("open");
    fireEvent.click(screen.getByText("Close"));
    expect(
      screen.queryByText("Close")?.parentElement?.parentElement?.classList,
    ).not.toContain("open");
  });

  it("shows error message for invalid email", () => {
    render(<UpdateNotifier />);

    const formInput = document.querySelector(
      "input#input-email",
    ) as HTMLInputElement;

    fireEvent.change(formInput, {
      target: { value: invalidEmail },
    });

    fireEvent.blur(formInput);
    expect(
      screen.getByText("Please enter a valid email address"),
    ).toBeInTheDocument();
  });

  // TODO: Fix this test

  // it("submits the form successfully", async () => {
  //   fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

  //   render(<UpdateNotifier  />);

  //   const formInput = document.querySelector(
  //     "input#input-email",
  //   ) as HTMLInputElement;

  //   fireEvent.change(formInput, {
  //     target: { value: email },
  //   });
  //   fireEvent.click(screen.getByText("Sign Up for Updates"));

  //   await waitFor(() => {
  //     expect(
  //       screen.getByText("If this is the first time you've subscribed to"),
  //     ).toBeInTheDocument();
  //   });
  // });

  // it("shows error message for submission failure", async () => {
  //   fetchMock.mockResponseOnce("", { status: 500, statusText: "Error" });

  //   render(<UpdateNotifier />);
  //   fireEvent.change(screen.getByTestId("form-input"), {
  //     target: { value: email },
  //   });
  //   fireEvent.click(screen.getByText("Sign Up for Updates"));

  //   await waitFor(() => {
  //     expect(
  //       screen.getByText("There was an error with your submission"),
  //     ).toBeInTheDocument();
  //   });
  // });

  // it("resets the form after submission failure", async () => {
  //   fetchMock.mockResponseOnce("", { status: 500, statusText: "Error" });

  //   render(<UpdateNotifier />);
  //   fireEvent.change(screen.getByTestId("form-input"), {
  //     target: { value: email },
  //   });
  //   fireEvent.click(screen.getByText("Sign Up for Updates"));

  //   await waitFor(() => {
  //     expect(
  //       screen.getByText("There was an error with your submission"),
  //     ).toBeInTheDocument();
  //   });

  //   fireEvent.click(screen.getByText("Reset Form"));
  //   expect(screen.getByTestId("form-input")).toHaveValue("");
  // });
});
