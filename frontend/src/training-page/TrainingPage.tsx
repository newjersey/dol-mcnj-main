import { ReactElement, useEffect, useState, useRef } from "react";
import { Link, RouteComponentProps } from "@reach/router";

import { Client } from "../domain/Client";
import { Error } from "../domain/Error";
import { Training } from "../domain/Training";
import { InlineIcon } from "../components/InlineIcon";

import { SomethingWentWrongPage } from "../error/SomethingWentWrongPage";
import { NotFoundPage } from "../error/NotFoundPage";

import { Grouping } from "../components/Grouping";
import { InDemandBlock } from "../components/InDemandBlock";
import { Layout } from "../components/Layout";
import { StatBlock } from "../components/StatBlock";
import { UnstyledButton } from "../components/UnstyledButton";
import { CipDrawerContent } from "../components/CipDrawerContent";

import { usePageTitle } from "../utils/usePageTitle";

import { formatPercentEmployed } from "../presenters/formatPercentEmployed";

import { Icon } from "@material-ui/core";
import { formatMoney } from "accounting";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { PROVIDER_MISSING_INFO, STAT_MISSING_DATA_INDICATOR } from "../constants";
import { Trans, useTranslation } from "react-i18next";
import { logEvent } from "../analytics";
import { useReactToPrint } from "react-to-print";
import { Tooltip } from "react-tooltip";
import { LinkObject } from "../components/modules/LinkObject";
import { IconNames } from "../types/icons";
import { LinkSimple, Printer } from "@phosphor-icons/react";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/Button";
import { Flag } from "@phosphor-icons/react";
import { formatCip } from "../utils/formatCip";

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
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [training, setTraining] = useState<Training | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [copy, setCopy] = useState<Copy | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  usePageTitle(`${training?.name} | Training | ${process.env.REACT_APP_SITE_NAME}`);

  useEffect(() => {
    setLoading(true); // Start loading
    const idToFetch = props.id ? props.id : "";
    props.client.getTrainingById(idToFetch, {
      onSuccess: (result: Training) => {
        setError(null);
        setTraining(result);
        setLoading(false); // End loading
      },
      onError: (error: Error) => {
        setError(error);
        setLoading(false);
      },
    });
  }, [props.id, props.client]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const overlay = document.querySelector("#drawerOverlay");
      if (overlay) {
        overlay.addEventListener("click", () => {
          setDrawerOpen(false);
        });
      }
    }
  }, [drawerOpen]);

  const printReactContent = useReactToPrint({
    content: () => componentRef.current,
  });

  if (loading) return <div>Loading...</div>;
  // Render error pages only if loading is complete
  if (error === Error.NOT_FOUND) return <NotFoundPage client={props.client} />;
  if (error) return <SomethingWentWrongPage client={props.client} />;
  if (!training) return <></>;

  if (!loading && !training) {
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
                <a style={{ color: "#005EA2" }} href="/training/search">
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
      return (
        <NotFoundPage client={props.client} heading="Training not found">
          <>
            <p>
              This training is no longer listed or we may be experiencing technical difficulties.
              However, you can try out these other helpful links:
            </p>
            <ul className="unstyled">
              <li style={{ marginTop: "22px" }}>
                <a style={{ color: "#005EA2" }} href="/training/search">
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
    }
  }

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

  const fundingContent = (
    <Grouping title="How to get funding">
      <div className="funding-content">
        <div>
          <p className="mvd" data-testid="shareInDemandTraining">
            Trainings related to occupations on the{" "}
            <LinkObject url="/in-demand-occupations">In - Demand Occupations List</LinkObject> may
            be eligible for funding. Contact your local One-Stop Career Center for more information
            regarding program and training availability.
          </p>
          <LinkObject
            url="https://www.nj.gov/labor/career-services/contact-us/one-stops/"
            className="usa-button primary usa-button--outline"
            iconSuffix={IconNames.ArrowSquareOut}
            iconSize={22}
          >
            New Jersey's One-Stop Career Centers
          </LinkObject>
        </div>
        <div>
          <p>You can also check out other tuition assistance opportunities.</p>
          <LinkObject
            url="/support-resources/tuition-assistance"
            className="usa-button secondary usa-button--outline"
          >
            View Tuition Assistance Resource
          </LinkObject>
        </div>
      </div>
    </Grouping>
  );

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
    title: training
      ? `${training ? training.name : ""} | Training | ${process.env.REACT_APP_SITE_NAME}`
      : `Training | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription: training?.description,
    url: props.location?.pathname || "/training",
  };

  const generateJsonLd = (training: Training) => {
    const audience = [
      {
        "@type": "Audience",
        audienceType: "Students",
        geographicArea: {
          "@type": "Place",
          name: "New Jersey",
          geo: {
            "@type": "GeoCoordinates",
            latitude: 40.0583, // New Jersey's approximate latitude
            longitude: -74.4057, // New Jersey's approximate longitude
          },
        },
      },
      {
        "@type": "Audience",
        audienceType: "Workers",
        geographicArea: {
          "@type": "Place",
          name: "New Jersey",
          geo: {
            "@type": "GeoCoordinates",
            latitude: 40.0583, // New Jersey's approximate latitude
            longitude: -74.4057, // New Jersey's approximate longitude
          },
        },
      },
    ];

    const courseInstance = {
      "@type": "CourseInstance",
      courseMode: training.online ? "online" : "onsite",
      instructor: {
        "@type": "Person",
        name: training.provider.contactName,
        jobTitle: training.provider.contactTitle,
        telephone: training.provider.phoneNumber,
      },
      courseWorkload: training.totalClockHours ? `PT${training.totalClockHours}H` : "PT0H",
    };

    const offer = {
      "@type": "Offer",
      url: training.provider.url,
      priceCurrency: "USD",
      price: training.totalCost,
      eligibleRegion: {
        "@type": "Place",
        name: "New Jersey",
      },
      category: "Tuition",
    };

    return {
      "@context": "http://schema.org",
      "@type": "Course",
      name: training.name,
      description: training.description,
      provider: {
        "@type": "Organization",
        name: training.provider.name,
        sameAs: training.provider.url,
      },
      audience: audience,
      identifier: {
        "@type": "PropertyValue",
        name: "Program ID",
        value: training.id,
      },
      hasCourseInstance: courseInstance,
      offers: offer,
    };
  };

  return (
    <div ref={componentRef} className="training-detail">
      <Layout client={props.client} seo={seoObject}>
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(generateJsonLd(training))}</script>
        </Helmet>
        <div className="container plus">
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
                      <a className="usa-breadcrumb__link" href="/training/search">
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
          <div className="title-box">
            <h2 data-testid="title" className="text-xl ptd pbs weight-500">
              {training.name}
            </h2>
            <ul className="save-controls unstyled">
              <li>
                <UnstyledButton className="link-format-blue" onClick={copyHandler}>
                  <LinkSimple size={26} className={copy ? "green" : undefined} />
                  <span className={copy ? "green" : undefined}>
                    {copy ? "Copied!" : "Copy link"}
                  </span>
                </UnstyledButton>
              </li>
              <li>
                <UnstyledButton className="link-format-blue" onClick={printHandler}>
                  <Printer size={26} />
                  <span className="mlxs weight-500">Print and Save</span>
                </UnstyledButton>
              </li>
            </ul>
          </div>
          <h3 className="text-l pbs weight-500">{training.provider.name}</h3>
          <div className="stat-block-stack mtm">
            {training.inDemand ? (
              <InDemandBlock message={t("InDemandBlock.trainingMessage")} />
            ) : (
              <></>
            )}

            {!training.inDemand &&
            training.localExceptionCounty &&
            training.localExceptionCounty.length !== 0 ? (
              <InDemandBlock
                counties={training.localExceptionCounty}
                message={t("InDemandBlock.trainingMessage")}
              />
            ) : (
              <></>
            )}

            <div className="stat-block-container">
              <StatBlock
                title={t("TrainingPage.avgSalaryTitle")}
                tooltipText={t("TrainingPage.avgSalaryTooltip")}
                disclaimer={t("")}
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
                disclaimer={t("")}
                data={
                  training.percentEmployed
                    ? formatPercentEmployed(training.percentEmployed)
                    : STAT_MISSING_DATA_INDICATOR
                }
                backgroundColorClass="bg-light-purple-50"
              />
            </div>
          </div>
          <ul className="save-controls mobile-only unstyled">
            <li>
              <UnstyledButton className="link-format-blue" onClick={copyHandler}>
                <LinkSimple size={26} className={copy ? "green" : undefined} />
                <span className={copy ? "green" : undefined}>{copy ? "Copied!" : "Copy link"}</span>
              </UnstyledButton>
            </li>
            <li>
              <UnstyledButton className="link-format-blue" onClick={printHandler}>
                <Printer size={26} />
                <span className="mlxs weight-500">Print and Save</span>
              </UnstyledButton>
            </li>
          </ul>
          <div className="row pbm group-wrapper">
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
                            {training.totalClockHours
                              ? t("TrainingPage.totalClockHours", {
                                  hours: training.totalClockHours,
                                })
                              : t("Global.noDataAvailableText")}
                          </b>
                        </span>
                      </p>

                      {training.cipDefinition ? (
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">book</InlineIcon>
                            <button
                              type="button"
                              className="toggle"
                              onClick={(e) => {
                                e.preventDefault();
                                setDrawerOpen(true);
                              }}
                            >
                              {t("TrainingPage.cipCodeLabel")}
                            </button>
                            &nbsp;&nbsp;
                          </span>
                          <>
                            <a
                              href={`https://nces.ed.gov/ipeds/cipcode/cipdetail.aspx?y=56&cip=${formatCip(training.cipDefinition.cipcode)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {formatCip(training.cipDefinition.cipcode)}
                            </a>
                            <br />
                            <b>{training.cipDefinition.ciptitle}</b>
                          </>
                        </p>
                      ) : (
                        <span>{t("Global.noDataAvailableText")}</span>
                      )}
                    </>
                  </Grouping>

                  <Grouping title={t("TrainingPage.associatedOccupationsGroupHeader")}>
                    <>{getAssociatedOccupations()}</>
                  </Grouping>

                  <div className="desktop-only">{fundingContent}</div>
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
                  <Button
                    variant="custom"
                    className="usa-button margin-right-0 custom-button report"
                    onClick={() => {
                      const pageSlug = `/training/${training.id}`;
                      const url = `/contact?path=${encodeURIComponent(pageSlug)}&title=${encodeURIComponent(training.name)}`;
                      window.open(url, "_blank");
                    }}
                  >
                    <Flag size={32} />
                    <span>See something wrong? Report an Issue.</span>
                  </Button>
                  <div className="mobile-only">{fundingContent}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Overlay and Drawer for CIP code information */}
        {drawerOpen && (
          <>
            <div id="drawerOverlay" className={`overlay${drawerOpen ? " open" : ""}`} />
            <div className={`panel${drawerOpen ? " open" : ""}`}>
              <CipDrawerContent onClose={() => setDrawerOpen(false)} />
            </div>
          </>
        )}
      </Layout>
    </div>
  );
};
