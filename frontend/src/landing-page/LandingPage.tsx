import { navigate, RouteComponentProps, Link } from "@reach/router";
import React, { ReactElement } from "react";
import { Searchbar } from "../components/Searchbar";
import njLogo from "../njlogo.svg";
import { useMediaQuery } from "@material-ui/core";
import { BetaBanner } from "../components/BetaBanner";

export const LandingPage = (props: RouteComponentProps): ReactElement => {
  const isSmallMobile = useMediaQuery("(max-width:482px)");
  const isTablet = useMediaQuery("(min-width:768px) and (max-width:1200px)");
  const shouldStackSearchButton = isSmallMobile || isTablet;

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
                    navigate(`/search/${encodeURIComponent(searchQuery)}`)
                  }
                  stacked={shouldStackSearchButton}
                  smallButton={!shouldStackSearchButton}
                />
              </div>
              <div className="grey-line mvm" />
              <div className="pvl">
                <h2 className="text-xl weight-500 section-header">
                  Get up to $4,000 from the state for your training
                </h2>

                <p className="text-m">
                  Did you know the state of New Jersey offers discounted training for&nbsp;
                  <Link className="link-format-blue" to="/in-demand-careers">
                    in-demand careers
                  </Link>
                  ?
                </p>

                <p className="text-m">
                  If you are interested in exploring funding opportunities,&nbsp;
                  <Link className="link-format-blue" to="/funding">
                    learn more
                  </Link>
                  &nbsp;about what the State has to offer.
                </p>

                <p className="text-m">
                  To see if you qualify for a tuition waiver or voucher,&nbsp;
                  <a
                    className="link-format-blue"
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
