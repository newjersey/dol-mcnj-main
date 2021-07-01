import React, { ReactElement } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LinkButton } from "../components/LinkButton";
import { LandingCard } from "./LandingCard";
import IconList from "./landing-icons/list.svg";
import IconOccupation from "./landing-icons/occupations.svg";
import { useMediaQuery } from "@material-ui/core";

export const LandingPageCounselor = (props: RouteComponentProps): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <div className="landing-container mla mra">
          <h2 className="mvm text-xl weight-500 align-center">
            Find Training and Educational Opportunities in New Jersey
          </h2>

          <h3 className="mbd text-l weight-500 align-center">Get Started</h3>
          <p className="mbl align-center">
            The training explorer is a comprehensive list of all schools and organizations offering
            education and job training programs that are eligible to receive publicly funded tuition
            assistance. To search for training, enter a training name, Provider or job title in the
            search bar below.
          </p>

          <h3 className="mtl mbd text-l weight-500 align-center">In-Demand Occupations List</h3>
          <p className="mbl align-center">
            This list of occupations are expected to have the most openings in the future in the
            state of New Jersey. In addition to the list, you can view labor and job information on
            for occupation aggregated from resources such as O*Net, BLS and CareerOneStop.
          </p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            Resources for your training exploration
          </h3>
          <div className="landing-card-container mla mra">
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrs">
                  <img alt="icon-list" src={IconList} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    Find the most up-to-date info on the ETPL
                  </p>
                  <LinkButton secondary to="/search">
                    Search
                  </LinkButton>
                </div>
              </>
            </LandingCard>
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrd">
                  <img alt="icon-occupation" src={IconOccupation} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    Access data about the fastest growing occupations in New Jersey
                  </p>
                  <LinkButton secondary to="/in-demand-occupations">
                    View Occupations
                  </LinkButton>
                </div>
              </>
            </LandingCard>
          </div>

          <h3 className="mtl mbd text-l weight-500 align-center">
            Learn how to use the Training Explorer from these commonly asked questions
          </h3>
          <div className={`${isTablet && "landing-grid"} mam mbl align-center`}>
            <Link className="no-link-format" to="/faq/data-sources">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                What are the data sources for this website?
              </LandingCard>
            </Link>
            <Link className="no-link-format" to="/faq/labor-demand-occupations">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                Where can I find the in-demand occupations list?
              </LandingCard>
            </Link>
            <Link className="no-link-format" to="/faq/funding-opportunities">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                What are funding opportunities that my customers can apply for
              </LandingCard>
            </Link>
          </div>

          <div className="align-center">
            <h4 className="mtl mbs text-m weight-500">Have More Questions?</h4>
            <p className="mtz mbd text-m weight-500">Get in Touch</p>
            <LinkButton secondary external className="mbl" to="mailto:test@email.com">
              Contact Us
            </LinkButton>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
