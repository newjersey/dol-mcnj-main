import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.scss";
import * as serviceWorker from "./serviceWorker";
import { App } from "./App";
import { ApiClient } from "./ApiClient";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const apiClient = new ApiClient();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#12263A",
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
