import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { Observer, Client } from "./Client";
import { act } from "react-dom/test-utils";

describe("<App />", () => {
  it("displays list of program names", async () => {
    const stubClient = new StubClient();
    const subject = render(<App client={stubClient} />);

    act(() => stubClient.capturedObserver.onSuccess(["program1", "program2"]));

    expect(subject.getByText("program1", { exact: false })).toBeInTheDocument();
    expect(subject.getByText("program2", { exact: false })).toBeInTheDocument();
  });
});

class StubClient implements Client {
  capturedObserver: Observer<string[]> = {
    onError: () => {},
    onSuccess: () => {},
  };

  getPrograms(observer: Observer<string[]>): void {
    this.capturedObserver = observer;
  }
}
