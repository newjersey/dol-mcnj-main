import { navigate, RouteComponentProps } from "@reach/router";
import React, { ReactElement } from "react";
import { Searchbar } from "../components/Searchbar";
import njLogo from "../njlogo.svg";
import { useMediaQuery } from "@material-ui/core";

export const LandingPage = (props: RouteComponentProps): ReactElement => {
  const isSmallWidescreen = useMediaQuery("(min-width:992px) and (max-width:1100px)");
  const isMobile = useMediaQuery("(max-width:768px)");
  const shouldStackSearchButton = isMobile || isSmallWidescreen;

  return (
    <>
      <div className="gutter-filler-left bg-light-green" />
      <div className="container landing-container height-full">
        <div className="row landing-row height-100">
          <div className="col-md-6 bg-light-green fdc fjc height-100 col-adjust">
            <div className="maxl">
              <div className="fdr fjc mbd">
                <img
                  className="nj-logo-landing mrd"
                  src={njLogo}
                  alt="New Jersey innovation logo"
                />
                <h1 className="text-xxl">
                  Training
                  <br />
                  Explorer
                </h1>
              </div>
              <div className="mlm">
                <h2 className="fdr fjc text-xl weight-400">
                  Find the training you need to get the job that you want
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 height-100 fdc fjc col-adjust">
            <div className="adjustable-margin-left">
              <div className="mhl mvxl">
                <h2 className="text-xl section-header">Search for Training</h2>
                <p className="text-m">
                  Find training to prepare you for a promotion, better job, or even a career change
                </p>
                <Searchbar
                  onSearch={(searchQuery: string): Promise<void> =>
                    navigate(`/search/${searchQuery}`)
                  }
                  stacked={shouldStackSearchButton}
                />
              </div>
              <div className="grey-line" />
              <div className="mhl mvxl">
                <h2 className="text-xl section-header">
                  Get up to $4,000 from the state for your training
                </h2>

                <p className="text-m">
                  Did you know the state of New Jersey can pay for your training?
                </p>

                <p className="text-m">
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
      </div>
    </>
  );
};
