import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { fireEvent, RenderResult } from "@testing-library/react";
import { waitForEffect, renderWithRouter } from "../../test-objects/helpers";
import { Error } from "../../domain/Error";

describe("filtering by location", () => {
  const training1 = buildTrainingResult({ name: "training1", zipCode: "11111", online: false });
  const training2 = buildTrainingResult({ name: "training2", zipCode: "22222", online: false });
  const training3 = buildTrainingResult({ name: "training3", zipCode: "33333", online: false });
  const training4 = buildTrainingResult({ name: "training4", zipCode: "44444", online: false });
  const onlineTraining = buildTrainingResult({
    name: "online training",
    zipCode: "random-zipcode",
    online: true,
  });

  const getDistanceInput = (subject: RenderResult): HTMLElement => {
    return subject.getByPlaceholderText("Miles", { exact: false });
  };

  const getZipInput = (subject: RenderResult): HTMLElement => {
    return subject.getByPlaceholderText("Zip Code", { exact: false });
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
      stubClient.capturedObserver.onSuccess([
        training1,
        training2,
        training3,
        training4,
        onlineTraining,
      ]);
    });

    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.getByText("training2")).toBeInTheDocument();
    expect(subject.getByText("training3")).toBeInTheDocument();
    expect(subject.getByText("training4")).toBeInTheDocument();
    expect(subject.getByText("online training")).toBeInTheDocument();
  });

  it("uses zip code radius results to filter by radius", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "10" },
    });

    fireEvent.change(getZipInput(subject), {
      target: { value: "11111" },
    });

    fireEvent.blur(getZipInput(subject));

    act(() => stubClient.capturedObserver.onSuccess(["11111", "22222"]));

    expect(stubClient.capturedSearchArea).toEqual({ center: "11111", radius: "10" });
    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
  });

  it("filters on blur of either field if both are filled in", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "10" },
    });
    fireEvent.change(getZipInput(subject), {
      target: { value: "11111" },
    });
    fireEvent.blur(getDistanceInput(subject));
    act(() => stubClient.capturedObserver.onSuccess(["11111", "22222"]));

    expect(stubClient.capturedSearchArea).toEqual({ center: "11111", radius: "10" });
    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
    expect(subject.queryByText("online training")).toBeInTheDocument();
  });

  it("does not filter if both fields are not filled in", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "10" },
    });
    fireEvent.blur(getDistanceInput(subject));
    expect(stubClient.getZipcodesInRadiusWasCalled).toBe(false);

    fireEvent.change(getDistanceInput(subject), {
      target: { value: "" },
    });
    fireEvent.change(getZipInput(subject), {
      target: { value: "11111" },
    });
    fireEvent.blur(getZipInput(subject));
    expect(stubClient.getZipcodesInRadiusWasCalled).toBe(false);
  });

  it("always includes online trainings", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "10" },
    });

    fireEvent.change(getZipInput(subject), {
      target: { value: "99999" },
    });

    fireEvent.blur(getZipInput(subject));
    act(() => stubClient.capturedObserver.onSuccess([]));

    expect(subject.queryByText("online training")).toBeInTheDocument();
    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
  });

  it("updates a filter when changed", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "10" },
    });

    fireEvent.change(getZipInput(subject), {
      target: { value: "11111" },
    });

    fireEvent.blur(getZipInput(subject));
    act(() => stubClient.capturedObserver.onSuccess(["11111", "22222"]));

    fireEvent.change(getDistanceInput(subject), {
      target: { value: "10" },
    });
    fireEvent.change(getZipInput(subject), {
      target: { value: "22222" },
    });
    fireEvent.blur(getZipInput(subject));
    act(() => stubClient.capturedObserver.onSuccess(["11111", "22222", "33333"]));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
    expect(subject.queryByText("online training")).toBeInTheDocument();
  });

  it("removes a filter when empty", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "10" },
    });

    fireEvent.change(getZipInput(subject), {
      target: { value: "11111" },
    });

    fireEvent.blur(getZipInput(subject));
    act(() => stubClient.capturedObserver.onSuccess(["11111", "22222"]));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
    expect(subject.queryByText("online training")).toBeInTheDocument();

    fireEvent.change(getDistanceInput(subject), {
      target: { value: "" },
    });

    fireEvent.change(getZipInput(subject), {
      target: { value: "" },
    });

    fireEvent.blur(getZipInput(subject));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).toBeInTheDocument();
    expect(subject.queryByText("online training")).toBeInTheDocument();
  });

  it("filters on enter key", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "10" },
    });

    fireEvent.change(getZipInput(subject), {
      target: { value: "11111" },
    });

    fireEvent.blur(getZipInput(subject));

    fireEvent.keyDown(getZipInput(subject), {
      key: "Enter",
      code: "Enter",
    });
    act(() => stubClient.capturedObserver.onSuccess(["11111", "22222"]));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
    expect(subject.queryByText("online training")).toBeInTheDocument();
  });

  it("changes result count when filtering", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "10" },
    });
    fireEvent.change(getZipInput(subject), {
      target: { value: "11111" },
    });
    fireEvent.blur(getZipInput(subject));
    act(() => stubClient.capturedObserver.onSuccess(["11111", "22222"]));

    expect(subject.getByText('3 results found for "some-query"')).toBeInTheDocument();
  });

  it("shows an error message if zip code API fails", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "10" },
    });
    fireEvent.change(getZipInput(subject), {
      target: { value: "11111" },
    });
    fireEvent.blur(getZipInput(subject));
    act(() => stubClient.capturedObserver.onError(Error.SYSTEM_ERROR));

    expect(subject.getByText("This feature is currently unavailable")).toBeInTheDocument();

    fireEvent.blur(getZipInput(subject));
    act(() => stubClient.capturedObserver.onSuccess(["11111", "22222"]));

    expect(subject.queryByText("This feature is currently unavailable")).not.toBeInTheDocument();
  });
});
