import React, { ReactElement } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { useMediaQuery } from "@material-ui/core";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LinkButton } from "../components/LinkButton";
import { LandingCard } from "./LandingCard";
import IconCustomize from "./landing-icons/customize.svg";
import IconFunding from "./landing-icons/funding.svg";
import IconOccupation from "./landing-icons/occupations.svg";

export const LandingPageExplorer = (props: RouteComponentProps): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <div className="landing-container mla mra">
          <h2 className="mvm text-xl weight-500 align-center">
            Power up your search to find your next training opportunity
          </h2>

          <h3 className="mbd text-l weight-500 align-center">Get Started</h3>
          <p className="mbl align-center">
            The Training Explorer is a comprehensive listing of all schools and organizations
            offering education and job training programs that are eligible to receive publicly
            funded tuition assistance. To search for training, enter a training name, provider, or
            job title in the search bar below
          </p>

          <h3 className="mtl mbd text-l weight-500 align-center">Funding</h3>
          <p className="mbl align-center">
            Training with an in-demand label may be eligible for funding by New Jersey. NJ offers
            many options for training programs and funding through grants for those who qualify. To
            find out about your eligibility, get in touch with your local one-stop center.
          </p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            Resources for your training exploration
          </h3>
          <div className="landing-card-container mla mra">
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrs">
                  <img className="" alt="icon-customize" src={IconCustomize} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    Customize your search by occupation and geographic location
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
                  <img alt="icon-funding" src={IconFunding} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    New Jersey offers funding through grants for those who qualify
                  </p>
                  <LinkButton secondary to="/funding">
                    Explore Funding
                  </LinkButton>
                </div>
              </>
            </LandingCard>
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrd">
                  <img className="" alt="icon-occupation" src={IconOccupation} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    Find the fastest growing occupations in the state
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
            <Link className="no-link-format" to="/faq/enroll-program">
              <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
                I want to enroll in a training that I see on website
              </LandingCard>
            </Link>
            <Link className="no-link-format" to="/faq/search-help">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                I don't know where to start my search and I need help with that
              </LandingCard>
            </Link>
            <Link className="no-link-format" to="/faq/child-care">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                I need help with child care
              </LandingCard>
            </Link>
            <Link className="no-link-format" to="/faq/funding-opportunities">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                I want to learn more about funding opportunities
              </LandingCard>
            </Link>
            <Link className="no-link-format" to="/faq/job-listings">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                I want to look at job listings
              </LandingCard>
            </Link>
            <Link className="no-link-format" to="/faq/unemployment-insurance">
              <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
                I need help applying for unemployment insurance
              </LandingCard>
            </Link>
            <Link className="no-link-format" to="/faq/health-insurance">
              <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
                I need help applying for health insurance
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
