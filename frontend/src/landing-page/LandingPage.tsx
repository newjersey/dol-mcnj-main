import { navigate, RouteComponentProps } from "@reach/router";
import React, { ReactElement } from "react";
import { Searchbar } from "../components/Searchbar";
import njLogo from "../njlogo.svg";

export const LandingPage = (props: RouteComponentProps): ReactElement => {
  return (
    <div className="fdr">
      <div className="split fdc fac bg-light-green">
        <div className="paxxl">
          <div className="fdr fjc fac mhl mtxxl mbd">
            <img className="nj-logo-landing mrd" src={njLogo} alt="New Jersey innovation logo" />
            <h1>
              Training
              <br />
              Explorer
            </h1>
          </div>
          <div>
            <h2 className="subtitle mld">
              Find the training you need to
              <br />
              get the job that you want
            </h2>
          </div>
        </div>
      </div>
      <div className="split">
        <div className="paxxl">
          <div className="mhl mvxl prxl">
            <h2 className="subtitle">Search for Training</h2>
            <p className="info">
              Find training to prepare you for a promotion, better job, or even a career change
            </p>
            <Searchbar
              onSearch={(searchQuery: string): Promise<void> => navigate(`/search/${searchQuery}`)}
            />
          </div>
          <hr />
          <div className="mhl mvxl prxxl">
            <h2 className="subtitle">Get up to $4,000 from the state for your training</h2>

            <p className="info">Did you know the state of New Jersey can pay for your training?</p>

            <p className="info">
              To see if you qualify for a tuition waiver or voucher,&nbsp;
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml"
              >
                reach out to your local One-Stop Career center
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
