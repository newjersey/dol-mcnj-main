import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FinancialResourceFilter } from "../FinancialResourceFilter";

describe("FinancialResourceFilter", () => {
  const setActiveTags = jest.fn();
  const funding = {
    items: [
      {
        sys: { id: "1" },
        title: "Funding 1",
        type: "Funding",
        color: "#000",
      },
      {
        sys: { id: "2" },
        title: "Funding 2",
        type: "Funding",
        color: "#000",
      },
    ],
  };
  const education = {
    items: [
      {
        sys: { id: "3" },
        title: "Education 1",
        type: "Education",
        color: "#000",
      },
      {
        sys: { id: "4" },
        title: "Education 2",
        type: "Education",
        color: "#000",
      },
    ],
  };

  beforeEach(() => {
    setActiveTags.mockClear();
  });

  it("renders the component with the given props", () => {
    render(
      <FinancialResourceFilter
        funding={funding}
        education={education}
        setActiveTags={setActiveTags}
        activeTags={[]}
        className="test-class"
      />
    );

    const fundingCheckboxes = screen.getAllByLabelText(/funding/i);
    expect(fundingCheckboxes).toHaveLength(2);

    const educationCheckboxes = screen.getAllByLabelText(/education/i);
    expect(educationCheckboxes).toHaveLength(2);

    const resetButton = screen.getByTestId("reset");
    expect(resetButton).toBeInTheDocument();
  });

  it("calls setActiveTags with the correct arguments when a checkbox is checked", () => {
    render(
      <FinancialResourceFilter
        funding={funding}
        education={education}
        setActiveTags={setActiveTags}
        activeTags={[]}
      />
    );

    const fundingCheckbox1 = screen.getByTestId(funding.items[0].sys.id);
    fireEvent.click(fundingCheckbox1);
    expect(setActiveTags).toHaveBeenCalledTimes(1);
    expect(setActiveTags).toHaveBeenCalledWith([funding.items[0].sys.id]);

    const educationCheckbox2 = screen.getByTestId(education.items[1].sys.id);
    fireEvent.click(educationCheckbox2);
    expect(setActiveTags).toHaveBeenCalledTimes(2);
  });

  it("calls setActiveTags with the correct arguments when a checkbox is unchecked", () => {
    render(
      <FinancialResourceFilter
        funding={funding}
        education={education}
        setActiveTags={setActiveTags}
        activeTags={[funding.items[0].sys.id, education.items[1].sys.id]}
      />
    );

    const fundingCheckbox1 = screen.getByTestId(funding.items[0].sys.id);
    fireEvent.click(fundingCheckbox1);
    expect(setActiveTags).toHaveBeenCalledTimes(1);

    const educationCheckbox2 = screen.getByTestId(education.items[1].sys.id);
    fireEvent.click(educationCheckbox2);
    expect(setActiveTags).toHaveBeenCalledTimes(2);
  });

  it("calls setActiveTags with an empty array when reset button is clicked", () => {
    render(
      <FinancialResourceFilter
        funding={funding}
        education={education}
        setActiveTags={setActiveTags}
        activeTags={[funding.items[0].sys.id, education.items[1].sys.id]}
      />
    );

    const resetButton = screen.getByTestId("reset");
    fireEvent.click(resetButton);
    expect(setActiveTags).toHaveBeenCalledTimes(1);
  });
});
