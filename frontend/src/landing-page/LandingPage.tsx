import { navigate, RouteComponentProps } from "@reach/router";
import React, { ReactElement } from "react";
import { Searchbar } from "../components/Searchbar";
import njLogo from "../njlogo.svg";
import { useMediaQuery } from "@material-ui/core";
import { BetaBanner } from "../components/BetaBanner";

export const LandingPage = (props: RouteComponentProps): ReactElement => {
  const isWidescreen = useMediaQuery("(min-width:1100px)");
  const shouldStackSearchButton = !isWidescreen;

  return (
    <>
      <BetaBanner noHeader={true} />

      <div className="gutter-filler-left bg-light-green" />
      <div className="container">
        <div className="row">
          <div className="col-sm-6 bg-light-green col-adjust fdc fjc full-height-column">
            <header className="pvxl">
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
              <div className="subtitle-adjust">
                <h2 className="fdr fjc text-xl weight-400">
                  Find the training you need to get the job that you want
                </h2>
              </div>
            </header>
          </div>

          <div className="col-sm-6 col-adjust fdc fjc full-height-column">
            <main role="main" className="adjustable-margin-left">
              <div className="pvl">
                <h2 className="text-xl weight-500 section-header">Search for Training</h2>
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
              <div className="pvl">
                <h2 className="text-xl weight-500 section-header">
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
            </main>
          </div>
        </div>
      </div>
    </>
  );
};
