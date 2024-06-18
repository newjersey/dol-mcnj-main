import { ReactElement, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Occupation, OccupationDetail } from "../domain/Occupation";
import { Grouping } from "../components/Grouping";
import { InlineIcon } from "../components/InlineIcon";
import { Error } from "../domain/Error";
import { SomethingWentWrongPage } from "../error/SomethingWentWrongPage";
import { NotFoundPage } from "../error/NotFoundPage";
import { StatBlock } from "../components/StatBlock";
import { formatMoney } from "accounting";
import careeronestop from "../careeronestop.png";
import { CircularProgress, Icon } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { logEvent } from "../analytics";
import { Layout } from "../components/Layout";
import { InDemandBlock } from "../components/InDemandBlock";
import { usePageTitle } from "../utils/usePageTitle";
import { TrainingResult } from "../domain/Training";
import { TrainingResultCard } from "../search-results/TrainingResultCard";
import {Helmet} from "react-helmet-async";

interface Props extends RouteComponentProps {
  soc?: string;
  client: Client;
}

const OPEN_JOBS_URL =
  "https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword={SOC_CODE}&location=New%20Jersey&radius=0&source=NLX&currentpage=1";

export const OccupationPage = (props: Props): ReactElement => {
  const { t } = useTranslation();

  const [occupationDetail, setOccupationDetail] = useState<OccupationDetail | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (occupationDetail) {
      setIsLoading(false);
    }
  }, [occupationDetail, isLoading]);

  useEffect(() => {
    const socCode = props.soc ? props.soc : "";

    props.client.getOccupationDetailBySoc(socCode, {
      onSuccess: (result: OccupationDetail) => {
        setError(null);
        setOccupationDetail(result);
      },
      onError: (error: Error) => setError(0),
    });
  }, [props.soc, props.client]);

  const seeMore = (tasks: string[]): ReactElement => {
    if (tasks.length > 5 && !isOpen) {
      return (
        <button className="weight-500 blue fin" onClick={(): void => setIsOpen(true)}>
          {t("OccupationPage.seeMore")}
          <InlineIcon>keyboard_arrow_down</InlineIcon>
        </button>
      );
    } else if (tasks.length > 5 && isOpen) {
      return (
        <button className="weight-500 blue fin" onClick={(): void => setIsOpen(false)}>
          {t("OccupationPage.seeLess")}
          <InlineIcon>keyboard_arrow_up</InlineIcon>
        </button>
      );
    } else {
      return <></>;
    }
  };

  const getTasksList = (tasks: string[], dataTestId?: string): ReactElement => {
    let tasksToShow = tasks;
    if (tasks.length > 5 && !isOpen) {
      tasksToShow = tasks.slice(0, 5);
    }

    if (tasks.length === 0) {
      return <p>{t("OccupationPage.dataUnavailableText")}</p>;
    } else {
      return (
        <ul data-testid={dataTestId}>
          {tasksToShow.map((task, key) => (
            <li key={key}>{task}</li>
          ))}
        </ul>
      );
    }
  };

  const getRelatedOccupations = (occupations: Occupation[]): ReactElement => {
    if (occupations.length === 0) {
      return <p>{t("OccupationPage.dataUnavailableText")}</p>;
    } else {
      return (
        <>
          {occupations.map((occupation) => (
            <Link
              className="link-format-blue"
              to={`/occupation/${occupation.soc}`}
              key={occupation.soc}
            >
              <p key={occupation.soc} className="blue weight-500 mvs">
                {occupation.title}
              </p>
            </Link>
          ))}
        </>
      );
    }
  };

  const getRelatedTrainings = (trainings: TrainingResult[], occupationSoc: string): ReactElement => {
    if (trainings.length === 0) {
      return <p>{t("OccupationPage.dataUnavailableText")}</p>;
    } else {
      const trainingsToShow = trainings.slice(0, 3);
      const seeMore = trainings.length > 3;
      const resultsUrl = `/training/search?q=${occupationSoc}`;

      return (
        <>
          {seeMore && (
            <Link className="link-format-blue weight-500 blue fin mhd" to={resultsUrl}>
              {t("OccupationPage.relatedTrainingSeeMore")}
            </Link>
          )}

          {trainingsToShow.map((training) => (
            <TrainingResultCard key={training.ctid} trainingResult={training} />
          ))}
        </>
      );
    }
  };


  usePageTitle(
    occupationDetail
      ? `${occupationDetail.title} | Occupation | ${process.env.REACT_APP_SITE_NAME}`
      : `Occupation | ${process.env.REACT_APP_SITE_NAME}`,
  );

  const generateJsonLd = (detail: OccupationDetail) => {
    return {
      "@context": "https://schema.org/",
      "@type": "Occupation",
      "name": detail.title,
      "description": detail.description,
      // "qualifications": "Qualifications information",
      // "skills": ["Skills information"],
      "responsibilities": detail.tasks,
      "educationRequirements": detail.education,
      // "experienceRequirements": "Experience requirements information",
      "occupationalCategory": detail.soc,
      "estimatedSalary": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "value": detail.medianSalary,
          "unitText": "YEAR"
        }
      }
    };
  };

  if (occupationDetail) {
    return (
      <Layout
        client={props.client}
        seo={{
          title: occupationDetail.title
            ? `${occupationDetail.title} | Occupation | ${process.env.REACT_APP_SITE_NAME}`
            : `Occupation | ${process.env.REACT_APP_SITE_NAME}`,
          pageDescription: occupationDetail.description,
          url: props.location?.pathname || "/occupation",
        }}
      >
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(generateJsonLd(occupationDetail))}
          </script>
        </Helmet>

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
                      <a className="usa-breadcrumb__link" href="/in-demand-occupations">
                        In-Demand Occupations List
                      </a>
                    </li>
                    <li className="usa-breadcrumb__list-item use-current" aria-current="page">
                      <span>{occupationDetail.title}</span>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          <h2 data-testid="title" className="page-title text-xl ptd pbs weight-500">
            {occupationDetail.title}
            <br />
            <span>{occupationDetail.soc}</span>
          </h2>

          <div className="stat-block-stack mtm">
            {occupationDetail.inDemand ? <InDemandBlock /> : <></>}

            {!occupationDetail.inDemand &&
            occupationDetail.counties &&
            occupationDetail.counties.length !== 0 ? (
              <InDemandBlock counties={occupationDetail.counties} />
            ) : (
              <></>
            )}

            <div className="stat-block-container">
              <StatBlock
                title={t("OccupationPage.jobsOpenTitle")}
                tooltipText={t("OccupationPage.jobsOpenTooltip")}
                disclaimer={t("OccupationPage.jobsOpenDiscrepencyDisclaimer")}
                dataSource={t("OccupationPage.jobsOpenSource")}
                data={
                  occupationDetail.openJobsCount
                    ? occupationDetail.openJobsCount.toLocaleString()
                    : t("Global.noDataAvailableText")
                }
                backgroundColorClass="bg-lightest-purple"
              />
              <StatBlock
                title={t("OccupationPage.salaryTitle")}
                tooltipText={t("OccupationPage.salaryTooltip")}
                data={
                  occupationDetail.medianSalary
                    ? formatMoney(occupationDetail.medianSalary, { precision: 0 })
                    : t("Global.noDataAvailableText")
                }
                backgroundColorClass="bg-light-purple-50"
              />
            </div>

          </div>
          <div>
            <a
              data-testid="jobOpenings"
              className="link-format-blue weight-500 blue fin mtm"
              target="_blank"
              rel="noopener noreferrer"
              href={OPEN_JOBS_URL.replace(
                "{SOC_CODE}",
                occupationDetail.openJobsCount === 0
                  ? ""
                  : (occupationDetail.openJobsSoc || "").toString(),
              )}
              onClick={() =>
                logEvent(
                  "Occupation page",
                  "Clicked job opening link",
                  String(occupationDetail.openJobsSoc),
                )
              }
            >
              {t("OccupationPage.searchOpenJobsText")}
            </a>
          </div>

          <div className="row">
            <div className="col-md-8">
              <div className="container-fluid">
                <div className="row">
                  <Grouping
                    title={t("OccupationPage.descriptionGroupHeader")}
                    backgroundColorClass="bg-purple"
                  >
                    <p>{occupationDetail.description}</p>
                  </Grouping>

                  <Grouping
                    title={t("OccupationPage.dayInTheLifeGroupHeader")}
                    backgroundColorClass="bg-purple"
                  >
                    <>
                      {getTasksList(occupationDetail.tasks, "occupation-details")}
                      {seeMore(occupationDetail.tasks)}
                    </>
                  </Grouping>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="container-fluid">
                <div className="row">
                  <Grouping title="Education" backgroundColorClass="bg-purple">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: occupationDetail.education
                          ? occupationDetail.education
                          : t("OccupationPage.dataUnavailableText"),
                      }}
                    />
                  </Grouping>

                  <Grouping
                    title={t("OccupationPage.relatedOccupationsGroupHeader")}
                    backgroundColorClass="bg-purple"
                  >
                    {getRelatedOccupations(occupationDetail.relatedOccupations)}
                  </Grouping>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-9">
              <div className="container-fluid">
                <div className="row">
                  <h2 className="text-xl ptd pbs weight-500 fin">
                    {t("OccupationPage.relatedTrainingGroupHeader")}
                  </h2>
                  {getRelatedTrainings(occupationDetail.relatedTrainings, occupationDetail.soc)}
                </div>

              </div>
            </div>
          </div>

          <div className="container-full ptxl">
            <p className="accessible-gray">
              <span className="bold">{t("OccupationPage.sourceLabel")}</span>
              &nbsp;{t("OccupationPage.onetSource")}
            </p>
            <p className="accessible-gray">
              <span className="bold">{t("OccupationPage.sourceLabel")}</span>
              &nbsp;{t("OccupationPage.blsSource")}
            </p>
            <p>
              <img src={careeronestop} alt={t("IconAlt.careerOneStopLogo")} />
            </p>
          </div>
        </div>
      </Layout>
    );
  } else if (error === Error.SYSTEM_ERROR) {
    return (
      <SomethingWentWrongPage
        client={props.client}
        heading="We’re experiencing technical difficulties"
      >
        <>
          <p>
            Please wait a moment and try again. If the problem persists please contact us at link
            below.
          </p>
          <a
            style={{ color: "#005EA2", marginTop: "22px", display: "inline-block" }}
            href="https://docs.google.com/forms/d/e/1FAIpQLScAP50OMhuAgb9Q44TMefw7y5p4dGoE_czQuwGq2Z9mKmVvVQ/formrestricted/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact us
          </a>
        </>
      </SomethingWentWrongPage>
    );
  } else if (error === Error.NOT_FOUND) {
    return (
      <NotFoundPage client={props.client} heading="Occupation not found">
        <>
          <p>
            This occupation is no longer listed or we may be experiencing technical difficulties.
            However, you can try out these other helpful links:
          </p>
          <ul className="unstyled">
            <li style={{ marginTop: "22px" }}>
              <a style={{ color: "#005EA2" }} href="/in-demand-occupations">
                In-Demand Occupations List
              </a>
            </li>
            <li style={{ marginTop: "22px" }}>
              <a style={{ color: "#005EA2" }} href="/training/search">
                Find Training Opportunities
              </a>
            </li>
          </ul>
        </>
      </NotFoundPage>
    );
  } else if (isLoading) {
    return (
      <Layout
        noFooter
        client={props.client}
        seo={{
          title: `Occupation | ${process.env.REACT_APP_SITE_NAME}`,
          url: props.location?.pathname,
        }}
      >
        <div className="fdc page">
          <main className="container page fdr fjc fac ptl" role="main">
            <CircularProgress color="secondary" />
          </main>
        </div>
      </Layout>
    );
  } else {
    return <></>;
  }
};
