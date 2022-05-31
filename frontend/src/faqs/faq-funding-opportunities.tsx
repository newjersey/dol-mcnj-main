import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import { Trans, useTranslation } from "react-i18next";

export const FaqFundingOpportunities = (_props: RouteComponentProps): ReactElement => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("FAQFundingOpportunities.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current={t("FAQFundingOpportunities.breadcrumbLink")} />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">{t("FAQFundingOpportunities.header")}</h2>
            <p>{t("FAQFundingOpportunities.introBody")}</p>

            <h3 className="weight-500">{t("FAQFundingOpportunities.qualifyHeader")}</h3>
            <p>
              <Trans i18nKey="FAQFundingOpportunities.qualifyBody">
                start
                <a href="/in-demand-occupations" className="link-format-blue">
                  link
                </a>
                end
              </Trans>
            </p>

            <h3 className="weight-500">{t("FAQFundingOpportunities.nextStepsHeader")}</h3>
            <p>
              <Trans i18nKey="FAQFundingOpportunities.nextStepsBody">
                <a
                  className="link-format-blue"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml"
                >
                  link
                </a>
                end
              </Trans>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
