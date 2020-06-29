import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { Observer, Client } from "./domain/Client";
import { act } from "react-dom/test-utils";
import { buildProgram } from "./test-helpers/factories";
import { Program } from "./domain/Program";

describe("<App />", () => {
  it("displays list of program names and their data", async () => {
    const stubClient = new StubClient();
    const subject = render(<App client={stubClient} />);

    const program1 = buildProgram({
      name: "program1",
      totalCost: 1000,
      percentEmployed: 0.6018342,
    });
    const program2 = buildProgram({
      name: "program2",
      totalCost: 333.33,
      percentEmployed: 0.8,
    });
    act(() => stubClient.capturedObserver.onSuccess([program1, program2]));

    expect(subject.getByText("program1", { exact: false })).toBeInTheDocument();
    expect(
      subject.getByText("$1,000.00", { exact: false })
    ).toBeInTheDocument();
    expect(subject.getByText("60.1%", { exact: false })).toBeInTheDocument();

    expect(subject.getByText("program2", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("$333.33", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("80.0%", { exact: false })).toBeInTheDocument();
  });

  it("displays percent employed as '--' when it is null", async () => {
    const stubClient = new StubClient();
    const subject = render(<App client={stubClient} />);

    act(() =>
      stubClient.capturedObserver.onSuccess([
        buildProgram({ percentEmployed: null }),
      ])
    );

    expect(subject.getByText("--", { exact: false })).toBeInTheDocument();
  });
});

class StubClient implements Client {
  capturedObserver: Observer<Program[]> = {
    onError: () => {},
    onSuccess: () => {},
  };

  getPrograms(observer: Observer<Program[]>): void {
    this.capturedObserver = observer;
  }
}
