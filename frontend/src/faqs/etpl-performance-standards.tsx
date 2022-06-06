import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import { useTranslation } from "react-i18next";

export const FaqEtplPerformanceStandards = (_props: RouteComponentProps): ReactElement => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("FAQETPLStandards.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current={t("FAQETPLStandards.breadcrumbLink")} />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">{t("FAQETPLStandards.header")}</h2>
            <p>{t("FAQETPLStandards.body1")}</p>
            <p>{t("FAQETPLStandards.body2")}</p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
