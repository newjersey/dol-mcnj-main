import {render, RenderResult} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import React, {ReactElement} from "react";
import {createHistory, createMemorySource, History, LocationProvider} from "@reach/router";

interface RenderedWithRouter {
  container: RenderResult;
  history: History;
}

export function renderWithRouter(
  component: ReactElement,
  { route = "/", history = createHistory(createMemorySource(route)) } = {}
): RenderedWithRouter {
  return {
    container: render(<LocationProvider history={history}>{component}</LocationProvider>),
    history: history,
  };
}

export const waitForEffect = async (): Promise<undefined> => {
  return act(async () => {
    await new Promise((resolve) => setImmediate(resolve));
  });
};