import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { RenderResult, fireEvent } from "@testing-library/react";
import { waitForEffect, renderWithRouter } from "../../test-objects/helpers";
import { SearchAndFilterStrings } from "../../localizations/SearchAndFilterStrings";

describe("filtering by cip code", () => {
  const training1 = buildTrainingResult({ name: "training1", cipCode: "123456" });
  const training2 = buildTrainingResult({ name: "training2", cipCode: "234567" });
  const training3 = buildTrainingResult({ name: "training3", cipCode: "345678" });

  const getCipCodeInput = (subject: RenderResult): HTMLElement => {
    return subject.getByLabelText(SearchAndFilterStrings.cipCodeFilterLabel, { exact: false });
  };

  let stubClient: StubClient;
  let subject: RenderResult;

  beforeEach(async () => {
    jest.setTimeout(10000);

    stubClient = new StubClient();
    const { container, history } = renderWithRouter(<App client={stubClient} />);
    subject = container;

    await history.navigate("/search/some-query");
    await waitForEffect();

    act(() => {
      stubClient.capturedObserver.onSuccess([training1, training2, training3]);
    });

    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.getByText("training2")).toBeInTheDocument();
    expect(subject.getByText("training3")).toBeInTheDocument();
  });

  it("filters by cip code", async () => {
    fireEvent.change(getCipCodeInput(subject), {
      target: { value: "123456" },
    });
    fireEvent.blur(getCipCodeInput(subject));

    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
  });

  it("updates a filter when changed", async () => {
    fireEvent.change(getCipCodeInput(subject), {
      target: { value: "123456" },
    });
    fireEvent.blur(getCipCodeInput(subject));

    fireEvent.change(getCipCodeInput(subject), {
      target: { value: "234567" },
    });
    fireEvent.blur(getCipCodeInput(subject));

    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.getByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
  });

  it("removes a filter when empty", async () => {
    fireEvent.change(getCipCodeInput(subject), {
      target: { value: "123456" },
    });
    fireEvent.blur(getCipCodeInput(subject));

    fireEvent.change(getCipCodeInput(subject), {
      target: { value: "" },
    });
    fireEvent.blur(getCipCodeInput(subject));

    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.getByText("training2")).toBeInTheDocument();
    expect(subject.getByText("training3")).toBeInTheDocument();
  });

  it("filters on enter key", async () => {
    fireEvent.change(getCipCodeInput(subject), {
      target: { value: "123456" },
    });

    fireEvent.keyDown(getCipCodeInput(subject), {
      key: "Enter",
      code: "Enter",
    });

    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
  });

  it("removes filter when clear button is clicked", async () => {
    fireEvent.change(getCipCodeInput(subject), {
      target: { value: "345678" },
    });
    fireEvent.blur(getCipCodeInput(subject));

    fireEvent.click(subject.getByText(SearchAndFilterStrings.clearAllFiltersButtonLabel));

    await waitForEffect();

    expect(
      (subject.getByPlaceholderText("i.e. 011102", { exact: false }) as HTMLInputElement).value
    ).toEqual("");
    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.getByText("training2")).toBeInTheDocument();
    expect(subject.getByText("training3")).toBeInTheDocument();
  });

  it("shows an error message if invalid format", async () => {
    fireEvent.change(getCipCodeInput(subject), {
      target: { value: "12" },
    });
    fireEvent.blur(getCipCodeInput(subject));
    expect(subject.getByText(SearchAndFilterStrings.invalidSocCodeError)).toBeInTheDocument();

    fireEvent.change(getCipCodeInput(subject), {
      target: { value: "abcdef" },
    });
    fireEvent.blur(getCipCodeInput(subject));
    expect(subject.getByText(SearchAndFilterStrings.invalidSocCodeError)).toBeInTheDocument();

    fireEvent.change(getCipCodeInput(subject), {
      target: { value: "123456" },
    });
    fireEvent.blur(getCipCodeInput(subject));
    expect(subject.queryByText(SearchAndFilterStrings.invalidSocCodeError)).not.toBeInTheDocument();

    fireEvent.change(getCipCodeInput(subject), {
      target: { value: "1234567" },
    });
    fireEvent.blur(getCipCodeInput(subject));
    expect(subject.getByText(SearchAndFilterStrings.invalidSocCodeError)).toBeInTheDocument();

    fireEvent.change(getCipCodeInput(subject), {
      target: { value: "12345" },
    });
    fireEvent.blur(getCipCodeInput(subject));
    expect(subject.getByText(SearchAndFilterStrings.invalidSocCodeError)).toBeInTheDocument();

    fireEvent.change(getCipCodeInput(subject), {
      target: { value: "12-3456" },
    });
    fireEvent.blur(getCipCodeInput(subject));
    expect(subject.queryByText(SearchAndFilterStrings.invalidSocCodeError)).toBeInTheDocument();
  });
});
