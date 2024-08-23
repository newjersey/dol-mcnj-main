"use client";
import { InfoBox } from "@components/modules/InfoBox";
import { LabelBox } from "@components/modules/LabelBox";
import { SeeMoreList } from "@components/modules/SeeMoreList";
import { Tag } from "@components/modules/Tag";
import {
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  Hourglass,
  MapPinLine,
} from "@phosphor-icons/react";
import { calendarLength } from "@utils/calendarLength";
import { toUsCurrency } from "@utils/toUsCurrency";
import {
  InDemandItemProps,
  OccupationDetail,
  TrainingResult,
} from "@utils/types";
import { useEffect, useState } from "react";

export const InDemandDetails = (props: {
  inDemandList?: InDemandItemProps[];
  content: OccupationDetail;
}) => {
  const [sortedTraining, setSortedTraining] = useState<TrainingResult[]>([]);

  const taskList = props.content?.tasks.map((task) => {
    return {
      copy: task,
    };
  });

  useEffect(() => {
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
          index === self.findIndex((t) => t.name === training.name),
      );

      setSortedTraining(uniqueTrainings);
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
              number={props.content.medianSalary || undefined}
              eyebrow="Median Salary"
              tooltip="Tooltip info here."
              theme="purple"
            />
            <InfoBox
              eyebrow="Jobs Open in NJ"
              tooltip="Tooltip info here."
              theme="purple"
              number={props.content.openJobsCount || undefined}
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
                sortedTraining.slice(0, 3).map((train) => (
                  <li key={train.id}>
                    <a
                      href={`/training/${train.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="title-bar">
                        {train.name}
                        <ArrowUpRight size={24} />
                      </p>
                      <span className="span-grid">
                        <span>
                          <GraduationCap size={32} />
                          {train.providerName}
                        </span>
                        <span>
                          <MapPinLine size={32} />
                          {train.city}, {train.county}
                        </span>
                        <span className="last-line">
                          <span>
                            <Hourglass size={32} />
                            {train.calendarLength
                              ? `${calendarLength(
                                  train.calendarLength,
                                )} to complete`
                              : "--"}
                          </span>
                          <span className="salary">
                            {train.totalCost && toUsCurrency(train.totalCost)}
                          </span>
                        </span>
                      </span>
                    </a>
                  </li>
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
          </LabelBox>
          <LabelBox
            title="Related Job Opportunities"
            icon="Briefcase"
            color="green"
          >
            <a
              className="solid usa-button"
              href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${props.content.soc}&location=New%20Jersey&radius=0&source=NLX&currentpage=1`}
            >
              <span>
                <Briefcase size={32} />
                Check out related jobs on Career One Stop
              </span>
              <ArrowUpRight size={20} />
            </a>
          </LabelBox>
        </div>
      </div>
    </div>
  );
};
