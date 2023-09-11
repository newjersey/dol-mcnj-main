import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { InDemandBlock } from "../InDemandBlock";
import { useMediaQuery } from "@material-ui/core";

jest.mock("@material-ui/core", () => ({
  ...jest.requireActual("@material-ui/core"),
  useMediaQuery: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("InDemandBlock", () => {
  const mockProps = {
    title: "test title",
    backgroundColorClass: "test-class",
  };

  it("renders title correctly", () => {
    render(<InDemandBlock {...mockProps} />);
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
  });

  it("renders link correctly on tablet and larger devices", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    render(<InDemandBlock {...mockProps} />);
    const link = screen.getByText("OccupationPage.localAndRegionalWaiversText");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://www.nj.gov/labor/career-services/tools-support/demand-occupations/waivers.shtml",
    );
  });

  it("does not render link on smaller devices", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    render(<InDemandBlock {...mockProps} />);
    expect(screen.queryByText("OccupationPage.localAndRegionalWaiversText")).toBeNull();
  });

  it("renders with correct class name", () => {
    render(<InDemandBlock {...mockProps} />);
    expect(screen.getByText(mockProps.title).parentElement).toHaveClass(
      mockProps.backgroundColorClass,
    );
  });
});
