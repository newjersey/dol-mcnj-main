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
import { logEvent } from "../analytics";

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

    alert(JSON.stringify(training));

    if (!training || !training.provider.addresses) {
      return <>{PROVIDER_MISSING_INFO}</>;
    }

    const addresses = training.provider.addresses;
    const addressBlocks = [];

    for (let i=0; i < addresses.length; i++) {
      const nameAndAddressEncoded = encodeURIComponent(
        `${training.provider.name} ${addresses[i].street1} ${addresses[i].street2} ${addresses[i].city} ${addresses[i].state} ${addresses[i].zipCode}`
      );

      const googleUrl = `https://www.google.com/maps/search/?api=1&query=${nameAndAddressEncoded}`;

      addressBlocks.push(
        <a href={googleUrl} target="_blank" className="link-format-blue" rel="noopener noreferrer">
          <div className="inline">
            <span>{addresses[i].street1}</span>
            <div>{addresses[i].street2}</div>
            <div>
              {addresses[i].city}, {addresses[i].state} {addresses[i].zipCode}
            </div>
          </div>
        </a>
      );
    }

    return <div>{addressBlocks}</div>;
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

  if (training) {
    return (
      <>
        <div ref={componentRef}>
          <Header />
          <BetaBanner />
          <main className="container below-banners" role="main">
            <div className="ptm weight-500 fin all-caps border-bottom-dark">
              {t("TrainingPage.header")}
            </div>
            <h2 className="text-xl ptd pbs weight-500">{training.name}</h2>
            <h3 className="text-l pbs weight-500">{training.provider.name}</h3>
            {training.inDemand ? <InDemandTag className="mts" /> : <></>}

            <div className="stat-block-stack mtm">
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
                backgroundColorClass="bg-lighter-purple"
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
                              {training.certifications}
                            </span>
                          </p>
                        )}
                        {training.prerequisites && (
                          <p>
                            <span className="fin">
                              <InlineIcon className="mrxs">list_alt</InlineIcon>
                              {t("TrainingPage.prereqsLabel")}&nbsp;{training.prerequisites}
                            </span>
                          </p>
                        )}
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">av_timer</InlineIcon>
                            {t("TrainingPage.completionTimeLabel")}&nbsp;
                            {t(`CalendarLengthLookup.${training.calendarLength}`)}
                          </span>
                        </p>
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
                            <span className="mlxs weight-500">
                              {t("TrainingPage.copyLinkText")}
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
