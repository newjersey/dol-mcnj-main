import {fireEvent, render, RenderResult} from "@testing-library/react";
import {buildTrainingResult} from "./test-objects/factories";
import {act} from "react-dom/test-utils";
import React, {ReactElement} from "react";
import {StubClient} from "./test-objects/StubClient";
import {App} from "./App";
import {createHistory, createMemorySource, History, LocationProvider} from "@reach/router";

interface RenderedWithRouter {
    container: RenderResult;
    history: History;
}

export function renderWithRouter(
    component: ReactElement,
    { route = '/', history = createHistory(createMemorySource(route)) } = {}
): RenderedWithRouter {
    return {
        container: render(<LocationProvider history={history}>{component}</LocationProvider>),
        history: history
    }
}

export const waitForEffect = async (): Promise<undefined> => {
    return act(async () => {
        await new Promise(resolve => setImmediate(resolve));
    });
}

describe('<App />', () => {

    let stubClient: StubClient;
    let subject: RenderResult;

    beforeEach(async () => {
        stubClient = new StubClient();
        const {container, history} = renderWithRouter(<App client={stubClient} />)
        subject = container;

        await history.navigate('/search/some-query')
        await waitForEffect()
    })

    describe('filtering by employment rate', () => {

        const training80percent = buildTrainingResult({ name: "training80", percentEmployed: .80 })
        const training79percent = buildTrainingResult({ name: "training79", percentEmployed: .79 })
        const training60percent = buildTrainingResult({ name: "training60", percentEmployed: .60 })
        const training59percent = buildTrainingResult({ name: "training59", percentEmployed: .59 })
        const training1percent = buildTrainingResult({ name: "training1", percentEmployed: .01 })
        const trainingNoData = buildTrainingResult({ name: "training no data", percentEmployed: undefined })

        beforeEach(async () => {
          act(() => {
            stubClient.capturedObserver.onSuccess([
              training80percent,
              training79percent,
              training60percent,
              training59percent,
              training1percent,
              trainingNoData
            ])
          });

          expect(subject.getByText("training80")).toBeInTheDocument();
          expect(subject.getByText("training79")).toBeInTheDocument();
          expect(subject.getByText("training60")).toBeInTheDocument();
          expect(subject.getByText("training59")).toBeInTheDocument();
          expect(subject.getByText("training1")).toBeInTheDocument();
          expect(subject.getByText("training no data")).toBeInTheDocument();
        })

        it("filters by best employment rate", async () => {
          fireEvent.click(subject.getByLabelText("Best"))

          expect(subject.queryByText("training80")).toBeInTheDocument();
          expect(subject.queryByText("training79")).not.toBeInTheDocument();
          expect(subject.queryByText("training60")).not.toBeInTheDocument();
          expect(subject.queryByText("training59")).not.toBeInTheDocument();
          expect(subject.queryByText("training1")).not.toBeInTheDocument();
          expect(subject.queryByText("training no data")).not.toBeInTheDocument();
        })

      it("filters by medium employment rate", async () => {
        fireEvent.click(subject.getByLabelText("Medium"))

        expect(subject.queryByText("training80")).not.toBeInTheDocument();
        expect(subject.queryByText("training79")).toBeInTheDocument();
        expect(subject.queryByText("training60")).toBeInTheDocument();
        expect(subject.queryByText("training59")).not.toBeInTheDocument();
        expect(subject.queryByText("training1")).not.toBeInTheDocument();
        expect(subject.queryByText("training no data")).not.toBeInTheDocument();
      })

      it("filters by low employment rate", async () => {
        fireEvent.click(subject.getByLabelText("Low"))

        expect(subject.queryByText("training80")).not.toBeInTheDocument();
        expect(subject.queryByText("training79")).not.toBeInTheDocument();
        expect(subject.queryByText("training60")).not.toBeInTheDocument();
        expect(subject.queryByText("training59")).toBeInTheDocument();
        expect(subject.queryByText("training1")).toBeInTheDocument();
        expect(subject.queryByText("training no data")).not.toBeInTheDocument();
      })

      it("filters by no data employment rate", async () => {
        fireEvent.click(subject.getByLabelText("No Data"))

        expect(subject.queryByText("training80")).not.toBeInTheDocument();
        expect(subject.queryByText("training79")).not.toBeInTheDocument();
        expect(subject.queryByText("training60")).not.toBeInTheDocument();
        expect(subject.queryByText("training59")).not.toBeInTheDocument();
        expect(subject.queryByText("training1")).not.toBeInTheDocument();
        expect(subject.queryByText("training no data")).toBeInTheDocument();
      })

      it("does not filter when all or none are checked", async () => {
        fireEvent.click(subject.getByLabelText("Best"))
        fireEvent.click(subject.getByLabelText("Medium"))
        fireEvent.click(subject.getByLabelText("Low"))
        fireEvent.click(subject.getByLabelText("No Data"))

        expect(subject.getByText("training80")).toBeInTheDocument();
        expect(subject.getByText("training79")).toBeInTheDocument();
        expect(subject.getByText("training60")).toBeInTheDocument();
        expect(subject.getByText("training59")).toBeInTheDocument();
        expect(subject.getByText("training1")).toBeInTheDocument();
        expect(subject.getByText("training no data")).toBeInTheDocument();

        fireEvent.click(subject.getByLabelText("Best"))
        fireEvent.click(subject.getByLabelText("Medium"))
        fireEvent.click(subject.getByLabelText("Low"))
        fireEvent.click(subject.getByLabelText("No Data"))

        expect(subject.getByText("training80")).toBeInTheDocument();
        expect(subject.getByText("training79")).toBeInTheDocument();
        expect(subject.getByText("training60")).toBeInTheDocument();
        expect(subject.getByText("training59")).toBeInTheDocument();
        expect(subject.getByText("training1")).toBeInTheDocument();
        expect(subject.getByText("training no data")).toBeInTheDocument();
      })

      it("combines filters", async () => {
        fireEvent.click(subject.getByLabelText("Best"))

        expect(subject.queryByText("training80")).toBeInTheDocument();
        expect(subject.queryByText("training79")).not.toBeInTheDocument();
        expect(subject.queryByText("training60")).not.toBeInTheDocument();
        expect(subject.queryByText("training59")).not.toBeInTheDocument();
        expect(subject.queryByText("training1")).not.toBeInTheDocument();
        expect(subject.queryByText("training no data")).not.toBeInTheDocument();

        fireEvent.click(subject.getByLabelText("Medium"))

        expect(subject.getByText("training80")).toBeInTheDocument();
        expect(subject.getByText("training79")).toBeInTheDocument();
        expect(subject.getByText("training60")).toBeInTheDocument();
        expect(subject.queryByText("training59")).not.toBeInTheDocument();
        expect(subject.queryByText("training1")).not.toBeInTheDocument();
        expect(subject.queryByText("training no data")).not.toBeInTheDocument();
      })
    })

    describe('filtering by max cost', () => {

        const training1999 = buildTrainingResult({ name: "training1999", totalCost: 1999 })
        const training2000 = buildTrainingResult({ name: "training2000", totalCost: 2000 })
        const training2001 = buildTrainingResult({ name: "training2001", totalCost: 2001 })
        const training5000 = buildTrainingResult({ name: "training5000", totalCost: 5000 })

        const getMaxCostInput = (subject: RenderResult): HTMLElement => {
            return subject.getByLabelText("Max Cost", {exact: false})
        }

        beforeEach(async () => {
            act(() => {
                stubClient.capturedObserver.onSuccess([
                  training1999,
                  training2000,
                  training2001,
                  training5000
                ])
            });

            expect(subject.getByText("training1999")).toBeInTheDocument();
            expect(subject.getByText("training2000")).toBeInTheDocument();
            expect(subject.getByText("training2001")).toBeInTheDocument();
            expect(subject.getByText("training5000")).toBeInTheDocument();
        })

        it("filters by maximum cost, inclusively", async () => {
            fireEvent.change(getMaxCostInput(subject), {
                target: { value: "2000" },
            });
            fireEvent.blur(getMaxCostInput(subject));

            expect(subject.queryByText("training1999")).toBeInTheDocument();
            expect(subject.queryByText("training2000")).toBeInTheDocument();
            expect(subject.queryByText("training2001")).not.toBeInTheDocument();
            expect(subject.queryByText("training5000")).not.toBeInTheDocument();
        })

        it("updates a filter when changed", async () => {

            fireEvent.change(getMaxCostInput(subject), {
                target: { value: "2000" },
            });
            fireEvent.blur(getMaxCostInput(subject));

            fireEvent.change(getMaxCostInput(subject), {
                target: { value: "3000" },
            });
            fireEvent.blur(getMaxCostInput(subject));

            expect(subject.queryByText("training1999")).toBeInTheDocument();
            expect(subject.queryByText("training2000")).toBeInTheDocument();
            expect(subject.queryByText("training2001")).toBeInTheDocument();
            expect(subject.queryByText("training5000")).not.toBeInTheDocument();
        })

        it("removes a filter when empty", async () => {

            fireEvent.change(getMaxCostInput(subject), {
                target: { value: "2000" },
            });
            fireEvent.blur(getMaxCostInput(subject));

            expect(subject.queryByText("training1999")).toBeInTheDocument();
            expect(subject.queryByText("training2000")).toBeInTheDocument();
            expect(subject.queryByText("training2001")).not.toBeInTheDocument();
            expect(subject.queryByText("training5000")).not.toBeInTheDocument();

            fireEvent.change(getMaxCostInput(subject), {
                target: { value: "" },
            });
            fireEvent.blur(getMaxCostInput(subject));

            expect(subject.queryByText("training1999")).toBeInTheDocument();
            expect(subject.queryByText("training2000")).toBeInTheDocument();
            expect(subject.queryByText("training2001")).toBeInTheDocument();
            expect(subject.queryByText("training5000")).toBeInTheDocument();
        })

        it("filters on enter key", async () => {

            fireEvent.change(getMaxCostInput(subject), {
                target: { value: "2000" },
            });

            fireEvent.keyDown(getMaxCostInput(subject), {
                key: "Enter",
                code: "Enter",
            });

            expect(subject.queryByText("training1999")).toBeInTheDocument();
            expect(subject.queryByText("training2000")).toBeInTheDocument();
            expect(subject.queryByText("training2001")).not.toBeInTheDocument();
            expect(subject.queryByText("training5000")).not.toBeInTheDocument();
        })

        it("changes result count when filtering", async () => {
            expect(subject.getByText("4 results found for \"some-query\"")).toBeInTheDocument();

            fireEvent.change(getMaxCostInput(subject), {
                target: { value: "2000" },
            });
            fireEvent.blur(getMaxCostInput(subject));

            expect(subject.getByText("2 results found for \"some-query\"")).toBeInTheDocument();
        })
    })
})