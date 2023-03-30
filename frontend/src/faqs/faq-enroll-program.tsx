import { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import { InDemandTag } from "../components/InDemandTag";
import { useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";

export const FaqEnrollProgram = (_props: RouteComponentProps): ReactElement => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("FAQEnrollProgram.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <Layout>
      <div className="container">
        <FaqBreadcrumb current={t("FAQEnrollProgram.breadcrumbLink")} />
        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">{t("FAQEnrollProgram.header")}</h2>

            <h3 className="weight-500">{t("FAQEnrollProgram.contactHeader")}</h3>
            <p>{t("FAQEnrollProgram.contactBody")}</p>
            <br />

            <h3 className="weight-500">{t("FAQEnrollProgram.inDemandHeader")}</h3>
            <p>{t("FAQEnrollProgram.inDemandBody")}</p>
            <InDemandTag />
            <p>{t("FAQEnrollProgram.inDemandBodyTwo")}</p>

            <h3 className="weight-500">{t("FAQEnrollProgram.counselorAdviceHeader")}</h3>
            <p>
              {t("FAQEnrollProgram.counselorAdviceBodyStart")}
              <a
                href="https://forms.office.com/Pages/ResponsePage.aspx?id=0cN2UAI4n0uzauCkG9ZCpyMAsRmL_iZGuS3yTOduNF1UMFE1VUIxTU9MTDdXSDZNWlBHU0s4S0lQNSQlQCN0PWcu"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                {t("FAQEnrollProgram.counselorAdviceBodyLink")}
              </a>
              {t("FAQEnrollProgram.counselorAdviceBodyEnd")}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
