import { navigate, RouteComponentProps, Link } from "@reach/router";
import React, { ReactElement } from "react";
import { Searchbar } from "../components/Searchbar";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import IconOccupation from "./landing-icons/occupations.svg";
import IconFunding from "./landing-icons/funding.svg";
import IconCounseling from "./landing-icons/counseling.svg";
import { Icon } from "@material-ui/core";

export const LandingPage = (props: RouteComponentProps): ReactElement => {
  return (
    <>
      <Header />
      <BetaBanner />

      <main className="below-banners" role="main">
        <div className="bg-light-green pvl">
          <div className="container search-container fdc fac fjc mtm mbl">
            <h2 className="text-xl weight-400 align-center mbd title">
              Find training to better prepare you for a promotion, better job, or even a career
              change
            </h2>
            <Searchbar
              className="width-100 phm"
              onSearch={(searchQuery: string): Promise<void> =>
                navigate(`/search/${encodeURIComponent(searchQuery)}`)
              }
              placeholder="Enter occupation, certification, or provider"
              stacked={true}
            />
          </div>
        </div>

        <div className="container options-container">
          <div className="col-md-4 fdc fac mvl">
            <div className="landing-image mbs">
              <img className="" alt="" src={IconOccupation} />
            </div>
            <h3 className="text-l weight-400">In-Demand Occupations</h3>
            <p className="phm align-center options-desc">
              Find New Jersey's fastest growing occupations
            </p>
            <Link className="link-as-button weight-500" to="/in-demand-occupations">
              View Occupations
            </Link>
          </div>
          <div className="col-md-4 fdc fac mvl">
            <div className="landing-image mbs">
              <img className="" alt="" src={IconFunding} />
            </div>
            <h3 className="text-l weight-400">Explore Funding Assistance</h3>
            <p className="phm align-center options-desc">
              Apply for funding to cover your training costs
            </p>
            <Link className="link-as-button weight-500" to="/funding">
              Learn More
            </Link>
          </div>
          <div className="col-md-4 fdc fac mvl">
            <div className="landing-image mbs">
              <img className="" alt="" src={IconCounseling} />
            </div>
            <h3 className="text-l weight-400">Connect with a Counselor</h3>
            <p className="phm align-center options-desc">
              Find out about training counseling and funding qualifications
            </p>
            <a
              className="link-as-button weight-500"
              target="_blank"
              rel="noopener noreferrer"
              href="https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml"
            >
              Find Counseling&nbsp;
              <Icon>launch</Icon>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
