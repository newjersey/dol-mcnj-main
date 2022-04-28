import React, { ReactElement } from "react";
import { RouteComponentProps, Link, navigate } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LandingCard } from "./LandingCard";
import IconChecklist from "./landing-icons/checklist.svg";
import IconPortfolio from "./landing-icons/portfolio.svg";
import IconOccupation from "./landing-icons/occupations.svg";
import { useMediaQuery } from "@material-ui/core";
import { TrainingProviderPageStrings } from "../localizations/TrainingProviderPageStrings";
import { ContactUsSection } from "../components/ContactUsSection";
import { Button } from "../components/Button";

export const LandingPageTrainingProvider = (_props: RouteComponentProps): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <div className="landing-container mla mra">
          <h2 className="mvm text-xl weight-500 align-center">
            {TrainingProviderPageStrings.header}
          </h2>

          <h3 className="mbd text-l weight-500 align-center">
            {TrainingProviderPageStrings.sectionOneHeader}
          </h3>
          <p className="mbl align-center">{TrainingProviderPageStrings.sectionOneText}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {TrainingProviderPageStrings.sectionTwoHeader}
          </h3>
          <p className="mbl align-center">{TrainingProviderPageStrings.sectionTwoText}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {TrainingProviderPageStrings.sectionThreeHeader}
          </h3>
          <div className="landing-card-container mla mra">
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrs">
                  <img alt="icon-checklist" src={IconChecklist} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    {TrainingProviderPageStrings.etplDescription}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/etpl")}>
                    {TrainingProviderPageStrings.etplButton}
                  </Button>
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
                    {TrainingProviderPageStrings.applicationDescription}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/etpl#apply")}>
                    {TrainingProviderPageStrings.applicationButton}
                  </Button>
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
                    {TrainingProviderPageStrings.occupationDescription}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/in-demand-occupations")}>
                    {TrainingProviderPageStrings.occupationButton}
                  </Button>
                </div>
              </>
            </LandingCard>
          </div>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {TrainingProviderPageStrings.sectionFourHeader}
          </h3>
          <div className={`${isTablet && "landing-grid"} mam mbl align-center`}>
            <Link className="link-format-blue" to="/etpl">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {TrainingProviderPageStrings.etplFaq}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/registered-apprenticeship">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {TrainingProviderPageStrings.apprenticeshipFaq}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/etpl-out-of-state-provider">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {TrainingProviderPageStrings.outOfStateFaq}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/etpl-performance-standards">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {TrainingProviderPageStrings.performanceFaq}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/labor-demand-occupations">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {TrainingProviderPageStrings.laborDemandFaq}
              </LandingCard>
            </Link>
          </div>

          <ContactUsSection />
        </div>
      </main>

      <Footer />
    </>
  );
};
