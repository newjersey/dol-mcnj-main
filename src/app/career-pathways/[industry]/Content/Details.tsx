"use client";
import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { Button } from "@components/modules/Button";
import { Heading } from "@components/modules/Heading";
import { InfoBox } from "@components/modules/InfoBox";
import { LabelBox } from "@components/modules/LabelBox";
import { Markdown } from "@components/modules/Markdown";
import { Tag } from "@components/modules/Tag";
import {
  ArrowUpRight,
  GraduationCap,
  Hourglass,
  MapPinLine,
} from "@phosphor-icons/react";
import { calendarLength } from "@utils/calendarLength";
import { toUsCurrency } from "@utils/toUsCurrency";
import { OccupationNodeProps, TrainingResult } from "@utils/types";
import { useEffect, useState } from "react";

export const Details = ({
  content,
  parents,
}: {
  content: OccupationNodeProps;
  parents: {
    industry?: string;
    field?: string;
  };
}) => {
  const [trainingData, setTrainingData] = useState<TrainingResult[]>([]);
  const boxArray = [];

  if (content.tasks) {
    boxArray.push({
      name: "tasks",
      icon: "Briefcase",
      title: "What do they do?",
      content: content.tasks,
    });
  }

  if (content.education) {
    boxArray.push({
      name: "education",
      icon: "GraduationCap",
      title: "Education",
      content: content.education,
    });
  }

  if (content.skills) {
    boxArray.push({
      name: "skills",
      icon: "SealCheck",
      title: "Skills",
      content: content.skills,
    });
  }

  if (content.credentials) {
    boxArray.push({
      name: "credentials",
      icon: "Certificate",
      title: "Credentials",
      content: content.credentials,
    });
  }

  if (content.experience) {
    boxArray.push({
      name: "experience",
      icon: "ReadCvLogo",
      title: "Experience",
      content: content.experience,
    });
  }

  if (content.advancement) {
    boxArray.push({
      name: "advancement",
      icon: "ChartLineUp",
      title: "Advancement",
      content: content.advancement,
    });
  }

  useEffect(() => {
    const searchTerm = content.trainingSearchTerms || content.title;
    const getTrainingList = async () => {
      const training = await fetch(
        `${process.env.REACT_APP_SITE_URL}/api/searchTraining/${searchTerm}`,
      );

      const trainingArray = await training.json();

      setTrainingData(trainingArray.slice(0, 3));
    };

    getTrainingList();
  }, [content]);

  return (
    <div className="occupation-block">
      <div className="occupation-box">
        <Breadcrumbs
          pageTitle={content.title}
          crumbs={[
            {
              copy: parents.industry,
            },
            {
              copy: parents.field,
            },
          ]}
        />

        <div className="heading">
          <div>
            <Heading level={3}>{content.title}</Heading>
            {content.inDemand && (
              <Tag
                icon="Fire"
                iconWeight="fill"
                chip
                title="In Demand"
                color="orange"
              />
            )}

            <Markdown content={content.description} />
          </div>
          <div className="meta">
            <InfoBox
              eyebrow="Median Salary"
              number={content.medianSalary}
              currency
              theme="purple"
              tooltip="Definition of median salary"
            />
            <InfoBox
              eyebrow="Jobs Open in NJ"
              number={content.numberOfAvailableJobs}
              theme="purple"
              tooltip="Description of this block."
              link={{
                copy: "See current job openings",
                url: `https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${
                  content.trainingSearchTerms || content.title
                }&amp;amp;location=New%20Jersey&amp;amp;radius=0&amp;amp;source=NLX&amp;amp;currentpage=1`,
              }}
            />
          </div>
        </div>
        <div className="occu-row related">
          <div>
            {boxArray.map((box) => (
              <LabelBox
                key={box.name}
                title={box.title}
                color="green"
                icon={box.icon}
              >
                <Markdown content={box.content} />
              </LabelBox>
            ))}
          </div>
          <div>
            <LabelBox
              icon="RocketLaunch"
              color="green"
              className="related-training"
              title="Related Training Opportunities"
            >
              <ul className="unstyled">
                {trainingData.length > 0 ? (
                  trainingData.map((trainingItem) => (
                    <li key={trainingItem.id}>
                      <a
                        href={`/training/${trainingItem.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <p className="title-bar">
                          {trainingItem.name}
                          <ArrowUpRight size={24} />
                        </p>
                        <span className="span-grid">
                          <span>
                            <GraduationCap size={32} />
                            {trainingItem.providerName}
                          </span>
                          <span>
                            <MapPinLine size={32} />
                            {trainingItem.city}, {trainingItem.county}
                          </span>
                          <span className="last-line">
                            <span>
                              <Hourglass size={32} />
                              {trainingItem.calendarLength
                                ? `${calendarLength(
                                    trainingItem.calendarLength,
                                  )} to complete`
                                : "--"}
                            </span>
                            <span className="salary">
                              {trainingItem.totalCost &&
                                toUsCurrency(trainingItem.totalCost)}
                            </span>
                          </span>
                        </span>
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
              <Button
                type="link"
                highlight="green"
                link={`/training/search/${
                  content.trainingSearchTerms || content.title
                }`}
                label="See more trainings on the Training Explorer"
                svgName="TrainingBold"
                iconSuffix="ArrowUpRight"
                defaultStyle="secondary"
              />
              <Button
                highlight="navy"
                defaultStyle="quinary"
                label="Learn more financial assistance opportunities"
                link="/tuition-assistance"
                svgName="SupportBold"
                iconSuffix="ArrowUpRight"
                type="link"
              />
            </LabelBox>
            <LabelBox
              color="green"
              title="Related Occupations"
              icon="Briefcase"
            >
              <Button
                highlight="blue"
                iconPrefix="Briefcase"
                iconWeight="bold"
                iconSuffix="ArrowUpRight"
                label="Check out related jobs on Career One Stop"
                link="https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=welder&amp;location=New%20Jersey&amp;radius=0&amp;source=NLX&amp;currentpage=1&amp;pagesize=100"
                type="link"
              />
            </LabelBox>
          </div>
        </div>
      </div>
    </div>
  );
};
