import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import { Trans, useTranslation } from "react-i18next";

export const FaqDataSources = (_props: RouteComponentProps): ReactElement => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("FAQDataSources.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current={t("FAQDataSources.breadcrumbLink")} />
        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">{t("FAQDataSources.header")}</h2>
            <h3 className="weight-500">Training Explorer</h3>
            <p>{t("FAQDataSources.body1")}</p>
            <p>{t("FAQDataSources.body2")}</p>
            <h3 className="weight-500">{t("FAQDataSources.occupationalHeader")}</h3>
            <p>{t("FAQDataSources.occupationalBody1")}</p>
            <p>
              <Trans i18nKey="FAQDataSources.occupationalBody2">
                start
                <a
                  href="https://usnlx.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                middle
                <a
                  href="https://www.careeronestop.org/Site/about-us.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>
            <p>
              <Trans i18nKey="FAQDataSources.occupationalBody3">
                start
                <a
                  href="https://www.onetonline.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>
            <p>{t("FAQDataSources.occupationalBody4")}</p>
            <p>{t("FAQDataSources.occupationalBody5")}</p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
