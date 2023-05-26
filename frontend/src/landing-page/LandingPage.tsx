import { navigate, RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Searchbar } from "../components/Searchbar";
import IconOccupation from "./landing-icons/swimlane-rocket.svg";
import IconWorkforce from "./landing-icons/swimlane-bulb.svg";
import IconCounseling from "./landing-icons/swimlane-heart.svg";
import { Button } from "../components/Button";
import { useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { useContentfulClient } from "../utils/useContentfulClient";
import { TRAINING_EXPLORER_PAGE_QUERY } from "../queries/trainingExplorer";
import { TrainingExplorerPageProps } from "../types/contentful";
import { PageBanner } from "../components/PageBanner";

interface Props extends RouteComponentProps {
  client: Client;
}

export const LandingPage = (props: Props): ReactElement => {
  const { t } = useTranslation();

  const data: TrainingExplorerPageProps = useContentfulClient({
    query: TRAINING_EXPLORER_PAGE_QUERY,
  });

  const pageData = data?.trainingExplorerPage;

  return (
    <Layout client={props.client}>
      <PageBanner {...pageData.pageBanner} />

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
        <h2 className="text-l weight-400 align-center mvd">{t("LandingPage.swimLaneHeader")}</h2>
        <div className="col-md-4 fdc fac mbl">
          <div className="landing-image mbs">
            <img alt={t("IconAlt.landingPageOccupation")} src={IconOccupation} />
          </div>
          <h3 className="text-l weight-400 align-center">{t("LandingPage.columnOneHeader")}</h3>
          <Button className="mtd" variant="secondary" onClick={() => navigate("/explorer")}>
            {t("LandingPage.columnButtonText")}
          </Button>
        </div>
        <div className="col-md-4 fdc fac mbl">
          <div className="landing-image mbs">
            <img alt={t("IconAlt.landingPageCounseling")} src={IconCounseling} />
          </div>
          <h3 className="text-l weight-400 align-center">{t("LandingPage.columnTwoHeader")}</h3>
          <Button className="mtd" variant="secondary" onClick={() => navigate("/counselor")}>
            {t("LandingPage.columnButtonText")}
          </Button>
        </div>
        <div className="col-md-4 fdc fac mbl">
          <div className="landing-image mbs">
            <img alt={t("IconAlt.landingPageWorkforce")} src={IconWorkforce} />
          </div>
          <h3 className="text-l weight-400 align-center">{t("LandingPage.columnThreeHeader")}</h3>
          <Button
            className="mtd"
            variant="secondary"
            onClick={() => navigate("/training-provider-resources")}
          >
            {t("LandingPage.columnButtonText")}
          </Button>
        </div>
      </div>
    </Layout>
  );
};
