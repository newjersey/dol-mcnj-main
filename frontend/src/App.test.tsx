import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import axios from 'axios';
import {act} from "react-dom/test-utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
function flushPromises(): Promise<any> {
  return new Promise(resolve => setImmediate(resolve));
}

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('<App />', () => {
  it('pongs from the server', async () => {
    mockedAxios.get.mockResolvedValue({ data: {message: "pong"} });
    const subject = render(<App />);

    await act(flushPromises);

    expect(subject.getByText("pong", {exact: false})).toBeInTheDocument();
  });
});
