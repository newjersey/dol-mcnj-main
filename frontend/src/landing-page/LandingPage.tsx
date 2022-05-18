import { navigate, RouteComponentProps } from "@reach/router";
import React, { ReactElement } from "react";
import { Searchbar } from "../components/Searchbar";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import IconOccupation from "./landing-icons/occupations.svg";
import IconWorkforce from "./landing-icons/workforce.png";
import IconCounseling from "./landing-icons/counseling.svg";
import { Button } from "../components/Button";
import { useTranslation } from "react-i18next";

export const LandingPage = (_props: RouteComponentProps): ReactElement => {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="below-banners" role="main">
        <div className="bg-light-green pvl">
          <div className="container search-container fdc fac fjc mtm mbl">
            <h2 className="text-xl weight-400 align-center mbd title">
              {t("LandingPage.headerText")}
            </h2>
            <Searchbar
              className="width-100 phm"
              onSearch={(searchQuery: string): Promise<void> =>
                navigate(`/search/${encodeURIComponent(searchQuery)}`)
              }
              placeholder={t("LandingPage.searchBoxPlaceholder")}
              stacked={true}
              isLandingPage={true}
            />
          </div>
        </div>

        <div className="container options-container">
          <div className="col-md-4 fdc fac mvl">
            <div className="landing-image mbs">
              <img alt="icon-occupation" src={IconOccupation} />
            </div>
            <h3 className="text-l weight-400 align-center">{t("LandingPage.columnOneHeader")}</h3>
            <p className="phm align-center options-desc">{t("LandingPage.columnOneDescription")}</p>
            <Button className="mtd" variant="secondary" onClick={() => navigate("/explorer")}>
              {t("LandingPage.columnOneButtonText")}
            </Button>
          </div>
          <div className="col-md-4 fdc fac mvl">
            <div className="landing-image mbs">
              <img alt="icon-counseling" src={IconCounseling} />
            </div>
            <h3 className="text-l weight-400 align-center">{t("LandingPage.columnTwoHeader")}</h3>
            <p className="phm align-center options-desc">{t("LandingPage.columnTwoDescription")}</p>
            <Button className="mtd" variant="secondary" onClick={() => navigate("/counselor")}>
              {t("LandingPage.columnTwoButtonText")}
            </Button>
          </div>
          <div className="col-md-4 fdc fac mvl">
            <div className="landing-image-workforce mbs">
              <img alt="Cartoon of three workers" src={IconWorkforce} />
            </div>
            <h3 className="text-l weight-400 align-center">{t("LandingPage.columnThreeHeader")}</h3>
            <p className="phm align-center options-desc">
              {t("LandingPage.columnThreeDescription")}
            </p>
            <Button
              className="mtd"
              variant="secondary"
              onClick={() => navigate("/training-provider")}
            >
              {t("LandingPage.columnThreeButtonText")}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
