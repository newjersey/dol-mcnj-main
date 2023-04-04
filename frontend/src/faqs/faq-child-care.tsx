import { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import { Trans, useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";

interface Props extends RouteComponentProps {
  client: Client;
}

export const FaqChildcare = (props: Props): ReactElement => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t("FAQChildCare.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <Layout client={props.client}>
      <div className="container">
        <FaqBreadcrumb current={t("FAQChildCare.breadcrumbLink")} />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">{t("FAQChildCare.header")}</h2>

            <h3 className="weight-500">{t("FAQChildCare.covidHeader")}</h3>
            <p>
              <Trans i18nKey="FAQChildCare.covidBody">
                start
                <a
                  href="https://www.childcarenj.gov/Resources/Coronavirus"
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
              <Trans i18nKey="FAQChildCare.covidBodyTwo">
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

            <h3 className="weight-500">{t("FAQChildCare.resourceAgencyHeader")}</h3>
            <p>
              {t("FAQChildCare.resourceAgencyBody")}
              <Trans i18nKey="FAQChildCare.resourceAgencyLink">
                start
                <a
                  href="http://www.childcarenj.gov/parents/Child-Care-Resource-and-Referral-Agencies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>

            <h2 className="text-l mvd">{t("FAQChildCare.homeOptionHeader")}</h2>

            <h3 className="weight-500">{t("FAQChildCare.familyCareHeader")}</h3>
            <p>
              {t("FAQChildCare.familyCareBodyOne")}{" "}
              <Trans i18nKey="FAQChildCare.familyCareBodyLinkOne">
                start
                <a
                  href="https://www.nj.gov/dcf/about/divisions/ol/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>{" "}
              {t("FAQChildCare.familyCareBodyTwo")}{" "}
              <Trans i18nKey="FAQChildCare.familyCareBodyLinkTwo">
                start
                <a
                  href="http://www.childcarenj.gov/getattachment/Parents/Types-of-Child-Care/NJFD_FindingQualityCC_checklist_12-22-pdf-(1).pdf.aspx?lang=en-US"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>

            <h3 className="weight-500">{t("FAQChildCare.homeCareHeader")}</h3>
            <p>
              {t("FAQChildCare.homeCareBody")}
              <Trans i18nKey="FAQChildCare.homeCareLink">
                start
                <a
                  href="http://www.childcarenj.gov/Providers/How-to-Become-a-Provider"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>

            <h2 className="text-l mvd">{t("FAQChildCare.schoolCenterHeader")}</h2>

            <h3 className="weight-500">{t("FAQChildCare.childCentersHeader")}</h3>
            <p>{t("FAQChildCare.childCentersBody")}</p>

            <h3 className="weight-500">{t("FAQChildCare.headStartHeader")}</h3>
            <p>{t("FAQChildCare.headStartBody")}</p>

            <h3 className="weight-500">{t("FAQChildCare.preschoolHeader")}</h3>
            <p>{t("FAQChildCare.preschoolBody")}</p>

            <h3 className="weight-500">{t("FAQChildCare.specialServicesHeader")}</h3>
            <p>{t("FAQChildCare.specialServicesBody")}</p>

            <h3 className="weight-500">{t("FAQChildCare.applySubsidyHeader")}</h3>
            <p>
              {t("FAQChildCare.applySubsidyBody")}{" "}
              <Trans i18nKey="FAQChildCare.applySubsidyLinkOne">
                start
                <a
                  href="http://www.childcarenj.gov/Parents/SubsidyProgram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>{" "}
              <Trans i18nKey="FAQChildCare.applySubsidyLinkTwo">
                start
                <a
                  href="http://www.childcarenj.gov/getattachment/Parents/How-To-Apply/Subsidy-Application-English-pdf.pdf.aspx?lang=en-US"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link one
                </a>{" "}
                middle
                <a
                  href="http://www.childcarenj.gov/Parents/CCRR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link two
                </a>{" "}
                end
              </Trans>
            </p>

            <h3 className="weight-500">{t("FAQChildCare.supportHeader")}</h3>
            <p>
              {t("FAQChildCare.supportBodyOne")}{" "}
              <Trans i18nKey="FAQChildCare.supportLink">
                start
                <a
                  href="https://www.njchildsupport.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  here
                </a>{" "}
                end
              </Trans>
            </p>
            <p>{t("FAQChildCare.supportBodyTwo")}</p>

            <h3 className="weight-500">{t("FAQChildCare.federalResourcesHeader")}</h3>
            <p>
              <Trans i18nKey="FAQChildCare.federalResourcesLink">
                start
                <a
                  href="https://www.acf.hhs.gov/help"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>{" "}
                end
              </Trans>{" "}
              <Trans i18nKey="FAQChildCare.federalResourcesLinkTwo">
                start
                <a
                  href="https://www.acf.hhs.gov/acf-hotlines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>{" "}
                end
              </Trans>
            </p>
            <p>
              <Trans i18nKey="FAQChildCare.federalResourcesAsterisk">
                start
                <a
                  href="http://www.childcarenj.gov/getattachment/Parents/Types-of-Child-Care/NJFD_FindingQualityCC_checklist_12-22-pdf.pdf.aspx?lang=en-US"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>{" "}
              <Trans i18nKey="FAQChildCare.federalResourcesLinkThree">
                start
                <a
                  href="https://www.nj211.org/"
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
