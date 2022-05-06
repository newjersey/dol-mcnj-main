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
import { ContactUsSection } from "../components/ContactUsSection";
import { Button } from "../components/Button";
import { useTranslation } from "react-i18next";

export const LandingPageExplorer = (_props: RouteComponentProps): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <div className="landing-container mla mra">
          <h2 className="mvm text-xl weight-500 align-center">{t("ExplorerPageStrings.header")}</h2>

          <h3 className="mbd text-l weight-500 align-center">
            {t("ExplorerPageStrings.sectionOneHeader")}
          </h3>
          <p className="mbl align-center">{t("ExplorerPageStrings.sectionOneText")}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {t("ExplorerPageStrings.sectionTwoHeader")}
          </h3>
          <p className="mbl align-center">{t("ExplorerPageStrings.sectionTwoText")}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {t("ExplorerPageStrings.sectionThreeHeader")}
          </h3>
          <div className="landing-card-container mla mra">
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrs">
                  <img className="" alt="icon-customize" src={IconCustomize} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    {t("ExplorerPageStrings.searchDescription")}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/search")}>
                    {t("ExplorerPageStrings.searchButton")}
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
                    {t("ExplorerPageStrings.fundingDescription")}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/funding")}>
                    {t("ExplorerPageStrings.fundingButton")}
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
                    {t("ExplorerPageStrings.occupationDescription")}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/in-demand-occupations")}>
                    {t("ExplorerPageStrings.occupationButton")}
                  </Button>
                </div>
              </>
            </LandingCard>
          </div>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {t("ExplorerPageStrings.sectionFourHeader")}
          </h3>
          <div className={`${isTablet && "landing-grid"} mam mbl align-center`}>
            <Link className="link-format-blue" to="/faq/enroll-program">
              <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPageStrings.enrollFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/search-help">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPageStrings.searchHelpFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/child-care">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPageStrings.childCareFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/funding-opportunities">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPageStrings.fundingFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/job-listings">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPageStrings.jobListingsFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/unemployment-insurance">
              <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPageStrings.unemploymentInsuranceFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/health-insurance">
              <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPageStrings.healthInsuranceFaq")}
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
