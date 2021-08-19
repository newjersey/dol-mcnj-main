import React, { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { ErrorPage } from "./ErrorPage";
import { ErrorPageStrings } from "../localizations/ErrorPageStrings";

export const NotFoundPage = (props: RouteComponentProps): ReactElement => {
  return (
    <ErrorPage headerText={ErrorPageStrings.notFoundHeader}>
      <>
        <p>{ErrorPageStrings.notFoundText}</p>
        <p>
          <a className="link-format-blue" href="/">
            {ErrorPageStrings.notFoundLink1}
          </a>
        </p>
        <p>
          <a
            className="link-format-blue"
            href="https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml"
          >
            {ErrorPageStrings.notFoundLink2}
          </a>
        </p>
      </>
    </ErrorPage>
  );
};
