import React, { ReactElement } from "react";
import { ErrorPage } from "./ErrorPage";
import { ErrorPageStrings } from "../localizations/ErrorPageStrings";

export const SomethingWentWrongPage = (): ReactElement => {
  return (
    <ErrorPage headerText={ErrorPageStrings.somethingWentWrongHeader}>
      <p>{ErrorPageStrings.somethingWentWrongText}</p>
    </ErrorPage>
  );
};
