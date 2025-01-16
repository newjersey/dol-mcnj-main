import { ReactElement, useEffect, useRef, useState } from "react";
import { navigate, RouteComponentProps } from "@reach/router";

import { Client } from "../domain/Client";
import { Error } from "../domain/Error";
import { DeliveryType, Training } from "../domain/Training";

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
import {
  Envelope,
  Flag,
  LinkSimple,
  MagnifyingGlass,
  MapPin,
  Printer,
  User,
  X,
} from "@phosphor-icons/react";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/Button";
import { QuickFacts } from "./QuickFacts";
import { formatCip } from "../utils/formatCip";
import { ProviderServices } from "./ProviderServices";
import { SocDrawerContent } from "../components/SocDrawerContent";
import parsePhoneNumberFromString from "libphonenumber-js";
import { Skeleton } from "@material-ui/lab";

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
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [training, setTraining] = useState<Training | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<"cip" | "soc" | "">("");
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
      const searchOverlay = document.querySelector("#searchOverlay");
      if (overlay) {
        overlay.addEventListener("click", () => {
          setDrawerOpen(false);
        });
      }

      if (searchOverlay) {
        searchOverlay.addEventListener("click", () => {
          setSearchOpen(false);
        });
      }

      if (drawerOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  }, [drawerOpen, searchOpen]);

  useEffect(() => {
    // when pressing the escape key, close the drawer
    const closeOnEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", closeOnEsc);
  }, []);

  const printReactContent = useReactToPrint({
    content: () => componentRef.current,
  });

  const Crumbs = ({ name }: { name: string }) => (
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
              <span>{name}</span>
            </li>
          </ol>
        </nav>
        <button
          aria-label="Open search"
          className="search-toggle mobile-only"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <span className="sr-only">open search</span>
          <MagnifyingGlass weight="bold" size={32} />
        </button>
        <div
          id="searchOverlay"
          className={`form-overlay mobile-only${searchOpen ? " open" : ""}`}
        />
        <form
          id="searchForm"
          className={`usa-search usa-search--small${searchOpen ? " open" : ""}`}
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            navigate(`/training/search?q=${form.search.value}`);
          }}
        >
          <label className="mobile-only">Search for training</label>
          <input className="usa-input" type="search" placeholder="search" name="search" />
          <button className="usa-button" type="submit" aria-label="Search">
            <MagnifyingGlass weight="bold" />
          </button>
          <a
            className="close-button mobile-only"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setSearchOpen(false);
            }}
          >
            <X weight="bold" size={24} />
          </a>
        </form>
      </div>
    </section>
  );

  const SkelCard = () => (
    <div className="mtm grouping">
      <div className="bg-light-green pvs bar">
        <Skeleton width="100%" height={35} />
        <Skeleton width="50%" />
      </div>
      <div className="pts group-padding border-light-green">
        <Skeleton width="100%" />
        <Skeleton width="100%" />
        <Skeleton width="50%" />
      </div>
    </div>
  );

  if (loading)
    return (
      <div ref={componentRef} className="training-detail">
        <Layout client={props.client}>
          <Crumbs name="...Loading" />
          <section
            className="title-box"
            style={{
              height: "93px",
            }}
          >
            <div className="container">
              <div className="heading-box" style={{ width: "100%" }}>
                <Skeleton width="50%" height={35} />
                <Skeleton width="30%" height={19} />
              </div>
            </div>
          </section>
          <section className="container plus main-section">
            <div className="row pbm group-wrapper">
              <div className="col-md-8">
                <div className="container-fluid">
                  <div className="row">
                    <SkelCard />
                    <SkelCard />
                    <SkelCard />
                    <SkelCard />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="container-fluid mbm">
                  <div className="row">
                    <SkelCard />
                    <SkelCard />
                    <SkelCard />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Layout>
      </div>
    );
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
                <a href="/training/search">Find Training Opportunities</a>
              </li>
              <li style={{ marginTop: "22px" }}>
                <a href="/support-resources/tuition-assistance">Tuition Assistance Resources</a>
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
                <a href="/training/search">Find Training Opportunities</a>
              </li>
              <li style={{ marginTop: "22px" }}>
                <a href="/support-resources/tuition-assistance">Tuition Assistance Resources</a>
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
      return <span>{PROVIDER_MISSING_INFO || "Provider URL not available"}</span>;
    }

    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="break-text"
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
          <p data-testid="shareInDemandTraining">
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
            Contact One-Stop Career Centers
          </LinkObject>
        </div>
        <div>
          <p>
            You can also check out other tuition assistance opportunities and resources by clicking
            the link below.
          </p>
          <LinkObject newTab url="/support-resources/tuition-assistance">
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
      <div className="fact-item">
        <div className="label">
          <Envelope size={18} />
        </div>
        <a href={`mailto:${training.provider.email}`}>{training.provider.email}</a>
      </div>
    );
  };

  const getProgramContact = (): ReactElement => {
    if (!training?.availableAt?.length) {
      return <></>;
    }

    const contactPoint = training.availableAt[0]?.targetContactPoints?.[0];

    if (!contactPoint) {
      return <span>Contact information not available</span>;
    }

    const name = contactPoint.name || "Contact name not specified";
    const contactType = contactPoint.contactType || "Type not specified";
    const email = contactPoint.email || "Email not available";
    const rawPhoneNumber = contactPoint.telephone?.[0];
    const phoneNumber = rawPhoneNumber
      ? parsePhoneNumberFromString(rawPhoneNumber, "US")?.formatNational() || rawPhoneNumber
      : "Phone not available";

    return (
      <div className="inline">
        <div> {name}</div>
        <div>{contactType}</div>
        <div>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
        <div>{phoneNumber}</div>
      </div>
    );
  };

  const getAvailableAtAddress = (): ReactElement => {
    if (!training) {
      return <>{PROVIDER_MISSING_INFO}</>;
    }

    // Format the address if it's available
    const address = training.availableAt?.[0];
    if (address) {
      const nameAndAddressEncoded = encodeURIComponent(
        `${address.street_address} ${address.city} ${address.state} ${address.zipCode}`,
      );
      const googleUrl = `https://www.google.com/maps/search/?api=1&query=${nameAndAddressEncoded}`;

      return (
        <div>
          <a href={googleUrl} target="_blank" rel="noopener noreferrer">
            <div className="inline">
              <span>{address.street_address}</span>
              <div>
                {address.city}, {address.state} {address.zipCode}
              </div>
            </div>
          </a>
        </div>
      );
    }

    // Default to showing delivery types if no address is available
    return <></>;
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
            <LinkObject newTab url="/in-demand-occupations">
              in-demand occupations
            </LinkObject>
            to see how you might apply this training.
          </Trans>
        </p>
      );
    }

    return (
      <ul>
        {training?.occupations.map((occupation, i) => (
          <li key={occupation.soc + i}>
            <LinkObject newTab url={`/occupation/${occupation.soc}`}>
              {occupation.title} ({occupation.soc})
            </LinkObject>
          </li>
        ))}
      </ul>
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

    let contactName = "N/A";
    let contactTitle = "N/A";
    let phoneNumber = "N/A";

    if (training.provider?.address?.length) {
      const address = training.provider.address.find(
        (addr) => addr?.targetContactPoints?.length && addr.targetContactPoints.length > 0,
      );

      if (address && address.targetContactPoints) {
        const mainContactPoint = address.targetContactPoints[0];
        contactName = mainContactPoint?.name || "N/A";
        contactTitle = mainContactPoint?.contactType || "N/A";
        phoneNumber = mainContactPoint?.telephone?.[0] || "N/A";
      }
    }

    const courseMode = (() => {
      if (training.deliveryTypes?.includes(DeliveryType.OnlineOnly)) {
        return "online";
      }
      if (training.deliveryTypes?.includes(DeliveryType.InPerson)) {
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
      url: training.provider?.url || "",
      priceCurrency: "USD",
      price: training.totalCost || 0,
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
      description: training.description || "",
      provider: training.provider
        ? {
            "@type": "Organization",
            name: training.provider.name || "Unknown Provider",
            sameAs: training.provider.url || "",
          }
        : {
            "@type": "Organization",
            name: "Provider information not available",
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
                <a href="/training/search">Find Training Opportunities</a>
              </li>
              <li style={{ marginTop: "22px" }}>
                <a href="/support-resources/tuition-assistance">Tuition Assistance Resources</a>
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
        <Crumbs name={training.name} />

        <section className="title-box">
          <div className="container">
            <div className="heading-box">
              <h1 data-testid="title">{training.name}</h1>
              {training.provider?.name
                ? cleanProviderName(training.provider.name)
                : "Provider information not available"}
            </div>
            <ul className="save-controls unstyled">
              <li>
                <UnstyledButton
                  onClick={copyHandler}
                  className={copy ? "green" : undefined}
                  aria-label="Copy link to clipboard"
                >
                  <LinkSimple size={26} />
                  <span
                    className={`indicator${copy ? " green" : ""}`}
                  >{`Cop${copy ? "ied" : "y"}`}</span>
                </UnstyledButton>
              </li>
              <li>
                <UnstyledButton onClick={printHandler} aria-label="Print and save">
                  <Printer size={26} />
                  <span className="indicator">Print and Save</span>
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
          />
        </section>

        <section className="container plus main-section">
          <div className="row pbm group-wrapper">
            <div className="col-md-8">
              <div className="container-fluid">
                <div className="row">
                  <Grouping
                    title={t("TrainingPage.descriptionGroupHeader")}
                    subheading="About this Learning Opportunity"
                  >
                    <>
                      {training.description.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </>
                  </Grouping>

                  <QuickFacts training={training} />
                  <Grouping
                    className="mobile-only"
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
                        <div className="cost-item">
                          <span>{t("TrainingPage.tuitionCostLabel")}</span>
                          <span className="pull-right">
                            {training.tuitionCost !== null && training.tuitionCost !== undefined
                              ? formatMoney(training.tuitionCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                        <div className="cost-item">
                          <span>{t("TrainingPage.feesCostLabel")}</span>
                          <span className="pull-right">
                            {training.feesCost !== null && training.feesCost !== undefined
                              ? formatMoney(training.feesCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                        <div className="cost-item">
                          <span>{t("TrainingPage.materialsCostLabel")}</span>
                          <span className="pull-right">
                            {training.booksMaterialsCost !== null &&
                            training.booksMaterialsCost !== undefined
                              ? formatMoney(training.booksMaterialsCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                        <div className="cost-item">
                          <span>{t("TrainingPage.suppliesCostLabel")}</span>
                          <span className="pull-right">
                            {training.suppliesToolsCost !== null &&
                            training.suppliesToolsCost !== undefined
                              ? formatMoney(training.suppliesToolsCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                        <div className="cost-item">
                          <span>{t("TrainingPage.otherCostLabel")}</span>
                          <span className="pull-right">
                            {training.otherCost !== null && training.otherCost !== undefined
                              ? formatMoney(training.otherCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                      </div>
                    </>
                  </Grouping>
                  <Grouping
                    className="mobile-only"
                    title={t("TrainingPage.locationGroupHeader")}
                    subheading="Geographic and contact information for this Learning Opportunity"
                  >
                    <>
                      {training.provider && training.provider.ctid ? (
                        <>
                          <p>
                            <span className="fin fas">
                              {training.provider?.name
                                ? cleanProviderName(training.provider.name)
                                : "Provider information not available"}
                            </span>
                          </p>
                          {getProviderEmail()}
                          {getAvailableAtAddress() && (
                            <div className="fact-item">
                              <span className="label">
                                <MapPin size={18} weight="fill" />
                              </span>
                              {getAvailableAtAddress()}
                            </div>
                          )}
                          <div className="fact-item">
                            <span className="label">
                              <LinkSimple size={18} weight="bold" />
                            </span>
                            {getProviderUrl()}
                          </div>
                        </>
                      ) : (
                        <>Provider information is unavailable</>
                      )}
                    </>
                  </Grouping>
                  {training.cipDefinition && (
                    <Grouping
                      title="Instructional Programs"
                      subheading="Type of material covered by the Learning Opportunity"
                    >
                      <>
                        <button
                          className="sect-title"
                          onClick={() => {
                            setDrawerOpen(true);
                            setActiveDrawer("cip");
                          }}
                        >
                          Classification of Instructional Programs
                        </button>
                        <br />
                        <ul>
                          <li>
                            <a
                              href={`https://nces.ed.gov/ipeds/cipcode/cipdetail.aspx?y=56&cip=${formatCip(training.cipDefinition.cipcode)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {training.cipDefinition.ciptitle} (
                              {formatCip(training.cipDefinition.cipcode)})
                            </a>
                          </li>
                        </ul>
                      </>
                    </Grouping>
                  )}

                  <Grouping
                    title={t("TrainingPage.associatedOccupationsGroupHeader")}
                    subheading="Explore the occupations below to learn more"
                  >
                    <>
                      <button
                        className="sect-title"
                        onClick={() => {
                          setDrawerOpen(true);
                          setActiveDrawer("soc");
                        }}
                      >
                        Standard Occupational Classification
                      </button>
                      <br />
                      {getAssociatedOccupations()}
                    </>
                  </Grouping>

                  <div className="desktop-only">{fundingContent}</div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="container-fluid mbm">
                <div className="row">
                  <Grouping
                    className="desktop-only"
                    title={t("TrainingPage.costGroupHeader")}
                    subheading="Detailed cost breakdown of the Learning Opportunity"
                  >
                    <>
                      <p>
                        <span className="weight-500">{t("TrainingPage.totalCostLabel")}</span>
                        <span className="text-l pull-right weight-500">
                          {training.totalCost !== null && training.totalCost !== undefined
                            ? formatMoney(training.totalCost)
                            : t("Global.noDataAvailableText")}
                        </span>
                      </p>
                      <div className="grey-line" />
                      <div className="mvd">
                        <div className="cost-item">
                          <span>{t("TrainingPage.tuitionCostLabel")}</span>
                          <span className="pull-right">
                            {training.tuitionCost !== null && training.tuitionCost !== undefined
                              ? formatMoney(training.tuitionCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                        <div className="cost-item">
                          <span>{t("TrainingPage.feesCostLabel")}</span>
                          <span className="pull-right">
                            {training.feesCost !== null && training.feesCost !== undefined
                              ? formatMoney(training.feesCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                        <div className="cost-item">
                          <span>{t("TrainingPage.materialsCostLabel")}</span>
                          <span className="pull-right">
                            {training.booksMaterialsCost !== null &&
                            training.booksMaterialsCost !== undefined
                              ? formatMoney(training.booksMaterialsCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                        <div className="cost-item">
                          <span>{t("TrainingPage.suppliesCostLabel")}</span>
                          <span className="pull-right">
                            {training.suppliesToolsCost !== null &&
                            training.suppliesToolsCost !== undefined
                              ? formatMoney(training.suppliesToolsCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                        <div className="cost-item">
                          <span>{t("TrainingPage.otherCostLabel")}</span>
                          <span className="pull-right">
                            {training.otherCost !== null && training.otherCost !== undefined
                              ? formatMoney(training.otherCost)
                              : t("Global.noDataAvailableText")}
                          </span>
                        </div>
                      </div>
                    </>
                  </Grouping>
                  <Grouping
                    className="desktop-only"
                    title={t("TrainingPage.locationGroupHeader")}
                    subheading="Geographic and contact information for this Learning Opportunity"
                  >
                    <>
                      {training.provider && training.provider.ctid ? (
                        <>
                          <p>
                            <span className="fin fas">
                              {training.provider?.name
                                ? cleanProviderName(training.provider.name)
                                : "Provider information not available"}
                            </span>
                          </p>
                          {getProviderEmail()}
                          {getAvailableAtAddress() && (
                            <div className="fact-item">
                              <span className="label">
                                <MapPin size={18} weight="fill" />
                              </span>
                              {getAvailableAtAddress()}
                            </div>
                          )}
                          <div className="fact-item">
                            <span className="label">
                              <User size={18} weight="bold" />
                            </span>
                            {getProgramContact()}
                          </div>
                          <div className="fact-item">
                            <span className="label">
                              <LinkSimple size={18} weight="bold" />
                            </span>
                            {getProviderUrl()}
                          </div>
                        </>
                      ) : (
                        <>Data unavailable</>
                      )}
                    </>
                  </Grouping>

                  <ProviderServices training={training} />
                  <div className="mobile-only">{fundingContent}</div>
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
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Overlay and Drawer for CIP code information */}

        <>
          <div id="drawerOverlay" className={`cip overlay${drawerOpen ? " open" : ""}`} />
          <div className={`cip panel${drawerOpen ? " open" : ""}`}>
            {activeDrawer === "cip" ? (
              <CipDrawerContent onClose={() => setDrawerOpen(false)} />
            ) : activeDrawer === "soc" ? (
              <SocDrawerContent onClose={() => setDrawerOpen(false)} />
            ) : (
              <></>
            )}
          </div>
        </>
      </Layout>
    </div>
  );
};
