import React, { ReactElement } from "react";
import { ErrorPage } from "./ErrorPage";

export const SomethingWentWrongPage = (): ReactElement => {
  return (
    <ErrorPage headerText="Sorry, something went wrong">
      <p>Please try again later</p>
    </ErrorPage>
  );
};
