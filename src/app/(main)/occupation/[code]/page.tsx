/* eslint-disable @next/next/no-img-element */
import { PageBanner } from "@components/blocks/PageBanner";
import { LabelBox } from "@components/modules/LabelBox";
import { LinkObject } from "@components/modules/LinkObject";
import { RelatedHeading } from "@components/modules/RelatedHeading";
import { SeeMoreList } from "@components/modules/SeeMoreList";
import { ResultCard } from "@components/modules/ResultCard";
import { numberWithCommas } from "@utils/numberWithCommas";
import { toUsCurrency } from "@utils/toUsCurrency";
import { OccupationPageProps } from "@utils/types";
import { notFound } from "next/navigation";
import globalOgImage from "@images/globalOgImage.jpeg";
import careeronestop from "@images/careeronestop.png";
import {
  civilEngineering,
  webDevelopers,
  carpenters,
  webDesign,
} from "mockData";
import Script from "next/script";

async function getData(soc: string) {
  const pageData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/occupations/${soc}`
  );

  return {
    pageData,
  };
}

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  searchParams: Promise<{
    mockData: string;
  }>;
  params: Promise<{ code: string }>;
}) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const pageData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/occupations/${resolvedParams.code}`
  );

  if (pageData.status !== 200 && !resolvedSearchParams.mockData) {
    notFound();
  }

  const occupation: OccupationPageProps = await pageData.json();

  return {
    title: `${occupation.title} | Occupation | ${process.env.REACT_APP_SITE_NAME}`,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      images: [globalOgImage.src],
    },
    description: occupation.description,
  };
};

export const revalidate = 1800;

