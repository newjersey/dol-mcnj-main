import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { RenderResult, fireEvent } from "@testing-library/react";
import { waitForEffect, renderWithRouter } from "../../test-objects/helpers";
import { SearchAndFilterStrings } from "../../localizations/SearchAndFilterStrings";

describe("filtering by soc code", () => {
  const training1 = buildTrainingResult({ name: "training1", socCodes: ["12-1234", "34-3456"] });
  const training2 = buildTrainingResult({ name: "training2", socCodes: ["56-5678"] });
  const training3 = buildTrainingResult({ name: "training3", socCodes: [] });

  const getSocCodeInput = (subject: RenderResult): HTMLElement => {
    return subject.getByLabelText(SearchAndFilterStrings.socCodeFilterLabel, { exact: false });
  };

  let stubClient: StubClient;
  let subject: RenderResult;

  beforeEach(async () => {
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

  it("filters by soc code", async () => {
    fireEvent.change(getSocCodeInput(subject), {
      target: { value: "12-1234" },
    });
    fireEvent.blur(getSocCodeInput(subject));

    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
  });

  it("updates a filter when changed", async () => {
    fireEvent.change(getSocCodeInput(subject), {
      target: { value: "12-1234" },
    });
    fireEvent.blur(getSocCodeInput(subject));

    fireEvent.change(getSocCodeInput(subject), {
      target: { value: "56-5678" },
    });
    fireEvent.blur(getSocCodeInput(subject));

    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.getByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
  });

  it("removes a filter when empty", async () => {
    fireEvent.change(getSocCodeInput(subject), {
      target: { value: "12-1234" },
    });
    fireEvent.blur(getSocCodeInput(subject));

    fireEvent.change(getSocCodeInput(subject), {
      target: { value: "" },
    });
    fireEvent.blur(getSocCodeInput(subject));

    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.getByText("training2")).toBeInTheDocument();
    expect(subject.getByText("training3")).toBeInTheDocument();
  });

  it("filters on enter key", async () => {
    fireEvent.change(getSocCodeInput(subject), {
      target: { value: "34-3456" },
    });

    fireEvent.keyDown(getSocCodeInput(subject), {
      key: "Enter",
      code: "Enter",
    });

    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
  });

  it("removes filter when clear button is clicked", async () => {
    fireEvent.change(getSocCodeInput(subject), {
      target: { value: "56-5678" },
    });
    fireEvent.blur(getSocCodeInput(subject));

    fireEvent.click(subject.getByText(SearchAndFilterStrings.clearAllFiltersButtonLabel));

    await waitForEffect();

    expect(
      (subject.getByPlaceholderText("i.e. 43-9041", { exact: false }) as HTMLInputElement).value
    ).toEqual("");
    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.getByText("training2")).toBeInTheDocument();
    expect(subject.getByText("training3")).toBeInTheDocument();
  });

  it("shows an error message if invalid format", async () => {
    fireEvent.change(getSocCodeInput(subject), {
      target: { value: "12" },
    });
    fireEvent.blur(getSocCodeInput(subject));
    expect(subject.getByText(SearchAndFilterStrings.invalidSocCodeError)).toBeInTheDocument();

    fireEvent.change(getSocCodeInput(subject), {
      target: { value: "12-" },
    });
    fireEvent.blur(getSocCodeInput(subject));
    expect(subject.getByText(SearchAndFilterStrings.invalidSocCodeError)).toBeInTheDocument();

    fireEvent.change(getSocCodeInput(subject), {
      target: { value: "12-1234" },
    });
    fireEvent.blur(getSocCodeInput(subject));
    expect(subject.queryByText(SearchAndFilterStrings.invalidSocCodeError)).not.toBeInTheDocument();

    fireEvent.change(getSocCodeInput(subject), {
      target: { value: "12-12345" },
    });
    fireEvent.blur(getSocCodeInput(subject));
    expect(subject.getByText(SearchAndFilterStrings.invalidSocCodeError)).toBeInTheDocument();

    fireEvent.change(getSocCodeInput(subject), {
      target: { value: "12-123" },
    });
    fireEvent.blur(getSocCodeInput(subject));
    expect(subject.getByText(SearchAndFilterStrings.invalidSocCodeError)).toBeInTheDocument();

    fireEvent.change(getSocCodeInput(subject), {
      target: { value: "121234" },
    });
    fireEvent.blur(getSocCodeInput(subject));
    expect(subject.queryByText(SearchAndFilterStrings.invalidSocCodeError)).toBeInTheDocument();
  });
});
