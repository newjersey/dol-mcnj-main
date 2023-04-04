import { ReactElement } from "react";
import { RouteComponentProps, Link, navigate } from "@reach/router";
import { LandingCard } from "./LandingCard";
import IconChecklist from "./landing-icons/checklist.svg";
import IconPortfolio from "./landing-icons/portfolio.svg";
import IconOccupation from "./landing-icons/occupations.svg";
import { useMediaQuery } from "@material-ui/core";
import { ContactUsSection } from "../components/ContactUsSection";
import { Button } from "../components/Button";
import { useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";

interface Props extends RouteComponentProps {
  client: Client;
}

export const LandingPageTrainingProvider = (props: Props): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");
  const { t } = useTranslation();

  return (
    <Layout client={props.client}>
      <div className="container">
        <div className="landing-container mla mra">
          <h2 className="mtm mbd text-xl weight-500 align-center">
            {t("TrainingProviderPage.header")}
          </h2>

          <div className="embed-youtube">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/WogMsybfQ04"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <h3 className="mbd text-l weight-500 align-center">
            {t("TrainingProviderPage.sectionOneHeader")}
          </h3>
          <p className="mbl align-center">{t("TrainingProviderPage.sectionOneText")}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {t("TrainingProviderPage.sectionTwoHeader")}
          </h3>
          <p className="mbl align-center">{t("TrainingProviderPage.sectionTwoText")}</p>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {t("TrainingProviderPage.sectionThreeHeader")}
          </h3>
          <div className="landing-card-container mla mra">
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrs">
                  <img alt={t("IconAlt.etplList")} src={IconChecklist} />
                </div>
                <div>
                  <p className={`mtz mbs ${!isTablet && "phl"}`}>
                    {t("TrainingProviderPage.etplDescription")}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/etpl")}>
                    {t("TrainingProviderPage.etplButton")}
                  </Button>
                </div>
              </>
            </LandingCard>
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrd">
                  <img alt={t("IconAlt.providerApplication")} src={IconPortfolio} />
                </div>
                <div>
                  <p className={`mtz mbs ${!isTablet && "phl"}`}>
                    {t("TrainingProviderPage.applicationDescription")}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/etpl#apply")}>
                    {t("TrainingProviderPage.applicationButton")}
                  </Button>
                </div>
              </>
            </LandingCard>
            <LandingCard hideBorderMobile className={`mbl ${isTablet ? "flex" : "align-center"}`}>
              <>
                <div className="landing-image mrd">
                  <img alt={t("IconAlt.landingPageOccupation")} src={IconOccupation} />
                </div>
                <div>
                  <p className={`mtz mbs ${!isTablet && "phl"}`}>
                    {t("TrainingProviderPage.occupationDescription")}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/in-demand-occupations")}>
                    {t("TrainingProviderPage.occupationButton")}
                  </Button>
                </div>
              </>
            </LandingCard>
          </div>

          <h3 className="mtl mbd text-l weight-500 align-center">
            {t("TrainingProviderPage.sectionFourHeader")}
          </h3>
          <div className={`${isTablet && "landing-grid"} mam mbl align-center`}>
            <Link className="link-format-blue" to="/etpl">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("TrainingProviderPage.etplFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/registered-apprenticeship">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("TrainingProviderPage.apprenticeshipFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/etpl-out-of-state-provider">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("TrainingProviderPage.outOfStateFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/etpl-performance-standards">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("TrainingProviderPage.performanceFaq")}
              </LandingCard>
            </Link>
            <Link className="link-format-blue" to="/faq/labor-demand-occupations">
              <LandingCard className={`height-100 weight-500 text-m ${!isTablet && "mbm"}`}>
                {t("TrainingProviderPage.laborDemandFaq")}
              </LandingCard>
            </Link>
          </div>

          <ContactUsSection />
        </div>
      </div>
    </Layout>
  );
};
