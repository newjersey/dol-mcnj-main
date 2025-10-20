"use client";
import { LabelBox } from "@components/modules/LabelBox";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { LinkObject } from "@components/modules/LinkObject";
import { SeeMoreList } from "@components/modules/SeeMoreList";
import { OccupationPageProps } from "@utils/types";
import Script from "next/script";
import { OccupationBanner } from "@components/blocks/OccupationBanner";

export const revalidate = 1800;

export const Content = ({
  occupation,
}: {
  occupation: OccupationPageProps;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const tasks = occupation.tasks?.map((task) => {
    return {
      copy: task,
    };
  }) as {
    copy: string;
  }[];

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
    <div ref={contentRef}>
      <Script type="application/ld+json" id="occupation">
        {JSON.stringify(generateJsonLd)}
      </Script>
      <OccupationBanner
        name={occupation.title}
        id={occupation.soc}
        provider={occupation.soc}
        printHandler={reactToPrintFn}
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
        inDemand={occupation.inDemand}
        employmentRate={occupation.medianSalary || 0}
        salary={
          occupation.openJobsCount && occupation.openJobsCount > 0
            ? occupation.openJobsCount || 0
            : undefined
        }
      />

      <section className="body-copy">
        <div className="container">
          {/* 
            Uses openJobsSoc (if available) to ensure the link uses the same SOC code
            that was used to fetch the job count displayed above. This is critical for
            consistency when the backend falls back to 2010 SOC codes for certain occupations.
            
            Note: The job count on CareerOneStop's website may differ slightly from what
            we display due to real-time changes, caching differences, or varying data sources
            between their API and website. Minor discrepancies are expected and acceptable.
          */}
          <LinkObject
            className="openingsLink"
            url={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${occupation.openJobsSoc || occupation.soc}&location=New%20Jersey&radius=0&source=NLX&currentpage=1`}
          >
            <span>Search job openings in New Jersey</span>
          </LinkObject>
          <div className="inner">
            <div>
              <LabelBox
                large
                subheading="About this Occupation"
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
                large
                title="A Day in the Life"
                subheading="Details about this occupation"
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
                  large
                  title="Education"
                  subheading="Types of education and training needed for this occupation"
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
                  large
                  title="Related Occupations"
                  subheading="Explore these related occupations"
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
    </div>
  );
};
