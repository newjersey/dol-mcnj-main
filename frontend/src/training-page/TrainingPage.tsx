import { ReactElement, useEffect, useRef, useState } from "react";
import { Link, navigate, RouteComponentProps } from "@reach/router";

import { Client } from "../domain/Client";
import { Error } from "../domain/Error";
import { DeliveryType, Training } from "../domain/Training";
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
// import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useReactToPrint } from "react-to-print";
import { PROVIDER_MISSING_INFO, STAT_MISSING_DATA_INDICATOR } from "../constants";
import { Trans, useTranslation } from "react-i18next";
import { logEvent } from "../analytics";
import { cleanProviderName } from "../utils/cleanProviderName";
import { LinkObject } from "../components/modules/LinkObject";
import { IconNames } from "../types/icons";
import { Flag, LinkSimple, MagnifyingGlass, Printer } from "@phosphor-icons/react";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/Button";
import { QuickFacts } from "./QuickFacts";

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
    logEvent("Training page", "Clicked print link", training?.ctid);
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

    logEvent("Training page", "Clicked copy link", training?.ctid);
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
        onClick={() => logEvent("Training page", "Clicked provider link", training?.ctid)}
      >
        {training.provider.url}
      </a>
    );
  };

  const fundingContent = (
    <Grouping
      title="How to Get Funding"
      subheading="You may be eligible for funding for certain training opportunities"
    >
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
            iconSuffix={IconNames.ArrowSquareOut}
            iconSize={22}
          >
            New Jersey's One-Stop Career Centers
          </LinkObject>
        </div>
        <div>
          <p>You can also check out other tuition assistance opportunities.</p>
          <LinkObject url="/support-resources/tuition-assistance">
            View Tuition Assistance Resource
          </LinkObject>
        </div>
      </div>
    </Grouping>
  );

  const getProviderEmail = (): ReactElement => {
    if (!training?.provider?.email) {
      return <></>;
    }

    return (
      <p>
        <span className="fin fas">
          <InlineIcon className="mrxs">email</InlineIcon>
          <a href={`mailto:${training.provider.email}`}>{training.provider.email}</a>
        </span>
      </p>
    );
  };

  const getAvailableAtAddress = (): ReactElement => {
    if (!training) {
      return <>{PROVIDER_MISSING_INFO}</>;
    }

    // Map deliveryTypes to localized labels
    const deliveryTypes = training.deliveryTypes?.map((type) => {
      switch (type) {
        case "deliveryType:OnlineOnly":
          return t("TrainingPage.onlineClass"); // Translation key for "Online Only"
        case "deliveryType:InPerson":
          return t("TrainingPage.inPersonClass"); // Translation key for "In-person"
        case "deliveryType:BlendedDelivery":
          return t("TrainingPage.blendedClass"); // Translation key for "Blended Delivery"
        case "deliveryType:VariableSite":
          return t("TrainingPage.variableSiteClass"); // Translation key for "Variable Site"
        default:
          return t("TrainingPage.unknownDeliveryType"); // Translation key for unknown types
      }
    });

    // Format the address if it's available
    const address = training.availableAt?.[0];
    if (address) {
      const nameAndAddressEncoded = encodeURIComponent(
        `${address.street_address} ${address.city} ${address.state} ${address.zipCode}`,
      );
      const googleUrl = `https://www.google.com/maps/search/?api=1&query=${nameAndAddressEncoded}`;

      return (
        <div>
          <a
            href={googleUrl}
            target="_blank"
            className="link-format-blue"
            rel="noopener noreferrer"
          >
            <div className="inline">
              <span>{address.street_address}</span>
              <div>
                {address.city}, {address.state} {address.zipCode}
              </div>
            </div>
          </a>
          {deliveryTypes && (
            <div>
              <strong>{t("TrainingPage.deliveryTypeLabel")}:</strong> {deliveryTypes.join(", ")}
            </div>
          )}
        </div>
      );
    }

    // Default to showing delivery types if no address is available
    return (
      <div>
        {deliveryTypes && (
          <div>
            <strong>{t("TrainingPage.deliveryTypeLabel")}:</strong> {deliveryTypes.join(", ")}
          </div>
        )}
        {!deliveryTypes && <>{t("TrainingPage.noDeliveryTypeAvailable")}</>}
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
              {occupation.title} ({occupation.soc})
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

    let contactName, contactTitle, phoneNumber;
    if (training.provider.addresses && training.provider.addresses.length > 0) {
      for (const address of training.provider.addresses) {
        if (address.targetContactPoints && address.targetContactPoints.length > 0) {
          const mainContactPoint = address.targetContactPoints[0];
          contactName = mainContactPoint.name;
          contactTitle = mainContactPoint.contactType;
          phoneNumber = mainContactPoint.telephone?.[0];
          break; // Assuming we only need the first contact point found
        }
      }
    }

    const courseMode = (() => {
      if (training.deliveryTypes?.includes(DeliveryType.OnlineOnly)) {
        return "online";
      }
      if (training.deliveryTypes?.includes(DeliveryType.OnlineOnly)) {
        return "onsite";
      }
      if (training.deliveryTypes?.includes(DeliveryType.BlendedDelivery)) {
        return "blended";
      }
      return "variable"; // Fallback for other or unknown delivery types
    })();

    const courseInstance = {
      "@type": "CourseInstance",
      courseMode,
      instructor: {
        "@type": "Person",
        name: contactName,
        jobTitle: contactTitle,
        telephone: phoneNumber,
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
        value: training.ctid,
      },
      hasCourseInstance: courseInstance,
      offers: offer,
    };
  };

  if (!training) {
    if (error === Error.SYSTEM_ERROR) {
      return (
        <>
          <SomethingWentWrongPage client={props.client} />
        </>
      );
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
      return <></>;
    }
  }

  return (
    <div ref={componentRef} className="training-detail">
      <Layout client={props.client} seo={seoObject}>
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(generateJsonLd(training))}</script>
        </Helmet>
        <section className="crumb-container">
          <div className="container">
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
            <div className="form-overlay mobile-only" />
            <button>
              <MagnifyingGlass weight="bold" />
            </button>
            <form
              className="usa-search usa-search--small"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                navigate(`/training/search?q=${form.search.value}`);
              }}
            >
              <label className="mobile-only">Search for training</label>
              <input className="usa-input" type="search" placeholder="search" name="search" />
              <button className="usa-button" type="submit">
                <MagnifyingGlass weight="bold" />
              </button>
            </form>
          </div>
        </section>

        <section className="title-box">
          <div className="container">
            <div className="heading-box">
              <h1 data-testid="title">{training.name}</h1>
              {training.provider.name && <h2>{cleanProviderName(training.provider.name)}</h2>}
            </div>
            <ul className="save-controls unstyled">
              <li>
                <UnstyledButton className="link-format-blue" onClick={copyHandler}>
                  <LinkSimple size={26} className={copy ? "green" : undefined} />
                  {copy && <span className="green">Copied</span>}
                </UnstyledButton>
              </li>
              <li>
                <UnstyledButton className="link-format-blue" onClick={printHandler}>
                  <Printer size={26} />
                  <span className="sr-only">Print and Save</span>
                </UnstyledButton>
              </li>
            </ul>
          </div>
        </section>

        <section className="info-blocks container">
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
        </section>

        <section className="container plus main-section">
          <div className="row pbm group-wrapper">
            <div className="col-md-8">
              <div className="container-fluid">
                <div className="row">
                  <Grouping
                    title={t("TrainingPage.descriptionGroupHeader")}
                    subheading="About this learning opportunity"
                  >
                    <>
                      {training.description.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </>
                  </Grouping>

                  <QuickFacts training={training} setDrawerOpen={setDrawerOpen} />

                  <Grouping
                    title={t("TrainingPage.associatedOccupationsGroupHeader")}
                    subheading="Explore the occupations below to learn more."
                  >
                    <>{getAssociatedOccupations()}</>
                  </Grouping>

                  <div className="desktop-only">{fundingContent}</div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="container-fluid mbm">
                <div className="row">
                  <Grouping
                    title={t("TrainingPage.costGroupHeader")}
                    subheading="Detailed cost breakdown of the Learning Opportunity"
                  >
                    <>
                      <p>
                        <span className="weight-500">{t("TrainingPage.totalCostLabel")}</span>
                        <span className="text-l pull-right weight-500">
                          {training.totalCost
                            ? formatMoney(training.totalCost)
                            : t("Global.noDataAvailableText")}
                        </span>
                      </p>
                      <div className="grey-line" />
                      <div className="mvd">
                        <div>
                          <span>{t("TrainingPage.tuitionCostLabel")}</span>
                          <span className="pull-right">
                            {training.tuitionCost
                              ? formatMoney(training.tuitionCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                        <div>
                          <span>{t("TrainingPage.feesCostLabel")}</span>
                          <span className="pull-right">
                            {training.feesCost
                              ? formatMoney(training.feesCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                        <div>
                          <span>{t("TrainingPage.materialsCostLabel")}</span>
                          <span className="pull-right">
                            {training.booksMaterialsCost
                              ? formatMoney(training.booksMaterialsCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                        <div>
                          <span>{t("TrainingPage.suppliesCostLabel")}</span>
                          <span className="pull-right">
                            {training.suppliesToolsCost
                              ? formatMoney(training.suppliesToolsCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                        <div>
                          <span>{t("TrainingPage.otherCostLabel")}</span>
                          <span className="pull-right">
                            {training.otherCost
                              ? formatMoney(training.otherCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                      </div>
                    </>
                  </Grouping>
                  <Grouping
                    title={t("TrainingPage.locationGroupHeader")}
                    subheading="Geographic information about this Learning Opportunity"
                  >
                    <>
                      {training.provider && training.provider.ctid ? (
                        <>
                          <p>
                            <span className="fin fas">
                              {cleanProviderName(training.provider.name)}
                            </span>
                          </p>
                          {getProviderEmail()}
                          {getAvailableAtAddress() && (
                            <div className="mvd">
                              <span className="fin">
                                <InlineIcon className="mrxs">location_on</InlineIcon>
                                {getAvailableAtAddress()}
                              </span>
                            </div>
                          )}
                          <p>
                            <span className="fin">
                              <InlineIcon className="mrxs">link</InlineIcon>
                              {getProviderUrl()}
                            </span>
                          </p>
                        </>
                      ) : (
                        <>Data unavailable</>
                      )}
                    </>
                  </Grouping>

                  <Grouping
                    title={t("TrainingPage.providerServicesGroupHeader")}
                    subheading="Please confirm with provider on any support service needs"
                  >
                    <>
                      {training.hasEveningCourses && (
                        <p>
                          <span className="fin">
                            <InlineIcon className="mrxs">nightlight_round</InlineIcon>
                            {t("TrainingPage.eveningCoursesServiceLabel")}
                          </span>
                        </p>
                      )}
                      {training.languages.some((lang) => lang !== "en-US") && (
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
                      const pageSlug = `/training/${training.ctid}`;
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
        </section>
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
