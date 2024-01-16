import { ReactElement } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import { useMediaQuery } from "@material-ui/core";
import { LandingCard } from "./LandingCard";
import IconCustomize from "./landing-icons/customize.svg";
import IconFunding from "./landing-icons/funding.svg";
import IconOccupation from "./landing-icons/occupations.svg";
import { ContactUsSection } from "../components/ContactUsSection";
import { Button } from "../components/Button";
import { useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";

interface Props extends RouteComponentProps {
  client: Client;
}

export const LandingPageExplorer = (props: Props): ReactElement => {
  const isTablet = useMediaQuery("(min-width:768px)");
  const { t } = useTranslation();

  return (
    <Layout
      client={props.client}
      seo={{
        title: "Explorer | New Jersey Career Central",
        pageDescription: "Power up your search to find your next training opportunity",
        url: props.location?.pathname,
      }}
    >
      <div className="container">
        <div className="landing-container mla mra">
          <h2 className="mtm mbd text-xl weight-500 align-center">{t("ExplorerPage.header")}</h2>

          <div className="embed-youtube">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/EQTSpcr9sqg"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

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
                  <p className={`mtz mbs ${!isTablet && "phl"}`}>
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
                  <p className={`mtz mbs ${!isTablet && "phl"}`}>
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
                  <p className={`mtz mbs ${!isTablet && "phl"}`}>
                    {t("ExplorerPage.occupationDescription")}
                  </p>
                  <Button variant="secondary" onClick={() => navigate("/in-demand-occupations")}>
                    {t("ExplorerPage.occupationButton")}
                  </Button>
                </div>
              </>
            </LandingCard>
          </div>
          <ContactUsSection />
        </div>
      </div>
    </Layout>
  );
};
