import React, { ReactElement, useEffect, useState, useRef } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Training } from "../domain/Training";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { InlineIcon } from "../components/InlineIcon";
import { BetaBanner } from "../components/BetaBanner";
import { InDemandTag } from "../components/InDemandTag";
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

  useEffect(() => {
    if (training) {
      document.title = `${training.name}`;
    }
  }, [training]);

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

  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });

  const copyHandler = (): void => {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch {
      setCopy({
        class: "red",
        text: t("TrainingPageStrings.unsuccessfulCopy"),
      });
    }

    setCopy({
      class: "green",
      text: t("TrainingPageStrings.successfulCopy"),
    });

    setTimeout((): void => {
      setCopy(null);
    }, 5000);
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
      >
        {training.provider.url}
      </a>
    );
  };

  const getProviderAddress = (): ReactElement => {
    if (training?.online) {
      return <>{t("TrainingPageStrings.onlineClass")}</>;
    }

    if (!training || !training.provider.address.city) {
      return <>{PROVIDER_MISSING_INFO}</>;
    }

    const address = training.provider.address;
    const nameAndAddressEncoded = encodeURIComponent(
      `${training.provider.name} ${address.street1} ${address.street2} ${address.city} ${address.state} ${address.zipCode}`
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
      "US"
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
          <Trans i18nKey="TrainingPageStrings.associatedOccupationsText">
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

  if (training) {
    return (
      <>
        <div ref={componentRef}>
          <Header />
          <BetaBanner />
          <main className="container below-banners" role="main">
            <div className="ptm weight-500 fin all-caps border-bottom-dark">
              {t("TrainingPageStrings.header")}
            </div>
            <h2 className="text-xl ptd pbs weight-500">{training.name}</h2>
            <h3 className="text-l pbs weight-500">{training.provider.name}</h3>
            {training.inDemand ? <InDemandTag className="mts" /> : <></>}

            <div className="stat-block-stack mtm">
              <StatBlock
                title={t("TrainingPageStrings.avgSalaryTitle")}
                tooltipText={t("TrainingPageStrings.avgSalaryTooltip")}
                data={
                  training.averageSalary
                    ? formatMoney(training.averageSalary, { precision: 0 })
                    : STAT_MISSING_DATA_INDICATOR
                }
                backgroundColorClass="bg-lightest-purple"
              />
              <StatBlock
                title={t("TrainingPageStrings.employmentRateTitle")}
                tooltipText={t("TrainingPageStrings.employmentRateTooltip")}
                data={
                  training.percentEmployed
                    ? formatPercentEmployed(training.percentEmployed)
                    : STAT_MISSING_DATA_INDICATOR
                }
                backgroundColorClass="bg-lighter-purple"
              />
            </div>

            <div className="row pbm">
              <div className="col-md-8">
                <div className="container-fluid">
                  <div className="row">
                    <Grouping title={t("TrainingPageStrings.descriptionGroupHeader")}>
                      <>
                        {training.description.split("\n").map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </>
                    </Grouping>

                    <Grouping title={t("TrainingPageStrings.quickStatsGroupHeader")}>
                      <>
                        {training.certifications && (
                          <p>
                            <span className="fin">
                              <InlineIcon className="mrxs">school</InlineIcon>
                              {t("TrainingPageStrings.certificationsLabel")}&nbsp;
                              {training.certifications}
                            </span>
                          </p>
                        )}
                        {training.prerequisites && (
                          <p>
                            <span className="fin">
                              <InlineIcon className="mrxs">list_alt</InlineIcon>
                              {t("TrainingPageStrings.prereqsLabel")}&nbsp;{training.prerequisites}
                            </span>
                          </p>
                        )}
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">av_timer</InlineIcon>
                            {t("TrainingPageStrings.completionTimeLabel")}&nbsp;
                            {t(`CalendarLengthLookup.${training.calendarLength}`)}
                          </span>
                        </p>
                      </>
                    </Grouping>

                    <Grouping title={t("TrainingPageStrings.associatedOccupationsGroupHeader")}>
                      <>{getAssociatedOccupations()}</>
                    </Grouping>

                    <Grouping title={t("TrainingPageStrings.shareGroupHeader")}>
                      <>
                        {training.inDemand && (
                          <p className="mvd" data-testid="shareInDemandTraining">
                            {t("TrainingPageStrings.inDemandDescription")}
                          </p>
                        )}
                        <p>
                          <UnstyledButton className="link-format-blue" onClick={copyHandler}>
                            <Icon className="accessible-gray weight-500">link</Icon>
                            <span className="mlxs weight-500">
                              {t("TrainingPageStrings.copyLinkText")}
                            </span>
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
                              {t("TrainingPageStrings.savePrintLinkText")}
                            </span>
                          </UnstyledButton>
                        </p>
                        <p>
                          <Link className="link-format-blue weight-500 fin" to="/funding">
                            <Icon className="accessible-gray">attach_money</Icon>
                            <span className="blue">{t("TrainingPageStrings.fundingLinkText")}</span>
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
                    <Grouping title={t("TrainingPageStrings.costGroupHeader")}>
                      <>
                        <p>
                          <span className="weight-500">
                            {t("TrainingPageStrings.totalCostLabel")}
                          </span>
                          <span className="text-l pull-right weight-500">
                            {formatMoney(training.totalCost)}
                          </span>
                        </p>
                        <div className="grey-line" />
                        <div className="mvd">
                          <div>
                            <span>{t("TrainingPageStrings.tuitionCostLabel")}</span>
                            <span className="pull-right">{formatMoney(training.tuitionCost)}</span>
                          </div>
                          <div>
                            <span>{t("TrainingPageStrings.feesCostLabel")}</span>
                            <span className="pull-right">{formatMoney(training.feesCost)}</span>
                          </div>
                          <div>
                            <span>{t("TrainingPageStrings.materialsCostLabel")}</span>
                            <span className="pull-right">
                              {formatMoney(training.booksMaterialsCost)}
                            </span>
                          </div>
                          <div>
                            <span>{t("TrainingPageStrings.suppliesCostLabel")}</span>
                            <span className="pull-right">
                              {formatMoney(training.suppliesToolsCost)}
                            </span>
                          </div>
                          <div>
                            <span>{t("TrainingPageStrings.otherCostLabel")}</span>
                            <span className="pull-right">{formatMoney(training.otherCost)}</span>
                          </div>
                        </div>
                      </>
                    </Grouping>

                    <Grouping title={t("TrainingPageStrings.providerGroupHeader")}>
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

                    <Grouping title={t("TrainingPageStrings.providerServicesGroupHeader")}>
                      <>
                        {training.hasEveningCourses && (
                          <p>
                            <span className="fin">
                              <InlineIcon className="mrxs">nightlight_round</InlineIcon>
                              {t("TrainingPageStrings.eveningCoursesServiceLabel")}
                            </span>
                          </p>
                        )}
                        {training.languages.length > 0 && (
                          <p>
                            <span className="fin">
                              <InlineIcon className="mrxs">language</InlineIcon>
                              {t("TrainingPageStrings.otherLanguagesServiceLabel")}
                            </span>
                          </p>
                        )}
                        {training.isWheelchairAccessible && (
                          <p>
                            <span className="fin">
                              <InlineIcon className="mrxs">accessible_forward</InlineIcon>
                              {t("TrainingPageStrings.wheelchairAccessibleServiceLabel")}
                            </span>
                          </p>
                        )}
                        {training.hasChildcareAssistance && (
                          <p>
                            <span className="fin">
                              <InlineIcon className="mrxs">family_restroom</InlineIcon>
                              {t("TrainingPageStrings.childcareAssistanceServiceLabel")}
                            </span>
                          </p>
                        )}
                        {training.hasJobPlacementAssistance && (
                          <p>
                            <span className="fin">
                              <InlineIcon className="mrxs">work_outline</InlineIcon>
                              {t("TrainingPageStrings.jobAssistanceServiceLabel")}
                            </span>
                          </p>
                        )}
                        <p>{t("TrainingPageStrings.providerServicesDisclaimerLabel")}</p>
                      </>
                    </Grouping>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  } else if (error === Error.SYSTEM_ERROR) {
    return <SomethingWentWrongPage />;
  } else if (error === Error.NOT_FOUND) {
    return <NotFoundPage />;
  } else {
    return <></>;
  }
};
