import React, { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Header } from "../search-results/Header";

export const NotFoundPage = (props: RouteComponentProps): ReactElement => {
  return (
    <>
      <Header />
      <div className="container below-header">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <div className="alert-box mtxl">
              <div className="rounded-top bg-light-green pal fdr fac">
                <i className="material-icons error-icon mrs">error</i>
                <h2 className="text-xl">Sorry, we can't seem to find that page</h2>
              </div>
              <div className="pal">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
