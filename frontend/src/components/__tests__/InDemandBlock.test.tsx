import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { InDemandBlock } from "../InDemandBlock";
import { useMediaQuery } from "@material-ui/core";
import { en as Content } from "../../locales/en";
import { formatCountiesArrayToString } from "../../utils/formatCountiesArrayToString";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

jest.mock("@material-ui/core", () => ({
  ...jest.requireActual("@material-ui/core"),
  useMediaQuery: jest.fn(),
}));
describe("InDemandBlock", () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockImplementation(() => {
      return {
        t: (key, options) => {
          const text = key.split(".").reduce((obj, k) => (obj || {})[k], Content);
          if (text && options) {
            return text.replace(/{{([^{}]*)}}/g, (a, b) => options[b]);
          }
          return text || key;
        },
      };
    });
  });

  const mockProps = {
    counties: ["ESSEX", "MONMOUTH"],
  };

  const { inDemandTitle, localInDemandTitle } = Content.InDemandBlock;

  it("renders statewide in-demand text correctly", () => {
    render(<InDemandBlock />);
    expect(screen.getByText(inDemandTitle)).toBeInTheDocument();
  });

  it("renders local in-demand text correctly with interpolation", () => {
    const mockProps = {
      counties: ["ESSEX", "MONMOUTH"],
    };
    const expectedText = localInDemandTitle.replace(
      "{{countiesList}}",
      formatCountiesArrayToString(mockProps.counties),
    );

    render(<InDemandBlock {...mockProps} />);
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it("renders link correctly on tablet and larger devices", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    render(<InDemandBlock {...mockProps} />);
    const link = screen.getByText(Content.InDemandBlock.localAndRegionalWaiversText);
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
});
