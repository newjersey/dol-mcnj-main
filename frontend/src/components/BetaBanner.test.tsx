import React from "react";
import { useMediaQuery } from "@material-ui/core";
import { render } from "@testing-library/react";
import { BetaBanner } from "./BetaBanner";

/* eslint-disable @typescript-eslint/explicit-function-return-type */
function mockFunctions() {
  const original = jest.requireActual("@material-ui/core");
  return {
    ...original,
    useMediaQuery: jest.fn(),
  };
}

jest.mock("@material-ui/core", () => mockFunctions());

describe("<BetaBanner />", () => {
  it("displays long text on desktop", () => {
    useDesktopSize();
    const subject = render(<BetaBanner />);
    expect(
      subject.getByText("Welcome to the beta version of Training Explorer.", { exact: false })
    ).toBeInTheDocument();
  });

  it("displays short text on mobile", () => {
    useMobileSize();
    const subject = render(<BetaBanner />);
    expect(
      subject.getByText("This site is in beta. Feedback welcome", { exact: false })
    ).toBeInTheDocument();
  });

  it("accepts a prop for removing the header margin", () => {
    const subject = render(<BetaBanner noHeader={true} />);
    const banner = subject.getByText("beta", { exact: false });
    expect(banner).toHaveClass("no-header-margin");
  });

  it("uses default margin if no header prop passed", () => {
    const subject = render(<BetaBanner />);
    const banner = subject.getByText("beta", { exact: false });
    expect(banner).not.toHaveClass("no-header-margin");
  });

  const useDesktopSize = (): void => {
    (useMediaQuery as jest.Mock).mockImplementation(() => true);
  };

  const useMobileSize = (): void => {
    (useMediaQuery as jest.Mock).mockImplementation(() => false);
  };
});
