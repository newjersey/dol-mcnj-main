import React, { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { ErrorPage } from "./ErrorPage";

export const NotFoundPage = (props: RouteComponentProps): ReactElement => {
  return (
    <ErrorPage headerText="Sorry, we can't seem to find that page">
      <>
        <p>Try one of these instead:</p>
        <p>
          <a className="link-format-blue" href="/">
            Search for a training opportunity
          </a>
        </p>
        <p>
          <a
            className="link-format-blue"
            href="https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml"
          >
            Look up your local One-Stop Career Center
          </a>
        </p>
      </>
    </ErrorPage>
  );
};
