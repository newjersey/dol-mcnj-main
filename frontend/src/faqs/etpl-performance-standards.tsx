import { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import { useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";

interface Props extends RouteComponentProps {
  client: Client;
}

export const FaqEtplPerformanceStandards = (props: Props): ReactElement => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("FAQETPLStandards.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <Layout client={props.client}>
      <div className="container">
        <FaqBreadcrumb current={t("FAQETPLStandards.breadcrumbLink")} />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">{t("FAQETPLStandards.header")}</h2>
            <p>{t("FAQETPLStandards.body1")}</p>
            <p>{t("FAQETPLStandards.body2")}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
