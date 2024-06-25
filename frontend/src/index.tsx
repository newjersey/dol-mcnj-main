import React from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from 'react-helmet-async';
import "@newjersey/njwds/dist/css/styles.css";
import "./styles/index.scss";
import * as serviceWorker from "./serviceWorker";
import { App } from "./App";
import { ApiClient } from "./ApiClient";
import { unstable_createMuiStrictModeTheme as createTheme, ThemeProvider } from "@material-ui/core";
import "./i18n";

const password = process.env.DEV_PASS;
const isCI = process.env.IS_CI;
const isProd = process.env.DB_NAME === "d4adprod" ? true : false;

// If env is running in CI and is not a prod environment, prompt for password in env var DEV_PASS
if (isCI && !isProd ? prompt("Enter password:") === password : true) {
  const apiClient = new ApiClient();

  const theme = createTheme({
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
    <HelmetProvider>
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <App client={apiClient} />
        </ThemeProvider>
      </React.StrictMode>
    </HelmetProvider>,
    document.getElementById("root"),
  );

  serviceWorker.unregister();
}
