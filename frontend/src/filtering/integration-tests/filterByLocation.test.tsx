import { StubClient } from "../../test-objects/StubClient";
import { App } from "../../App";
import React from "react";
import { buildTrainingResult } from "../../test-objects/factories";
import { act } from "react-dom/test-utils";
import { fireEvent, RenderResult } from "@testing-library/react";
import { waitForEffect, renderWithRouter } from "../../test-objects/helpers";
import { SearchAndFilterStrings } from "../../localizations/SearchAndFilterStrings";
import * as findZipCodesInRadiusModule from "../findZipCodesInRadius";

describe("filtering by location", () => {
  const training1 = buildTrainingResult({ name: "training1", zipCode: "07021", online: false }); // 0 mi from 07021
  const training2 = buildTrainingResult({ name: "training2", zipCode: "07004", online: false }); // 4.91 mi from 07021
  const training3 = buildTrainingResult({ name: "training3", zipCode: "07930", online: false }); // 21 mi from 07021
  const training4 = buildTrainingResult({ name: "training4", zipCode: "08514", online: false }); // 49 mi from 07021
  const training5 = buildTrainingResult({ name: "training5", zipCode: "08212", online: false }); // 135 mi from 07021
  const training6 = buildTrainingResult({ name: "training6", zipCode: "07014", online: false }); // 7.91 mi from 07021

  const onlineTraining = buildTrainingResult({
    name: "online training",
    zipCode: "random-zipcode",
    online: true,
  });

  const getDistanceInput = (subject: RenderResult): HTMLElement => {
    return subject.getByLabelText(SearchAndFilterStrings.locationFilterMilesInputLabel);
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
        training5,
        training6,
        onlineTraining,
      ]);
    });

    expect(subject.getByText("training1")).toBeInTheDocument();
    expect(subject.getByText("training2")).toBeInTheDocument();
    expect(subject.getByText("training3")).toBeInTheDocument();
    expect(subject.getByText("training4")).toBeInTheDocument();
    expect(subject.getByText("training5")).toBeInTheDocument();
    expect(subject.getByText("training6")).toBeInTheDocument();
    expect(subject.getByText("online training")).toBeInTheDocument();
  });

  it("shows an error message on blur if zip code is non-empty and not 5 digits starting with 0[7or8]", async () => {
    const spy = jest.spyOn(findZipCodesInRadiusModule, "getZipCodesInRadius").mockReturnValue([]);

    fireEvent.change(getZipInput(subject), {
      target: { value: "11111" },
    });
    fireEvent.blur(getZipInput(subject));
    expect(
      subject.getByText(SearchAndFilterStrings.locationFilterZipCodeInvalid)
    ).toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();

    fireEvent.change(getZipInput(subject), {
      target: { value: "070001" },
    });
    fireEvent.blur(getZipInput(subject));
    expect(
      subject.getByText(SearchAndFilterStrings.locationFilterZipCodeInvalid)
    ).toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();

    fireEvent.change(getZipInput(subject), {
      target: { value: "07001" },
    });
    fireEvent.blur(getZipInput(subject));
    expect(
      subject.queryByText(SearchAndFilterStrings.locationFilterZipCodeInvalid)
    ).not.toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(1);

    fireEvent.change(getZipInput(subject), {
      target: { value: "0700" },
    });
    fireEvent.blur(getZipInput(subject));
    expect(
      subject.getByText(SearchAndFilterStrings.locationFilterZipCodeInvalid)
    ).toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(1);

    fireEvent.change(getZipInput(subject), {
      target: { value: "09001" },
    });
    fireEvent.blur(getZipInput(subject));
    expect(
      subject.getByText(SearchAndFilterStrings.locationFilterZipCodeInvalid)
    ).toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(1);

    fireEvent.change(getZipInput(subject), {
      target: { value: "08001" },
    });
    fireEvent.blur(getZipInput(subject));
    expect(
      subject.queryByText(SearchAndFilterStrings.locationFilterZipCodeInvalid)
    ).not.toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockRestore();
  });

  it("uses zip code radius results to filter by radius of 5 miles", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "5" },
    });

    fireEvent.change(getZipInput(subject), {
      target: { value: "07021" },
    });

    fireEvent.blur(getZipInput(subject));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
    expect(subject.queryByText("training5")).not.toBeInTheDocument();
    expect(subject.queryByText("training6")).not.toBeInTheDocument();
  });

  it("uses zip code radius results to filter by radius of 10 miles (DEFAULT)", async () => {
    fireEvent.change(getZipInput(subject), {
      target: { value: "07021" },
    });

    fireEvent.blur(getZipInput(subject));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
    expect(subject.queryByText("training5")).not.toBeInTheDocument();
    expect(subject.queryByText("training6")).toBeInTheDocument();
  });

  it("uses zip code radius results to filter by radius of 25 miles", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "25" },
    });

    fireEvent.change(getZipInput(subject), {
      target: { value: "07021" },
    });

    fireEvent.blur(getZipInput(subject));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
    expect(subject.queryByText("training5")).not.toBeInTheDocument();
    expect(subject.queryByText("training6")).toBeInTheDocument();
  });

  it("uses zip code radius results to filter by radius of 50 miles", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "50" },
    });

    fireEvent.change(getZipInput(subject), {
      target: { value: "07021" },
    });

    fireEvent.blur(getZipInput(subject));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).toBeInTheDocument();
    expect(subject.queryByText("training5")).not.toBeInTheDocument();
    expect(subject.queryByText("training6")).toBeInTheDocument();
  });

  it("filters on blur of either field if both are filled in", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "50" },
    });

    fireEvent.change(getZipInput(subject), {
      target: { value: "07021" },
    });

    fireEvent.blur(getZipInput(subject));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).toBeInTheDocument();
    expect(subject.queryByText("training5")).not.toBeInTheDocument();
    expect(subject.queryByText("training6")).toBeInTheDocument();
  });

  it("does not filter if ZIP field is empty", async () => {
    const spy = jest.spyOn(findZipCodesInRadiusModule, "getZipCodesInRadius").mockReturnValue([]);

    fireEvent.change(getDistanceInput(subject), {
      target: { value: "10" },
    });
    fireEvent.blur(getDistanceInput(subject));
    expect(spy).not.toHaveBeenCalled();

    fireEvent.change(getZipInput(subject), {
      target: { value: "07001" },
    });
    fireEvent.blur(getZipInput(subject));
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it("always includes online trainings", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "5" },
    });
    fireEvent.change(getZipInput(subject), {
      target: { value: "08212" },
    });
    fireEvent.blur(getZipInput(subject));

    expect(subject.queryByText("online training")).toBeInTheDocument();
    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
    expect(subject.queryByText("training5")).toBeInTheDocument();
    expect(subject.queryByText("training6")).not.toBeInTheDocument();
  });

  it("updates a filter when ZIP changed", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "1" },
    });
    fireEvent.change(getZipInput(subject), {
      target: { value: "07021" },
    });
    fireEvent.blur(getZipInput(subject));

    fireEvent.change(getZipInput(subject), {
      target: { value: "08212" },
    });
    fireEvent.blur(getZipInput(subject));

    expect(subject.queryByText("training1")).not.toBeInTheDocument();
    expect(subject.queryByText("training2")).not.toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
    expect(subject.queryByText("online training")).toBeInTheDocument();
    expect(subject.queryByText("training5")).toBeInTheDocument();
    expect(subject.queryByText("training6")).not.toBeInTheDocument();
  });

  it("updates a filter when radius changed", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "1" },
    });
    fireEvent.change(getZipInput(subject), {
      target: { value: "07021" },
    });

    fireEvent.blur(getZipInput(subject));

    fireEvent.change(getDistanceInput(subject), {
      target: { value: "5" },
    });

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
    expect(subject.queryByText("online training")).toBeInTheDocument();
    expect(subject.queryByText("training5")).not.toBeInTheDocument();
    expect(subject.queryByText("training6")).not.toBeInTheDocument();
  });

  it("removes a filter when ZIP code is empty", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "5" },
    });
    fireEvent.change(getZipInput(subject), {
      target: { value: "07021" },
    });

    fireEvent.blur(getZipInput(subject));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
    expect(subject.queryByText("training5")).not.toBeInTheDocument();
    expect(subject.queryByText("training6")).not.toBeInTheDocument();
    expect(subject.queryByText("online training")).toBeInTheDocument();

    fireEvent.change(getZipInput(subject), {
      target: { value: "" },
    });
    fireEvent.blur(getZipInput(subject));

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).toBeInTheDocument();
    expect(subject.queryByText("training5")).toBeInTheDocument();
    expect(subject.queryByText("training6")).toBeInTheDocument();
    expect(subject.queryByText("online training")).toBeInTheDocument();
  });

  it("filters on enter key", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "5" },
    });

    fireEvent.change(getZipInput(subject), {
      target: { value: "07021" },
    });

    fireEvent.keyDown(getZipInput(subject), {
      key: "Enter",
      code: "Enter",
    });

    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).not.toBeInTheDocument();
    expect(subject.queryByText("training4")).not.toBeInTheDocument();
    expect(subject.queryByText("training5")).not.toBeInTheDocument();
    expect(subject.queryByText("training6")).not.toBeInTheDocument();
    expect(subject.queryByText("online training")).toBeInTheDocument();
  });

  it("changes result count when filtering", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "5" },
    });
    fireEvent.change(getZipInput(subject), {
      target: { value: "07021" },
    });
    fireEvent.blur(getZipInput(subject));

    expect(subject.getByText('3 results found for "some-query"')).toBeInTheDocument();
  });

  it("removes filter when clear all button is clicked", async () => {
    fireEvent.change(getDistanceInput(subject), {
      target: { value: "5" },
    });
    fireEvent.change(getZipInput(subject), {
      target: { value: "07021" },
    });
    fireEvent.blur(getZipInput(subject));

    fireEvent.click(subject.getByText(SearchAndFilterStrings.clearAllFiltersButtonLabel));

    expect(getZipInput(subject)).toHaveValue("");
    expect(subject.queryByText("training1")).toBeInTheDocument();
    expect(subject.queryByText("training2")).toBeInTheDocument();
    expect(subject.queryByText("training3")).toBeInTheDocument();
    expect(subject.queryByText("training4")).toBeInTheDocument();
    expect(subject.queryByText("training5")).toBeInTheDocument();
    expect(subject.queryByText("training6")).toBeInTheDocument();
  });
});
