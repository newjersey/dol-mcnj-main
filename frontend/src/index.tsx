import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.scss";
import * as serviceWorker from "./serviceWorker";
import { App } from "./App";
import { ApiClient } from "./ApiClient";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import "./i18n";
import ReactDOMServer from 'react-dom/server';

const password = "foo";
const isCI = process.env.IS_CI;
const isProd = process.env.IS_PROD;

if (isCI && !isProd) {
  if (prompt("Enter password:") == password) {
    const apiClient = new ApiClient();

    const theme = createMuiTheme({
      palette: {
        primary: {
          main: "#12263A",
        },
        secondary: {
          main: "#1668B4",
        },
      },
    });

    ReactDOM.render(
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <App client={apiClient} />
        </ThemeProvider>
      </React.StrictMode>,
      document.getElementById("root")
    );

    serviceWorker.unregister();
  }
} else {
  const apiClient = new ApiClient();

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#12263A",
      },
      secondary: {
        main: "#1668B4",
      },
    },
  });

  ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App client={apiClient} />
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );

  serviceWorker.unregister();
}