import { navigate, RouteComponentProps } from "@reach/router";
import React, { ReactElement } from "react";
import { Searchbar } from "../components/Searchbar";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LinkButton } from "../components/LinkButton";
import IconOccupation from "./landing-icons/occupations.svg";
import IconWorkforce from "./landing-icons/workforce.svg";
import IconCounseling from "./landing-icons/counseling.svg";

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
              <img alt="icon-occupation" src={IconOccupation} />
            </div>
            <h3 className="text-l weight-400">For Training Explorers</h3>
            <p className="phm align-center options-desc">
              Find New Jersey’s fastest growing occupations
            </p>
            <LinkButton to="/explorer" secondary>
              Learn More
            </LinkButton>
          </div>
          <div className="col-md-4 fdc fac mvl">
            <div className="landing-image mbs">
              <img alt="icon-counseling" src={IconCounseling} />
            </div>
            <h3 className="text-l weight-400">For Counselors and Coaches</h3>
            <p className="phm align-center options-desc">
              Empower your search to find training information more quickly
            </p>
            <LinkButton to="/counselor" secondary>
              Explore the Tool
            </LinkButton>
          </div>
          <div className="col-md-4 fdc fac mvl">
            <div className="landing-image mbs">
              <img alt="icon-workforce" src={IconWorkforce} />
            </div>
            <h3 className="text-l weight-400">For Training Providers</h3>
            <p className="phm align-center options-desc">
              Learn about the process to get on NJ’s Eligible Training Provider List
            </p>
            <LinkButton to="/training-provider" secondary>
              Find More Information
            </LinkButton>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
