import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import SearchScreenshot from "./search-screenshot.png";
import FilterScreenshot from "./filter-screenshot.png";
import { useTranslation } from "react-i18next";

export const FaqSearchHelp = (_props: RouteComponentProps): ReactElement => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t("FAQSearchHelp.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current={t("FAQSearchHelp.breadcrumbLink")} />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">{t("FAQSearchHelp.header")}</h2>

            <h3 className="weight-500">{t("FAQSearchHelp.searchBarHeader")}</h3>
            <p>
              {t("FAQSearchHelp.searchBarBodyStart")}
              <Link className="link-format-blue" to="/">
                {t("FAQSearchHelp.searchBarBodyLink")}
              </Link>{" "}
              {t("FAQSearchHelp.searchBarBodyEnd")}
            </p>
            <p>
              <img width="345" src={SearchScreenshot} alt={t("FAQ.searchHelpScreenshot")} />
            </p>
            <p>{t("FAQSearchHelp.searchBarBodyTwo")}</p>

            <h3 className="weight-500">{t("FAQSearchHelp.filtersHeader")}</h3>
            <p>{t("FAQSearchHelp.filtersBody")}</p>
            <p>
              <img width="119" src={FilterScreenshot} alt={t("FAQ.searchFilterScreenshot")} />
            </p>
            <p>{t("FAQSearchHelp.filtersBodyTwo")}</p>
            <p>{t("FAQSearchHelp.filtersBodyThree")}</p>

            <h3 className="weight-500">{t("FAQSearchHelp.careerExplorationHeader")}</h3>
            <p>
              {t("FAQSearchHelp.careerExplorationBodyStart")}
              <Link className="link-format-blue" to="/in-demand-occupations">
                {t("FAQSearchHelp.careerExplorationBodyLink")}
              </Link>
              {t("FAQSearchHelp.careerExplorationBodyEnd")}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
