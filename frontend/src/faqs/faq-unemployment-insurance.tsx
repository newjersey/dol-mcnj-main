import { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import { Trans, useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";

interface Props extends RouteComponentProps {
  client: Client;
}

export const FaqUnemploymentInsurance = (props: Props): ReactElement => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t("FAQUnemployment.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <Layout client={props.client}>
      <div className="container">
        <FaqBreadcrumb current={t("FAQUnemployment.header")} />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">{t("FAQUnemployment.header")}</h2>
            {t("FAQUnemployment.intro")}
            <h3 className="mtd weight-500">{t("FAQUnemployment.covidHeader")}</h3>
            <p>
              <Trans i18nKey="FAQUnemployment.eligibilityToolIntro">
                start
                <a
                  href="https://getstarted.nj.gov/labor/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>{" "}
              <Trans i18nKey="FAQUnemployment.eligibilityToolVisit">
                start
                <a
                  href="https://getstarted.nj.gov/labor/"
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
              <Trans i18nKey="FAQUnemployment.covidImportantInfo">
                start
                <a
                  href="https://myunemployment.nj.gov/labor/myunemployment/covidinstructions.shtml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>{" "}
              <Trans i18nKey="FAQUnemployment.covidAdditionalInfo">
                start
                <a
                  href="https://www.nj.gov/labor/worker-protections/earnedsick/covid.shtml?fbclid=IwAR3s8jlWGUn4GsZ6cjauTyOyn9VSL0U2kUAc6_Gy_saT9v_0i-AXS3cKryE"
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
              <Trans i18nKey="FAQUnemployment.covidHub">
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
            <h2 className="text-l mvd">{t("FAQUnemployment.applyingHeader")}</h2>
            <p>
              <Trans i18nKey="FAQUnemployment.applyingOnline">
                start
                <a
                  href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/applyonline.shtml"
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
              {t("FAQUnemployment.applyingSteps")}
              <ol>
                <li>
                  <Trans i18nKey="FAQUnemployment.applyingStepOne">
                    start
                    <a
                      href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/infoneeded.shtml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-format-blue"
                    >
                      link
                    </a>
                    end
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey="FAQUnemployment.applyingStepTwo">
                    start
                    <a
                      href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/infoneeded.shtml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-format-blue"
                    >
                      link
                    </a>
                    end
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey="FAQUnemployment.applyingStepThree">
                    start
                    <a
                      href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/infoneeded.shtml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-format-blue"
                    >
                      link
                    </a>
                    end
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey="FAQUnemployment.applyingStepFour">
                    start
                    <a
                      href="https://secure.dol.state.nj.us/sso/XUI/#login/&realm=njcc&goto=https%3A%2F%2Fregapp1.dol.state.nj.us%3A8443%2FRegistration%2F"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-format-blue"
                    >
                      link
                    </a>
                    end
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey="FAQUnemployment.applyingStepFive">
                    start
                    <a
                      href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/opendashboard.shtml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-format-blue"
                    >
                      link
                    </a>
                    end
                  </Trans>
                </li>
              </ol>
            </p>
            <h2 className="text-l mvd">{t("FAQUnemployment.applyingPhoneHeader")}</h2>
            <p>
              {t("FAQUnemployment.applyingPhoneIntro")}
              <ol>
                <li>
                  <Trans i18nKey="FAQUnemployment.applyingPhoneStepOne">
                    start
                    <a
                      href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/infoneeded_ph.shtml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-format-blue"
                    >
                      link
                    </a>
                    end
                  </Trans>
                </li>
                <li>
                  {t("FAQUnemployment.applyingPhoneStepTwoPartOne")}{" "}
                  <Trans i18nKey="FAQUnemployment.applyingPhoneStepTwoPartTwo">
                    start
                    <a
                      href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/callrcc.shtml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-format-blue"
                    >
                      link
                    </a>
                    end
                  </Trans>
                </li>
                <li>
                  {t("FAQUnemployment.applyingPhoneStepThreePartOne")}{" "}
                  <Trans i18nKey="FAQUnemployment.applyingPhoneStepThreePartTwo">
                    start
                    <a
                      href="https://myunemployment.nj.gov/labor/myunemployment/before/about/howtoapply/forms_ph.shtml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-format-blue"
                    >
                      link
                    </a>
                    end
                  </Trans>
                </li>
              </ol>
            </p>
            <h2 className="text-l mvd">{t("FAQUnemployment.eligibilityHeader")}</h2>
            <p>
              {t("FAQUnemployment.eligibilityIntro")}
              <ol>
                <li>{t("FAQUnemployment.eligibilityListOne")}</li>
                <li>{t("FAQUnemployment.eligibilityListTwo")}</li>
                <li>{t("FAQUnemployment.eligibilityListThree")}</li>
                <li>{t("FAQUnemployment.eligibilityListFour")}</li>
                <li>{t("FAQUnemployment.eligibilityListFive")}</li>
                <li>{t("FAQUnemployment.eligibilityListSix")}</li>
              </ol>
            </p>
            <p>
              <Trans i18nKey="FAQUnemployment.eligibilityLink">
                start
                <a
                  href="https://myunemployment.nj.gov/labor/myunemployment/assets/pdfs/PR-94.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>
            <h2 className="text-l mvd">{t("FAQUnemployment.claimingHeader")}</h2>
            <p>{t("FAQUnemployment.claimingIntro")}</p>
            <h3 className="weight-500">{t("FAQUnemployment.claimingOnlineHeader")}</h3>
            <p>
              <Trans i18nKey="FAQUnemployment.claimingOnlineLink">
                start
                <a
                  href="https://secure.dol.state.nj.us/sso/XUI/#login/&realm=njcc&goto=https%3A%2F%2Fregapp1.dol.state.nj.us%3A8443%2FRegistration%2F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
              <Trans i18nKey="FAQUnemployment.claimingOnlineMoreInfoLink">
                start
                <a
                  href="https://secure.dol.state.nj.us/sso/XUI/#login/&realm=njcc&goto=https%3A%2F%2Fregapp1.dol.state.nj.us%3A8443%2FRegistration%2F"
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
              {t("FAQUnemployment.claimingOnlineScheduleIntro")}
              <ul>
                <li>{t("FAQUnemployment.claimingOnlineScheduleListOne")}</li>
                <li>{t("FAQUnemployment.claimingOnlineScheduleListTwo")}</li>
                <li>{t("FAQUnemployment.claimingOnlineScheduleListThree")}</li>
              </ul>
            </p>
            <h3 className="weight-500">{t("FAQUnemployment.claimingPhoneScheduleHeader")}</h3>
            <p>{t("FAQUnemployment.claimingPhoneScheduleIntro")}</p>
            <p>
              <ul>
                <li>{t("FAQUnemployment.claimingPhoneScheduleListOne")}</li>
                <li>{t("FAQUnemployment.claimingPhoneScheduleListTwo")}</li>
                <li>{t("FAQUnemployment.claimingPhoneScheduleListThree")}</li>
              </ul>
            </p>
            <p>
              {t("FAQUnemployment.claimingPhoneContactIntro")}
              <ul>
                <li>{t("FAQUnemployment.claimingPhoneContactListOne")}</li>
                <li>{t("FAQUnemployment.claimingPhoneContactListTwo")}</li>
                <li>{t("FAQUnemployment.claimingPhoneContactListThree")}</li>
                <li>{t("FAQUnemployment.claimingPhoneContactListFour")}</li>
              </ul>
            </p>
            <h2 className="text-l mvd">{t("FAQUnemployment.pinHeader")}</h2>
            <p>
              {t("FAQUnemployment.pinBody")}
              <Trans i18nKey="FAQUnemployment.pinLink">
                start
                <a
                  href="https://myunemployment.nj.gov/before/about/howtoapply/callrcc.shtml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>
            <h2 className="text-l mvd">{t("FAQUnemployment.paymentHeader")}</h2>
            <p>
              {t("FAQUnemployment.paymentIntro")}{" "}
              <Trans i18nKey="FAQUnemployment.paymentLink">
                start
                <a
                  href="https://myunemployment.nj.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>{" "}
              {t("FAQUnemployment.paymentPrepaidInfo")}{" "}
              <Trans i18nKey="FAQUnemployment.paymentMoreInfoLink">
                start
                <a
                  href="https://myunemployment.nj.gov/labor/myunemployment/before/about/payment/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>
            <h2 className="text-l mvd">{t("FAQUnemployment.additionalProgramsHeader")}</h2>
            <p>
              <Trans i18nKey="FAQUnemployment.additionalProgramsDHSLink">
                start
                <a
                  href="https://www.nj.gov/humanservices/clients/welfare/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>{" "}
              <Trans i18nKey="FAQUnemployment.additionalProgramsDHSMoreInfoLink">
                start
                <a
                  href="https://www.nj.gov/humanservices/clients/welfare/"
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
              <Trans i18nKey="FAQUnemployment.additionalProgramsTDILink">
                start
                <a
                  href="https://myleavebenefits.nj.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>{" "}
              <Trans i18nKey="FAQUnemployment.additionalProgramsTDIFileLink">
                start
                <a
                  href="https://identity.dol.state.nj.us/amserver/UI/Login?module=LWD&goto=https%3A%2F%2Flwd.state.nj.us%3A443%2Ftdi%2FTDIIntroduction.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>{" "}
              <Trans i18nKey="FAQUnemployment.additionalProgramsSocialSecurity">
                start
                <a
                  href="https://www.ssa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                middle
                <a
                  href="https://www.ssa.gov/planners/disability/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                middle
                <a
                  href="https://www.ssa.gov/ssi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>
            </p>
            <h2 className="text-l mvd">{t("FAQUnemployment.supportHeader")}</h2>
            <h3 className="weight-500">{t("FAQUnemployment.supportAddressHeader")}</h3>
            <p>
              Unemployment Insurance - Customer Service Office <br />
              New Jersey Department of Labor and Workforce Development <br />
              PO Box 058 <br />
              Trenton, NJ 08625-0058
            </p>
            <h3 className="weight-500">{t("FAQUnemployment.supportOnlineHeader")}</h3>
            <p>
              <Trans i18nKey="FAQUnemployment.supportOnlineWebsite">
                start
                <a
                  href="https://myunemployment.nj.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                end
              </Trans>{" "}
              <Trans i18nKey="FAQUnemployment.supportPhoneMail">
                start
                <a
                  href="https://myunemployment.nj.gov/labor/myunemployment/help/contact-us/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  link
                </a>
                middle
                <a
                  href="mailto:UIhelp@dol.nj.gov"
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
