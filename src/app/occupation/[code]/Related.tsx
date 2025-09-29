'use client";';
import { RelatedHeading } from "@components/modules/RelatedHeading";
import { ResultCard } from "@components/modules/ResultCard";
import careeronestop from "@images/careeronestop.png";
import { OccupationPageProps } from "@utils/types";
import { getPercentEmployed } from "@utils/outcomeHelpers";
import Image from "next/image";

export const Related = ({
  occupation,
}: {
  occupation: OccupationPageProps;
}) => {
  return (
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
                  percentEmployed={getPercentEmployed(training.outcomes)}
                  cipDefinition={training.cipDefinition}
                  cost={training.totalCost}
                  timeToComplete={training.calendarLength}
                  inDemandLabel={training.inDemand ? "In Demand" : undefined}
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
            &nbsp;O*NET OnLine by the U.S. Department of Labor, Employment and
            Training Administration (USDOL/ETA). Used under the CC BY 4.0
            license. O*NET® is a trademark of USDOL/ETA.
          </p>
          <p className="accessible-gray">
            <strong>Source:</strong>
            &nbsp;Bureau of Labor Statistics, U.S. Department of Labor,
            Occupational Outlook Handbook
          </p>
          <Image
            src={careeronestop.src}
            width={careeronestop.width}
            height={careeronestop.height}
            alt="Career One Stop Logo"
          />
        </div>
      </div>
    </section>
  );
};
