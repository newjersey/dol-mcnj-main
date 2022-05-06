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
import { ContactUsSection } from "../components/ContactUsSection";
import { Button } from "../components/Button";
import { useTranslation } from "react-i18next";

export const LandingPageTrainingProvider = (_props: RouteComponentProps): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <div className="landing-container mla mra">
          <h2 className="mvm text-xl weight-500 align-center">
            {t("TrainingProviderPageStrings.header")}
          </h2>

          <h3 className="mbd text-l weight-500 align-center">
            {t("TrainingProviderPageStrings.sectionOneHeader")}
          </h3>
          <p className="mbl align-center">{t("TrainingProviderPageStrings.sectionOneText")}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {t("TrainingProviderPageStrings.sectionTwoHeader")}
          </h3>
          <p className="mbl align-center">{t("TrainingProviderPageStrings.sectionTwoText")}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {t("TrainingProviderPageStrings.sectionThreeHeader")}
          </h3>
          <div className="landing-card-container mla mra">
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrs">
                  <img alt="icon-checklist" src={IconChecklist} />
                </div>
                <div>
                  <p className={`mtz ${!isTablet && "phl"}`}>
                    {t("TrainingProviderPageStrings.etplDescription")}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/etpl")}>
                    {t("TrainingProviderPageStrings.etplButton")}
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
                    {t("TrainingProviderPageStrings.applicationDescription")}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/etpl#apply")}>
                    {t("TrainingProviderPageStrings.applicationButton")}
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
                    {t("TrainingProviderPageStrings.occupationDescription")}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/in-demand-occupations")}>
                    {t("TrainingProviderPageStrings.occupationButton")}
                  </Button>
                </div>
              </>
            </LandingCard>
          </div>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {t("TrainingProviderPageStrings.sectionFourHeader")}
          </h3>
          <div className={`${isTablet && "landing-grid"} mam mbl align-center`}>
            <Link className="link-format-blue" to="/etpl">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("TrainingProviderPageStrings.etplFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/registered-apprenticeship">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("TrainingProviderPageStrings.apprenticeshipFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/etpl-out-of-state-provider">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("TrainingProviderPageStrings.outOfStateFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/etpl-performance-standards">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("TrainingProviderPageStrings.performanceFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/labor-demand-occupations">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("TrainingProviderPageStrings.laborDemandFaq")}
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
