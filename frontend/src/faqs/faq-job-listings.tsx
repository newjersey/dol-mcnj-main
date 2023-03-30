import { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import SearchOccupationScreenshot from "./search-occupation-screenshot.png";
import OccupationDetailsScreenshot from "./occupation-details-screenshot.png";
import { Trans, useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";

export const FaqJobListings = (_props: RouteComponentProps): ReactElement => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("FAQJobListings.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <Layout>
      <div className="container">
        <FaqBreadcrumb current={t("FAQJobListings.header")} />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">{t("FAQJobListings.header")}</h2>
            <h3 className="weight-500">{t("FAQJobListings.trainingExplorerHeader")}</h3>
            <p>
              {t("FAQJobListings.trainingExplorerBodyOneStart")}
              <Trans i18nKey="FAQJobListings.trainingExplorerBodyOneLink">
                start
                <a href="/in-demand-occupations" className="link-format-blue">
                  link
                </a>
                end
              </Trans>
            </p>
            <p>{t("FAQJobListings.trainingExplorerBodyTwo")}</p>
            <p>
              <img
                width="300"
                src={SearchOccupationScreenshot}
                alt={t("FAQ.searchOccupationsScreenshot")}
              />
            </p>
            <p>{t("FAQJobListings.trainingExplorerBodyThree")}</p>
            <p>
              <img
                width="345"
                src={OccupationDetailsScreenshot}
                alt={t("FAQ.searchOccupationsScreenshot")}
              />
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
