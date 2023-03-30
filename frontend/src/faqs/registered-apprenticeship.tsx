import { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import { Trans, useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";

export const FaqRegisteredApprenticeship = (_props: RouteComponentProps): ReactElement => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("FAQApprenticeship.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <Layout>
      <div className="container">
        <FaqBreadcrumb current={t("FAQApprenticeship.breadcrumbLink")} />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">{t("FAQApprenticeship.header")}</h2>
            <p>{t("FAQApprenticeship.body1")}</p>
            <p>{t("FAQApprenticeship.body2")}</p>
            <p>
              {t("FAQApprenticeship.body3")}{" "}
              <Trans i18nKey="FAQApprenticeship.body3Link">
                start
                <a
                  href="http://lwd.dol.state.nj.us/labor/forms_pdfs/coei/ETPL/ETPLRegisteredApprenticeshipApplicationPacket.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>
            <p>{t("FAQApprenticeship.body4")}</p>
            <p>{t("FAQApprenticeship.body5")}</p>
            <p>{t("FAQApprenticeship.body6")}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
