import { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import { useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";

interface Props extends RouteComponentProps {
  client: Client;
}

export const FaqLaborDemandOccupations = (props: Props): ReactElement => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("FAQDemandOccupations.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <Layout client={props.client}>
      <div className="container">
        <FaqBreadcrumb current={t("FAQDemandOccupations.breadcrumbLink")} />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">{t("FAQDemandOccupations.header")}</h2>
            <p>{t("FAQDemandOccupations.intro")}</p>

            <h3 className="weight-500">{t("FAQDemandOccupations.listHeader")}</h3>
            <p>{t("FAQDemandOccupations.listBody")}</p>

            <h3 className="weight-500">{t("FAQDemandOccupations.counselorsHeader")}</h3>
            <p>{t("FAQDemandOccupations.counselorsBody1")}</p>

            <p>
              {t("FAQDemandOccupations.counselorsBody2")}
              <ul>
                <li> {t("FAQDemandOccupations.counselorsBody2List1")}</li>
                <li> {t("FAQDemandOccupations.counselorsBody2List2")}</li>
                <li> {t("FAQDemandOccupations.counselorsBody2List3")}</li>
                <li> {t("FAQDemandOccupations.counselorsBody2List4")}</li>
              </ul>
            </p>

            <h3 className="weight-500">{t("FAQDemandOccupations.exceptionsHeader")}</h3>
            <p>{t("FAQDemandOccupations.exceptionsBody")}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
