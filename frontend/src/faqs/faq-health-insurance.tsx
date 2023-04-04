import { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import { Trans, useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";

interface Props extends RouteComponentProps {
  client: Client;
}

export const FaqHealthInsurance = (props: Props): ReactElement => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("FAQHealth.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <Layout client={props.client}>
      <div className="container">
        <FaqBreadcrumb current={t("FAQHealth.header")} />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">{t("FAQHealth.header")}</h2>
            <p>{t("FAQHealth.intro")}</p>

            <h3 className="weight-500">COVID-19</h3>
            <p>
              {t("FAQHealth.familyCareIntro")}{" "}
              <Trans i18nKey="FAQHealth.familyCareIntroLink">
                start
                <a
                  href="https://www.nj.gov/governor/news/news/562020/20200310a.shtml"
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
              {t("FAQHealth.dhs")}
              <Trans i18nKey="FAQHealth.dhsLink">
                start
                <a
                  href="https://nj.gov/humanservices/coronavirus.html"
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
              <Trans i18nKey="FAQHealth.covidHubLink">
                start
                <a
                  href="https://covid19.nj.gov/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>

            <h2 className="text-l mvd">{t("FAQHealth.familyCareHeader")}</h2>
            <p>
              {t("FAQHealth.familyCareBodyOne")}{" "}
              <Trans i18nKey="FAQHealth.familyCareIncomeLink">
                start
                <a
                  href="http://www.njfamilycare.org/income.aspx"
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
              <Trans i18nKey="FAQHealth.familyCareBodyTwo">
                <a
                  href="http://www.njfamilycare.org/who_eligbl.aspx"
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
              <Trans i18nKey="FAQHealth.familyCareBodyThree">
                start
                <a
                  href="https://njfc.force.com/familycare/quickstart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>

            <h2 className="text-l mvd">{t("FAQHealth.medicaidHeader")}</h2>
            <p>
              {t("FAQHealth.medicaidBody")}{" "}
              <Trans i18nKey="FAQHealth.medicaidContact">
                start
                <a
                  href="https://www.state.nj.us/humanservices/dfd/programs/njsnap/cbss/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>

            <h2 className="text-l mvd">{t("FAQHealth.njMedicareHeader")}</h2>
            <p>
              <Trans i18nKey="FAQHealth.njMedicareBody">
                start
                <a
                  href="http://www.medicare.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>{" "}
              <Trans i18nKey="FAQHealth.njMedicareADRC">
                start
                <a
                  href="http://www.adrcnj.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                middle
                <a
                  href="https://www.state.nj.us/humanservices/doas/home/saaaa.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>

            <h2 className="text-l mvd">{t("FAQHealth.medicareHeader")}</h2>
            <p>
              <Trans i18nKey="FAQHealth.medicareSignup">
                start
                <a
                  href="http://www.medicare.gov/"
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
              <Trans i18nKey="FAQHealth.medicareContact">
                start
                <a
                  href="https://www.nj.gov/health/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>

            <h2 className="text-l mvd">{t("FAQHealth.cobraHeader")}</h2>
            <p>
              {t("FAQHealth.cobraBody")}{" "}
              <Trans i18nKey="FAQHealth.cobraContact">
                start
                <a
                  href="https://www.dol.gov/general/topic/health-plans/cobra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