export default async function OccupationPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    mockData: string;
  }>;
  params: Promise<{ code: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { pageData } = await getData(resolvedParams.code);

  if (pageData.status !== 200 && !resolvedSearchParams.mockData) {
    notFound();
  }

  const occupationData: OccupationPageProps = await pageData.json();

  const mockDataMap = {
    civilEngineering: civilEngineering,
    webDevelopers: webDevelopers,
    carpenters: carpenters,
    webDesign: webDesign,
  } as any;

  const occupation =
    (mockDataMap[resolvedSearchParams.mockData] as OccupationPageProps) ||
    occupationData;

  const tasks = occupation.tasks?.map((task: {}) => {
    return {
      copy: task,
    };
  }) as {
    copy: string;
  }[];

  const counties =
    occupation.counties && occupation.counties.length > 0
      ? occupation.counties.length === 1
        ? occupation.counties[0] + " County"
        : occupation.counties.length === 2
        ? occupation.counties.join(" and ") + " Counties"
        : occupation.counties.slice(0, -1).join(", ") +
          ", and " +
          occupation.counties.slice(-1) +
          " Counties"
      : "N/A";

  const generateJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Occupation",
    name: occupation.title,
    description: occupation.description,
    // "qualifications": "Qualifications information",
    // "skills": ["Skills information"],
    responsibilities: occupation.tasks,
    educationRequirements: occupation.education,
    // "experienceRequirements": "Experience requirements information",
    occupationalCategory: occupation.soc,
    estimatedSalary: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        value: occupation.medianSalary,
        unitText: "YEAR",
      },
    },
  };

  return (
    <>
      <Script type="application/ld+json" id="occupation">
        {JSON.stringify(generateJsonLd)}
      </Script>
      <div className="page occupationPage">
        <PageBanner
          subHeading={occupation.soc}
          title={occupation.title}
          theme="navy"
          className={`${occupation.inDemand ? "inDemand" : ""}${
            occupation.counties.length === 0 && !occupation.inDemand
              ? " counties-empty"
              : ""
          }`}
          breadcrumbsCollection={{
            items: [
              {
                url: "/",
                copy: "Home",
              },
              {
                url: "/in-demand-occupations",
                copy: "In-Demand Occupation List",
              },
            ],
          }}
          infoBlocks={{
            titleBlock: {
              copy: `In-Demand in ${
                occupation.inDemand ? "all of New Jersey" : counties
              }.`,
              message: "This training may be eligible for funding from your ",
              link: {
                copy: "One-Stop Career Center.",
                url: "https://www.nj.gov/labor/career-services/contact-us/one-stops/",
              },
            },
            costBlock: {
              copy: "Jobs Open in NJ",
              definition:
                "The number of jobs currently posted for this occupation in the State of NJ.. Data source: National Labor Exchange",
              number:
                occupation.openJobsCount && occupation.openJobsCount > 0
                  ? numberWithCommas(occupation.openJobsCount || 0)
                  : "N/A",
            },
            rateBlock: {
              copy: "Median Salaray",
              definition:
                "On average, workers in this occupation earn this amount in the State of NJ.. Data source: NJ Dept of Labor",
              number: toUsCurrency(occupation.medianSalary || 0),
            },
          }}
        />

        <section className="body-copy">
          <div className="container">
            <LinkObject
              className="openingsLink"
              url={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${occupation.soc}&location=New%20Jersey&radius=0&source=NLX&currentpage=1`}
            >
              <span>Search job openings in New Jersey</span>
            </LinkObject>
            <div className="inner">
              <div>
                <LabelBox
                  title="Description"
                  color="purple"
                  className="description"
                  headingLevel={2}
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: occupation.description,
                    }}
                  />
                </LabelBox>
                <LabelBox
                  title="A Day in the Life"
                  color="purple"
                  className="tasks"
                  headingLevel={2}
                >
                  <SeeMoreList items={tasks} />
                </LabelBox>
              </div>
              <div>
                {occupation.education && (
                  <LabelBox
                    title="Education"
                    color="purple"
                    className="education"
                    headingLevel={2}
                  >
                    <p
                      dangerouslySetInnerHTML={{
                        __html: occupation.education,
                      }}
                    />
                  </LabelBox>
                )}
                {occupation.relatedOccupations.length > 0 && (
                  <LabelBox
                    title="Related Occupations"
                    color="purple"
                    className="relatedBox"
                    headingLevel={2}
                  >
                    {occupation.relatedOccupations.map((occupation) => (
                      <LinkObject
                        key={occupation.soc}
                        url={`/occupation/${occupation.soc}`}
                      >
                        {occupation.title}
                      </LinkObject>
                    ))}
                  </LabelBox>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="related">
          <div className="container">
            <div className="inner">
              <RelatedHeading
                title={occupation.title}
                hasTraining={occupation.relatedTrainings.length > 0}
                headingLevel={3}
                className="text-xl"
              />
              {occupation.relatedTrainings.length > 0 ? (
                <>
                  {occupation.relatedTrainings?.splice(0, 3).map((training) => (
                    <ResultCard
                      key={training.id}
                      title={training.name}
                      trainingId={training.id}
                      url={`/training/${training.id}`}
                      education={training.providerName}
                      percentEmployed={training.percentEmployed || undefined}
                      cipDefinition={training.cipDefinition}
                      cost={training.totalCost}
                      timeToComplete={training.calendarLength}
                      inDemandLabel={
                        training.inDemand ? "In Demand" : undefined
                      }
                      location={`${training.city}, ${training.county}`}
                    />
                  ))}
                </>
              ) : (
                "This data is not yet available for this occupation."
              )}
            </div>
            <div className="container-full">
              <p className="accessible-gray">
                <strong>Source:</strong>
                &nbsp;O*NET OnLine by the U.S. Department of Labor, Employment
                and Training Administration (USDOL/ETA). Used under the CC BY
                4.0 license. O*NET® is a trademark of USDOL/ETA.
              </p>
              <p className="accessible-gray">
                <strong>Source:</strong>
                &nbsp;Bureau of Labor Statistics, U.S. Department of Labor,
                Occupational Outlook Handbook
              </p>
              <p>
                <img
                  src={careeronestop.src}
                  width={careeronestop.width}
                  height={careeronestop.height}
                  alt="Career One Stop Logo"
                />
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
