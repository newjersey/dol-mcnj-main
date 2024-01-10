import { ReactElement, useEffect, useState, useRef } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Training } from "../domain/Training";
import { InlineIcon } from "../components/InlineIcon";
import { Error } from "../domain/Error";
import { SomethingWentWrongPage } from "../error/SomethingWentWrongPage";
import { NotFoundPage } from "../error/NotFoundPage";
import { Grouping } from "../components/Grouping";
import { formatMoney } from "accounting";
import { formatPercentEmployed } from "../presenters/formatPercentEmployed";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { StatBlock } from "../components/StatBlock";
import { Icon } from "@material-ui/core";
import { UnstyledButton } from "../components/UnstyledButton";
import { useReactToPrint } from "react-to-print";
import { PROVIDER_MISSING_INFO, STAT_MISSING_DATA_INDICATOR } from "../constants";
import { Trans, useTranslation } from "react-i18next";
import { logEvent } from "../analytics";
import { Layout } from "../components/Layout";
import { InDemandBlock } from "../components/InDemandBlock";
import { Tooltip } from "react-tooltip";
import { usePageTitle } from "../utils/usePageTitle";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

interface Copy {
  class: string;
  text: string;
}

export const TrainingPage = (props: Props): ReactElement => {
  const { t } = useTranslation();

  const [training, setTraining] = useState<Training | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [copy, setCopy] = useState<Copy | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  usePageTitle(`${training?.name} | Training | New Jersey Career Central`);

  useEffect(() => {
    const idToFetch = props.id ? props.id : "";
    props.client.getTrainingById(idToFetch, {
      onSuccess: (result: Training) => {
        setError(null);
        setTraining(result);
      },
      onError: (error: Error) => setError(error),
    });
  }, [props.id, props.client]);

  const printReactContent = useReactToPrint({
    content: () => componentRef.current,
  });

  const printHandler = (): void => {
    printReactContent();
    logEvent("Training page", "Clicked print link", training?.id);
  };

  const copyHandler = (): void => {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch {
      setCopy({
        class: "red",
        text: t("TrainingPage.unsuccessfulCopy"),
      });
    }

    setCopy({
      class: "green",
      text: t("TrainingPage.successfulCopy"),
    });

    setTimeout((): void => {
      setCopy(null);
    }, 5000);

    logEvent("Training page", "Clicked copy link", training?.id);
  };

  const getHttpUrl = (url: string): string => {
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      return "http://" + url;
    }

    return url;
  };

  const getProviderUrl = (): ReactElement => {
    if (!training?.provider?.url) {
      return <>{PROVIDER_MISSING_INFO}</>;
    }

    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="break-text link-format-blue"
        href={getHttpUrl(training.provider.url)}
        onClick={() => logEvent("Training page", "Clicked provider link", training?.id)}
      >
        {training.provider.url}
      </a>
    );
  };

  const getProviderAddress = (): ReactElement => {
    if (training?.online) {
      return <>{t("TrainingPage.onlineClass")}</>;
    }

    if (!training || !training.provider.address.city) {
      return <>{PROVIDER_MISSING_INFO}</>;
    }

    const address = training.provider.address;
    const nameAndAddressEncoded = encodeURIComponent(
      `${training.provider.name} ${address.street1} ${address.street2} ${address.city} ${address.state} ${address.zipCode}`,
    );
    const googleUrl = `https://www.google.com/maps/search/?api=1&query=${nameAndAddressEncoded}`;

    return (
      <a href={googleUrl} target="_blank" className="link-format-blue" rel="noopener noreferrer">
        <div className="inline">
          <span>{address.street1}</span>
          <div>{address.street2}</div>
          <div>
            {address.city}, {address.state} {address.zipCode}
          </div>
        </div>
      </a>
    );
  };

  const getProviderContact = (): ReactElement => {
    if (!training) {
      return <></>;
    }

    let phoneNumber = parsePhoneNumberFromString(
      training.provider.phoneNumber,
      "US",
    )?.formatNational();
    if (training.provider.phoneExtension) {
      phoneNumber = `${phoneNumber} Ext: ${training.provider.phoneExtension}`;
    }

    return (
      <div className="inline">
        <span>{training.provider.contactName}</span>
        <div>{training.provider.contactTitle}</div>
        <div>{phoneNumber}</div>
      </div>
    );
  };

  const getAssociatedOccupations = (): ReactElement => {
    if (
      training?.occupations.length === 0 ||
      training?.occupations.map((it) => it.title).includes("NO MATCH")
    ) {
      return (
        <p>
          <Trans i18nKey="TrainingPage.associatedOccupationsText">
            This is a general training that might prepare you for a wide variety of career paths
            Browse
            <Link className="link-format-blue" to="/in-demand-occupations">
              in-demand occupations
            </Link>
            to see how you might apply this training.
          </Trans>
        </p>
      );
    }

    return (
      <>
        {training?.occupations.map((occupation, i) => (
          <Link className="link-format-blue" to={`/occupation/${occupation.soc}`} key={i}>
            <p key={i} className="blue weight-500">
              {occupation.title}
            </p>
          </Link>
        ))}
      </>
    );
  };
  const seoObject = {
    title: `${training ? training.name : ""} | Training | New Jersey Career Central`,
    pageDescription: training?.description,
    url: props.location?.pathname,
  };

  if (!training) {
    if (error === Error.SYSTEM_ERROR) {
      return <SomethingWentWrongPage client={props.client} />;
    } else if (error === Error.NOT_FOUND) {
      return (
        <NotFoundPage client={props.client} heading="Training not found">
          <>
            <p>
              This training is no longer listed or we may be experiencing technical difficulties.
              However, you can try out these other helpful links:
            </p>
            <ul className="unstyled">
              <li style={{ marginTop: "22px" }}>
                <a style={{ color: "#005EA2" }} href="/search">
                  Find Training Opportunities
                </a>
              </li>
              <li style={{ marginTop: "22px" }}>
                <a style={{ color: "#005EA2" }} href="/support-resources/tuition-assistance">
                  Tuition Assistance Resources
                </a>
              </li>
            </ul>
          </>
        </NotFoundPage>
      );
    } else {
      return <></>;
    }
  }

  return (
    <div ref={componentRef}>
      <Layout client={props.client} seo={seoObject}>
        <div className="container">
          <div className="detail-page">
            <div className="page-banner">
              <div className="top-nav">
                <nav className="usa-breadcrumb" aria-label="Breadcrumbs">
                  <Icon>keyboard_backspace</Icon>
                  <ol className="usa-breadcrumb__list">
                    <li className="usa-breadcrumb__list-item">
                      <a className="usa-breadcrumb__link" href="/">
                        Home
                      </a>
                    </li>
                    <li className="usa-breadcrumb__list-item">
                      <a className="usa-breadcrumb__link" href="/training">
                        Training Explorer
                      </a>
                    </li>
                    <li className="usa-breadcrumb__list-item">
                      <a className="usa-breadcrumb__link" href="/search">
                        Search
                      </a>
                    </li>
                    <li className="usa-breadcrumb__list-item use-current" aria-current="page">
                      <span>{training.name}</span>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          <h2 data-testid="title" className="text-xl ptd pbs weight-500">
            {training.name}
          </h2>
          <h3 className="text-l pbs weight-500">{training.provider.name}</h3>

          <div className="stat-block-stack mtm">
            {training.inDemand ? <InDemandBlock /> : <></>}

            {!training.inDemand &&
            training.localExceptionCounty &&
            training.localExceptionCounty.length !== 0 ? (
              <InDemandBlock counties={training.localExceptionCounty} />
            ) : (
              <></>
            )}

            <StatBlock
              title={t("TrainingPage.avgSalaryTitle")}
              tooltipText={t("TrainingPage.avgSalaryTooltip")}
              data={
                training.averageSalary
                  ? formatMoney(training.averageSalary, { precision: 0 })
                  : STAT_MISSING_DATA_INDICATOR
              }
              backgroundColorClass="bg-lightest-purple"
            />
            <StatBlock
              title={t("TrainingPage.employmentRateTitle")}
              tooltipText={t("TrainingPage.employmentRateTooltip")}
              data={
                training.percentEmployed
                  ? formatPercentEmployed(training.percentEmployed)
                  : STAT_MISSING_DATA_INDICATOR
              }
              backgroundColorClass="bg-light-purple-50"
            />
          </div>

          <div className="row pbm">
            <div className="col-md-8">
              <div className="container-fluid">
                <div className="row">
                  <Grouping title={t("TrainingPage.descriptionGroupHeader")}>
                    <>
                      {training.description.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </>
                  </Grouping>

                  <Grouping title={t("TrainingPage.quickStatsGroupHeader")}>
                    <>
                      {training.certifications && (
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">school</InlineIcon>
                            {t("TrainingPage.certificationsLabel")}&nbsp;
                            <b>{training.certifications}</b>
                          </span>
                        </p>
                      )}
                      {training.prerequisites && (
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">list_alt</InlineIcon>
                            {t("TrainingPage.prereqsLabel")}&nbsp;<b>{training.prerequisites}</b>
                          </span>
                        </p>
                      )}
                      <p>
                        <span className="fin">
                          <InlineIcon className="mrxs">av_timer</InlineIcon>
                          {t("TrainingPage.completionTimeLabel")}&nbsp;
                          <b>{t(`CalendarLengthLookup.${training.calendarLength}`)}</b>
                        </span>
                      </p>
                      {training.totalClockHours && (
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">schedule</InlineIcon>
                            {t("TrainingPage.totalClockHoursLabel")}&nbsp;
                            <InlineIcon
                              className="mrxs"
                              data-tooltip-id="totalClockHours-tooltip"
                              data-tooltip-content={t("TrainingPage.totalClockHoursTooltip")}
                            >
                              info
                            </InlineIcon>
                            <Tooltip id="totalClockHours-tooltip" className="custom-tooltip" />
                            <b>
                              {t("TrainingPage.totalClockHours", {
                                hours: training.totalClockHours,
                              })}
                            </b>
                          </span>
                        </p>
                      )}
                      {training.cipCode && (
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">qr_code</InlineIcon>
                            {t("TrainingPage.cipCodeLabel")}&nbsp;
                            <InlineIcon
                              className="mrxs"
                              data-tooltip-id="totalClockHours-tooltip"
                              data-tooltip-content={t("TrainingPage.cipCodeTooltip")}
                            >
                              info
                            </InlineIcon>
                            <Tooltip id="totalClockHours-tooltip" className="custom-tooltip" />
                            <b>{t(training.cipCode)}</b>
                          </span>
                        </p>
                      )}
                    </>
                  </Grouping>

                  <Grouping title={t("TrainingPage.associatedOccupationsGroupHeader")}>
                    <>{getAssociatedOccupations()}</>
                  </Grouping>

                  <Grouping title={t("TrainingPage.shareGroupHeader")}>
                    <>
                      {training.inDemand && (
                        <p className="mvd" data-testid="shareInDemandTraining">
                          {t("TrainingPage.inDemandDescription")}
                        </p>
                      )}
                      <p>
                        <UnstyledButton className="link-format-blue" onClick={copyHandler}>
                          <Icon className="accessible-gray weight-500">link</Icon>
                          <span className="mlxs weight-500">{t("TrainingPage.copyLinkText")}</span>
                        </UnstyledButton>
                        {copy && (
                          <span className={`text-s weight-500 mls ${copy?.class}`}>
                            {copy?.text}
                          </span>
                        )}
                      </p>
                      <p>
                        <UnstyledButton className="link-format-blue" onClick={printHandler}>
                          <Icon className="accessible-gray weight-500">print</Icon>
                          <span className="mlxs weight-500">
                            {t("TrainingPage.savePrintLinkText")}
                          </span>
                        </UnstyledButton>
                      </p>
                      <p>
                        <Link className="link-format-blue weight-500 fin" to="/funding">
                          <Icon className="accessible-gray">attach_money</Icon>
                          <span className="blue">{t("TrainingPage.fundingLinkText")}</span>
                        </Link>
                      </p>
                    </>
                  </Grouping>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="container-fluid mbm">
                <div className="row">
                  <Grouping title={t("TrainingPage.costGroupHeader")}>
                    <>
                      <p>
                        <span className="weight-500">{t("TrainingPage.totalCostLabel")}</span>
                        <span className="text-l pull-right weight-500">
                          {formatMoney(training.totalCost)}
                        </span>
                      </p>
                      <div className="grey-line" />
                      <div className="mvd">
                        <div>
                          <span>{t("TrainingPage.tuitionCostLabel")}</span>
                          <span className="pull-right">{formatMoney(training.tuitionCost)}</span>
                        </div>
                        <div>
                          <span>{t("TrainingPage.feesCostLabel")}</span>
                          <span className="pull-right">{formatMoney(training.feesCost)}</span>
                        </div>
                        <div>
                          <span>{t("TrainingPage.materialsCostLabel")}</span>
                          <span className="pull-right">
                            {formatMoney(training.booksMaterialsCost)}
                          </span>
                        </div>
                        <div>
                          <span>{t("TrainingPage.suppliesCostLabel")}</span>
                          <span className="pull-right">
                            {formatMoney(training.suppliesToolsCost)}
                          </span>
                        </div>
                        <div>
                          <span>{t("TrainingPage.otherCostLabel")}</span>
                          <span className="pull-right">{formatMoney(training.otherCost)}</span>
                        </div>
                      </div>
                    </>
                  </Grouping>

                  <Grouping title={t("TrainingPage.providerGroupHeader")}>
                    <>
                      <p>
                        <span className="fin fas">
                          <InlineIcon className="mrxs">school</InlineIcon>
                          {training.provider.name}
                        </span>
                      </p>
                      <div className="mvd">
                        <span className="fin">
                          <InlineIcon className="mrxs">location_on</InlineIcon>
                          {getProviderAddress()}
                        </span>
                      </div>
                      <div className="mvd">
                        <span className="fin">
                          <InlineIcon className="mrxs">person</InlineIcon>
                          {getProviderContact()}
                        </span>
                      </div>
                      <p>
                        <span className="fin">
                          <InlineIcon className="mrxs">link</InlineIcon>
                          {getProviderUrl()}
                        </span>
                      </p>
                    </>
                  </Grouping>

                  <Grouping title={t("TrainingPage.providerServicesGroupHeader")}>
                    <>
                      {training.hasEveningCourses && (
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">nightlight_round</InlineIcon>
                            {t("TrainingPage.eveningCoursesServiceLabel")}
                          </span>
                        </p>
                      )}
                      {training.languages.length > 0 && (
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">language</InlineIcon>
                            {t("TrainingPage.otherLanguagesServiceLabel")}
                          </span>
                        </p>
                      )}
                      {training.isWheelchairAccessible && (
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">accessible_forward</InlineIcon>
                            {t("TrainingPage.wheelchairAccessibleServiceLabel")}
                          </span>
                        </p>
                      )}
                      {training.hasChildcareAssistance && (
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">family_restroom</InlineIcon>
                            {t("TrainingPage.childcareAssistanceServiceLabel")}
                          </span>
                        </p>
                      )}
                      {training.hasJobPlacementAssistance && (
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">work_outline</InlineIcon>
                            {t("TrainingPage.jobAssistanceServiceLabel")}
                          </span>
                        </p>
                      )}
                      <p>{t("TrainingPage.providerServicesDisclaimerLabel")}</p>
                    </>
                  </Grouping>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};
