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
          <h2 className="mvm text-xl weight-500 align-center">{t("ExplorerPage.header")}</h2>

          <h3 className="mbd text-l weight-500 align-center">
            {t("ExplorerPage.sectionOneHeader")}
          </h3>
          <p className="mbl align-center">{t("ExplorerPage.sectionOneText")}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {t("ExplorerPage.sectionTwoHeader")}
          </h3>
          <p className="mbl align-center">{t("ExplorerPage.sectionTwoText")}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {t("ExplorerPage.sectionThreeHeader")}
          </h3>
          <div className="landing-card-container mla mra">
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrs">
                  <img className="" alt={t("IconAlt.explorerCustomize")} src={IconCustomize} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    {t("ExplorerPage.searchDescription")}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/search")}>
                    {t("ExplorerPage.searchButton")}
                  </Button>
                </div>
              </>
            </LandingCard>
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrd">
                  <img alt={t("IconAlt.explorerFunding")} src={IconFunding} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    {t("ExplorerPage.fundingDescription")}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/funding")}>
                    {t("ExplorerPage.fundingButton")}
                  </Button>
                </div>
              </>
            </LandingCard>
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrd">
                  <img className="" alt={t("IconAlt.landingPageOccupation")} src={IconOccupation} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    {t("ExplorerPage.occupationDescription")}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/in-demand-occupations")}>
                    {t("ExplorerPage.occupationButton")}
                  </Button>
                </div>
              </>
            </LandingCard>
          </div>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {t("ExplorerPage.sectionFourHeader")}
          </h3>
          <div className={`${isTablet && "landing-grid"} mam mbl align-center`}>
            <Link className="link-format-blue" to="/faq/enroll-program">
              <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPage.enrollFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/search-help">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPage.searchHelpFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/child-care">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPage.childCareFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/funding-opportunities">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPage.fundingFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/job-listings">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPage.jobListingsFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/unemployment-insurance">
              <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPage.unemploymentInsuranceFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/health-insurance">
              <LandingCard className={`weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("ExplorerPage.healthInsuranceFaq")}
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
