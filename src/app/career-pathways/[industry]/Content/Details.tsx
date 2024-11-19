"use client";
import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { Button } from "@components/modules/Button";
import { Heading } from "@components/modules/Heading";
import { InfoBox } from "@components/modules/InfoBox";
import { LabelBox } from "@components/modules/LabelBox";
import { Markdown } from "@components/modules/Markdown";
import { Tag } from "@components/modules/Tag";
import { OccupationNodeProps, TrainingResult } from "@utils/types";
import { useEffect, useState } from "react";
import { RelatedTrainingCard } from "./RelatedTrainingCard";
import { Flex } from "@components/utility/Flex";
import { Spinner } from "@components/modules/Spinner";
import { colors } from "@utils/settings";

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
  const [jobNumbers, setJobNumbers] = useState<number | null>(null);
  const [loadingNumber, setLoadingNumber] = useState(false);
  const [loadingTraining, setLoadingTraining] = useState(false);
  const boxArray = [];

  const getJobNumbers = async () => {
    const jobNumbers = await fetch(
      `${process.env.REACT_APP_API_URL}/api/jobcount/${content.title}`,
    );

    const jobNumbersArray = await jobNumbers.json();

    return jobNumbersArray.count;
  };

  if (content.tasks) {
    boxArray.push({
      name: "tasks",
      icon: "Briefcase",
      title: "What do they do?",
      content: content.tasks,
    });
  }

  if (content.howToGetStarted) {
    boxArray.push({
      name: "howToGetStarted",
      icon: "RocketLaunch",
      title: "How to get started",
      content: content.howToGetStarted,
    });
  }

  if (content.howToGetHere) {
    boxArray.push({
      name: "howToGetHere",
      icon: "MapPin",
      title: "How to get to here",
      content: content.howToGetHere,
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

  if (content.experience) {
    boxArray.push({
      name: "experience",
      icon: "ReadCvLogo",
      title: "Other Experience",
      content: content.experience,
    });
  }

  if (content.skills) {
    boxArray.push({
      name: "skills",
      icon: "SealCheck",
      title: "Skills Needed",
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

  if (content.advancement) {
    boxArray.push({
      name: "advancement",
      icon: "TrendUp",
      title: "How to move up",
      content: content.advancement,
    });
  }

  useEffect(() => {
    setLoadingNumber(true);
    setLoadingTraining(true);
    const searchTerm = content.trainingSearchTerms || content.title;
    const getTrainingList = async () => {
      const training = await fetch(
        `${process.env.REACT_APP_API_URL}/api/trainings/search?query=${searchTerm}`,
      );

      const trainingArray = await training.json();

      setTrainingData(trainingArray.slice(0, 3));
      setLoadingTraining(false);
    };

    getJobNumbers().then((count) => {
      setJobNumbers(count);
      setLoadingNumber(false);
    });

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
              eyebrow="Salary Range"
              number={content.salaryRangeStart}
              numberEnd={content.salaryRangeEnd}
              currency
              notAvailableText="Salary data not available"
              theme="purple"
              tooltip="This salary range is an estimate based on available data and may vary depending on location, experience, and employer."
            />

            <InfoBox
              eyebrow="Jobs Open in NJ"
              number={jobNumbers as number}
              loading={!jobNumbers || loadingNumber}
              theme="purple"
              notAvailableText="Job data not available"
              tooltip="Job openings are based on postings from the NLx job board and reflect positions in New Jersey. The actual number of available jobs may vary."
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
              {loadingTraining ? (
                <Spinner size={100} color={colors.primary} />
              ) : (
                <ul className="unstyled">
                  {trainingData.length > 0 ? (
                    trainingData.map((trainingItem) => (
                      <RelatedTrainingCard
                        key={trainingItem.id}
                        {...trainingItem}
                      />
                    ))
                  ) : (
                    <li>
                      <strong>
                        This data is not yet available for this occupation.
                      </strong>
                    </li>
                  )}
                </ul>
              )}
              <Flex direction="column" gap="xs">
                <Button
                  type="link"
                  highlight="green"
                  link={`/training/search?q=${
                    content.trainingSearchTerms || content.title
                  }`}
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
              color="green"
              title="Related Occupations"
              icon="Briefcase"
            >
              <Button
                highlight="blue"
                iconPrefix="Briefcase"
                iconWeight="bold"
                style={{ width: "100%" }}
                iconSuffix="ArrowSquareOut"
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
