import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BetaBanner } from "../components/BetaBanner";
import React, { ReactElement, useEffect } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { useTranslation } from "react-i18next";

const LINKS = {
  sectionThreeLink:
    "https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml",
  purpleBoxLink:
    "https://careerconnections.nj.gov/careerconnections/plan/support/njccsites/one_stop_career_centers.shtml",
};

export const FundingPage = (_props: RouteComponentProps): ReactElement => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("FundingPage.pageTitle");
  }, [t]);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners">
        <div className="row">
          <div className="col-sm-12">
            <h2 className="text-xl pvd weight-500">{t("FundingPage.header")}</h2>
          </div>

          <div className="col-sm-8">
            <h3 className="text-l ptd weight-500">{t("FundingPage.sectionOneHeader")}</h3>
            <p>{t("FundingPage.sectionOneText")}</p>

            <h3 className="text-l ptd weight-500">{t("FundingPage.sectionTwoHeader")}</h3>
            <p>
              {t("FundingPage.sectionTwoTextStart")}
              <Link className="link-format-blue" to="/in-demand-occupations">
                {t("FundingPage.sectionTwoTextLink")}
              </Link>
              {t("FundingPage.sectionTwoTextEnd")}
            </p>

            <h3 className="text-l ptd weight-500">{t("FundingPage.sectionThreeHeader")}</h3>
            <p>
              <a
                className="link-format-blue"
                target="_blank"
                rel="noopener noreferrer"
                href={LINKS.sectionThreeLink}
              >
                {t("FundingPage.sectionThreeLinkText")}
              </a>
              {t("FundingPage.sectionThreeText")}
            </p>
          </div>

          <div className="col-sm-4 mbm">
            <div className="bg-light-purple pam bradl">
              <h3 className="text-l weight-500">{t("FundingPage.purpleBoxHeader")}</h3>
              <p>
                {t("FundingPage.purpleBoxText")}
                <a
                  className="link-format-blue"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={LINKS.purpleBoxLink}
                >
                  {t("FundingPage.purpleBoxLinkText")}
                </a>
                .
              </p>
            </div>

            <div className="bg-light-green pam mtm bradl">
              <h3 className="text-l weight-500">{t("FundingPage.greenBoxHeader")}</h3>
              <p>
                {t("FundingPage.greenBoxTextStart")}
                <Link className="link-format-blue" to="/in-demand-occupations">
                  {t("FundingPage.greenBoxTextLink")}
                </Link>
                {t("FundingPage.greenBoxTextEnd")}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
