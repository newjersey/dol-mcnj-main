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
import { CounselorPageStrings } from "../localizations/CounselorPageStrings";
import { ContactUsSection } from "../components/ContactUsSection";

export const LandingPageCounselor = (_props: RouteComponentProps): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <div className="landing-container mla mra">
          <h2 className="mvm text-xl weight-500 align-center">{CounselorPageStrings.header}</h2>

          <h3 className="mbd text-l weight-500 align-center">
            {CounselorPageStrings.sectionOneHeader}
          </h3>
          <p className="mbl align-center">{CounselorPageStrings.sectionOneText}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {CounselorPageStrings.sectionTwoHeader}
          </h3>
          <p className="mbl align-center">{CounselorPageStrings.sectionTwoText}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {CounselorPageStrings.sectionThreeHeader}
          </h3>
          <div className="landing-card-container mla mra">
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrs">
                  <img alt="icon-list" src={IconList} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    {CounselorPageStrings.searchDescription}
                  </p>
                  <LinkButton secondary to="/search">
                    {CounselorPageStrings.searchButton}
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
                    {CounselorPageStrings.occupationDescription}
                  </p>
                  <LinkButton secondary to="/in-demand-occupations">
                    {CounselorPageStrings.occupationButton}
                  </LinkButton>
                </div>
              </>
            </LandingCard>
          </div>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {CounselorPageStrings.sectionFourHeader}
          </h3>
          <div className={`${isTablet && "landing-grid"} mam mbl align-center`}>
            <Link className="no-link-format" to="/faq/data-sources">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {CounselorPageStrings.dataFaq}
              </LandingCard>
            </Link>
            <Link className="no-link-format" to="/faq/labor-demand-occupations">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {CounselorPageStrings.occupationsFaq}
              </LandingCard>
            </Link>
            <Link className="no-link-format" to="/faq/funding-opportunities">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {CounselorPageStrings.fundingFaq}
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
