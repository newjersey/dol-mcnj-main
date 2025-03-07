"use client";
import { InfoBox } from "@components/modules/InfoBox";
import { LabelBox } from "@components/modules/LabelBox";
import { SeeMoreList } from "@components/modules/SeeMoreList";
import { Tag } from "@components/modules/Tag";
import {
  InDemandItemProps,
  OccupationDetail,
  TrainingResult,
} from "@utils/types";
import { useEffect, useState } from "react";
import { RelatedTrainingCard } from "./RelatedTrainingCard";
import { Button } from "@components/modules/Button";
import { Flex } from "@components/utility/Flex";

export const InDemandDetails = (props: {
  inDemandList?: InDemandItemProps[];
  content: OccupationDetail;
}) => {
  const [sortedTraining, setSortedTraining] = useState<TrainingResult[]>([]);
  const [jobNumbers, setJobNumbers] = useState<number | null>(null);
  const [loadingNumber, setLoadingNumber] = useState(false);

  const taskList = props.content?.tasks.map((task) => {
    return {
      copy: task,
    };
  });

  const getJobNumbers = async () => {
    const jobNumbers = await fetch(
      `${process.env.REACT_APP_API_URL}/api/jobcount/${props.content.title}`
    );

    const jobNumbersArray = await jobNumbers.json();

    return jobNumbersArray.count;
  };

  useEffect(() => {
    setLoadingNumber(true);
    if (props.content && props.content.relatedTrainings) {
      const sortedCourses = props.content.relatedTrainings.sort((a, b) => {
        if (a.percentEmployed === null && b.percentEmployed === null) {
          return a.name.localeCompare(b.name);
        } else if (a.percentEmployed === null) {
          return 1;
        } else if (b.percentEmployed === null) {
          return -1;
        } else if (a.percentEmployed !== b.percentEmployed) {
          return b.percentEmployed - a.percentEmployed;
        } else if (
          a.percentEmployed === b.percentEmployed &&
          a.name !== b.name
        ) {
          return a.name.localeCompare(b.name);
        } else {
          return 0;
        }
      });

      const uniqueTrainings = sortedCourses?.filter(
        (training, index, self) =>
          index === self.findIndex((t) => t.name === training.name)
      );

      setSortedTraining(uniqueTrainings);

      getJobNumbers().then((count) => {
        setJobNumbers(count);
        setLoadingNumber(false);
      });
    }
  }, [props.content]);

  return (
    <div className="occupation-box">
      <div className="heading-row">
        <div className="heading">
          <div>
            <h3>{props.content.title}</h3>
            {props.content.inDemand && (
              <Tag
                title="In-Demand"
                color="orange"
                chip
                icon="Fire"
                iconWeight="fill"
              />
            )}
            <p>{props.content.description}</p>
          </div>
          <div className="meta">
            <InfoBox
              currency
              notAvailableText="Salary data not available"
              number={props.content.medianSalary || undefined}
              eyebrow="Median Salary"
              tooltip="Tooltip info here."
              theme="purple"
            />
            <InfoBox
              notAvailableText="Open jobs data not available"
              eyebrow="Jobs Open in NJ"
              tooltip="Tooltip info here."
              theme="purple"
              number={jobNumbers as number}
              loading={!jobNumbers || loadingNumber}
              link={{
                copy: "See current job openings",
                url: `https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${props.content.soc}&location=New%20Jersey&radius=0&source=NLX&currentpage=1`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="occu-row related">
        <div>
          <LabelBox
            color="green"
            title="A Day in the Life"
            icon="CalendarCheck"
          >
            <>
              {taskList.length > 0 ? (
                <SeeMoreList items={taskList} />
              ) : (
                <p>
                  <strong>
                    This data is not yet available for this occupation.
                  </strong>
                </p>
              )}
            </>
          </LabelBox>
          <LabelBox color="green" title="Education" icon="GraduationCap">
            <p
              dangerouslySetInnerHTML={{
                __html: props.content.education
                  ? props.content.education
                  : `<strong>This data is not yet available for this occupation.</strong>`,
              }}
            />
          </LabelBox>

          <LabelBox color="green" title="Related Occupations" icon="Briefcase">
            <ul className="unstyled">
              {props.content.relatedOccupations &&
              props.content.relatedOccupations.length > 0 ? (
                props.content.relatedOccupations.map((occupation: any) => (
                  <li key={occupation.soc}>
                    <a href={`/occupation/${occupation.soc}`}>
                      {occupation.title}
                    </a>
                  </li>
                ))
              ) : (
                <li>
                  <strong>
                    This data is not yet available for this occupation.
                  </strong>
                </li>
              )}
            </ul>
          </LabelBox>
        </div>
        <div>
          <LabelBox
            title="Related Training Opportunities"
            icon="RocketLaunch"
            className="related-training"
            color="green"
          >
            <ul className="unstyled">
              {sortedTraining && sortedTraining.length > 0 ? (
                sortedTraining
                  .slice(0, 3)
                  .map((train) => (
                    <RelatedTrainingCard key={train.id} {...train} />
                  ))
              ) : (
                <li>
                  <p className="mbd">
                    <strong>
                      This data is not yet available for this occupation.
                    </strong>
                  </p>
                </li>
              )}
            </ul>
            <Flex direction="column" gap="xs">
              <Button
                type="link"
                highlight="green"
                link={`/training/search?q=${props.content.title.toLowerCase()}`}
                label="See more trainings on the Training Explorer"
                style={{ width: "100%" }}
                svgName="TrainingBold"
                defaultStyle="secondary"
              />
              <Button
                highlight="navy"
                defaultStyle="quinary"
                label="Learn more financial assistance opportunities"
                link="/support-resources/tuition-assistance"
                style={{ width: "100%" }}
                svgName="SupportBold"
                type="link"
              />
            </Flex>
          </LabelBox>
          <LabelBox
            title="Related Job Opportunities"
            icon="Briefcase"
            color="green"
          >
            <Button
              type="link"
              defaultStyle="primary"
              highlight="blue"
              style={{ width: "100%" }}
              iconPrefix="Briefcase"
              iconSuffix="ArrowSquareOut"
              link={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${props.content.soc}&location=New%20Jersey&radius=0&source=NLX&currentpage=1`}
            >
              Check out related jobs on Career One Stop
            </Button>
          </LabelBox>
        </div>
      </div>
    </div>
  );
};
