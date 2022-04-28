import React, { ReactElement } from "react";
import { RouteComponentProps, Link, navigate } from "@reach/router";
import { useMediaQuery } from "@material-ui/core";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LandingCard } from "./LandingCard";
import IconCustomize from "./landing-icons/customize.svg";
import IconFunding from "./landing-icons/funding.svg";
import IconOccupation from "./landing-icons/occupations.svg";
import { ExplorerPageStrings } from "../localizations/ExplorerPageStrings";
import { ContactUsSection } from "../components/ContactUsSection";
import { Button } from "../components/Button";

export const LandingPageExplorer = (_props: RouteComponentProps): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <div className="landing-container mla mra">
          <h2 className="mvm text-xl weight-500 align-center">{ExplorerPageStrings.header}</h2>

          <h3 className="mbd text-l weight-500 align-center">
            {ExplorerPageStrings.sectionOneHeader}
          </h3>
          <p className="mbl align-center">{ExplorerPageStrings.sectionOneText}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {ExplorerPageStrings.sectionTwoHeader}
          </h3>
          <p className="mbl align-center">{ExplorerPageStrings.sectionTwoText}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {ExplorerPageStrings.sectionThreeHeader}
          </h3>
          <div className="landing-card-container mla mra">
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrs">
                  <img className="" alt="icon-customize" src={IconCustomize} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    {ExplorerPageStrings.searchDescription}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/search")}>
                    {ExplorerPageStrings.searchButton}
                  </Button>
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
                    {ExplorerPageStrings.fundingDescription}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/funding")}>
                    {ExplorerPageStrings.fundingButton}
                  </Button>
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
                    {ExplorerPageStrings.occupationDescription}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/in-demand-occupations")}>
                    {ExplorerPageStrings.occupationButton}
                  </Button>
                </div>
              </>
            </LandingCard>
          </div>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {ExplorerPageStrings.sectionFourHeader}
          </h3>
          <div className={`${isTablet && "landing-grid"} mam mbl align-center`}>
            <Link className="link-format-blue" to="/faq/enroll-program">
              <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
                {ExplorerPageStrings.enrollFaq}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/search-help">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {ExplorerPageStrings.searchHelpFaq}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/child-care">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {ExplorerPageStrings.childCareFaq}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/funding-opportunities">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {ExplorerPageStrings.fundingFaq}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/job-listings">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {ExplorerPageStrings.jobListingsFaq}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/unemployment-insurance">
              <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
                {ExplorerPageStrings.unemploymentInsuranceFaq}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/health-insurance">
              <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
                {ExplorerPageStrings.healthInsuranceFaq}
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
