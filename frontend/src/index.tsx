import React from "react";
import ReactDOM from "react-dom";
import "@newjersey/njwds/dist/css/styles.css";
import "./styles/index.scss";
import * as serviceWorker from "./serviceWorker";
import { App } from "./App";
import { ApiClient } from "./ApiClient";
import { createTheme, ThemeProvider } from "@material-ui/core";
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

/*  if (navigator.userAgent === 'ReactSnap') {
    // Define snapSaveState function
    window.snapSaveState = () => {
      // Custom logic to determine if the page is ready
      return new Promise(resolve => {
        const checkDataLoaded = setInterval(() => {
          // Assuming there is some global state or condition to check
          if (window.isDataLoaded) { // You should set this flag true wherever your data finishes loading
            clearInterval(checkDataLoaded);
            resolve();
          }
        }, 100); // Check every 100 milliseconds
      });
    };
  }*/

  ReactDOM.render(
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <App client={apiClient} />
        </ThemeProvider>
      </React.StrictMode>,
      document.getElementById("root"),
  );

  serviceWorker.unregister();
}
