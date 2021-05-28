import React, { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LinkButton } from "../components/LinkButton";
import { LandingCard } from "./LandingCard";
import IconChecklist from "./landing-icons/checklist.svg";
import IconPortfolio from "./landing-icons/portfolio.svg";
import IconOccupation from "./landing-icons/occupations.svg";
import { useMediaQuery } from "@material-ui/core";

export const LandingPageTrainingProvider = (props: RouteComponentProps): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <div className="landing-container mla mra">
          <h2 className="mvm text-xl weight-500 align-center">
            Register or renew your organization's offerings on the Eligible Training Proivder List
          </h2>

          <h3 className="mbd text-l weight-500 align-center">Get Started</h3>
          <p className="mbl align-center">
            The Training Explorer is a comprehensive listing of all schools and organizations
            offering education and job training programs that are eligible to receive publicly
            funded tuition assistance. This listing is called the Eligible Training Provider List
            (ETPL). Training providers seeking ETPL placement must first obtain approval from a
            qualified government agency in order to offer training programs. A qualified government
            agency is an agency authorized by law or regulation to approve a training program.
          </p>

          <h3 className="mtl mbd text-l weight-500 align-center">Submit Your Application</h3>
          <p className="mbl align-center">
            All training providers seeking placement on the ETPL under Workforce Innovation And
            Opportunity Act or State law are required to submit a formal application to the Center
            for Occupational Employment Information (COEI). The types of ETPL applications are
            explained and available for download at the links below.
          </p>

          <h3 className="mtl mbd text-l weight-500 align-center">Training Provider Resources</h3>
          <div className="landing-card-container mla mra">
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrs">
                  <img alt="icon-checklist" src={IconChecklist} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    Clear step-by-step instructions to get on the ETPL
                  </p>
                  <LinkButton secondary to="">
                    Get Approved
                  </LinkButton>
                </div>
              </>
            </LandingCard>
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrd">
                  <img alt="icon-portfolio" src={IconPortfolio} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    View a list of ETPL applications and find the right one for your program
                  </p>
                  <LinkButton secondary to="">
                    Get your application
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
            <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
              I want to search for training and I know what I’m looking for.
            </LandingCard>
            <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
              I don't know where to start my search and I need help with that.
            </LandingCard>
            <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
              I need to find training that offers support like child care or night classes.
            </LandingCard>
            <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
              I want to learn more about funding opportunities
            </LandingCard>
            <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
              I want to look at job listings
            </LandingCard>
            <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
              I want to enroll in a training that I see on website
            </LandingCard>
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
