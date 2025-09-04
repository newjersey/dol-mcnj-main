"use client";
import { toUsCurrency } from "@utils/toUsCurrency";
import { Heading } from "./Heading";
import {
  BookBookmarkIcon,
  BriefcaseIcon,
  ClockIcon,
  GraduationCapIcon,
  MapPin,
  CurrencyDollarIcon,
} from "@phosphor-icons/react";
import { Tag } from "./Tag";
import { FormInput } from "./FormInput";
import { LinkObject } from "./LinkObject";
import { calendarLength } from "@utils/calendarLength";
import { replaceDoubleBracketsWithStrong } from "@utils/replaceDoubleBracketsWithStrong";
import { CipDefinition } from "@utils/types";
import { ProgramOutcome } from "@utils/types/components";
import { formatCip } from "@utils/formatCip";
import { Flex } from "@components/utility/Flex";
import {
  getPercentEmployed,
  getCompletionRate,
  formatPercentage,
  getMedianSalary,
  formatSalary,
  hasOutcomeData,
} from "@utils/outcomeHelpers";

interface ResultCardProps {
  cipDefinition?: CipDefinition;
  className?: string;
  compare?: boolean;
  cost?: number;
  description?: string;
  disableCompare?: boolean;
  education?: string;
  inDemandLabel?: string;
  location?: string;
  onCompare?: (trainingId: string) => void;
  outcomes?: ProgramOutcome;
  percentEmployed?: number; // Keep for backward compatibility
  timeToComplete?: number;
  title: string;
  trainingId: string;
  url: string;
}

const ResultCard = (props: ResultCardProps) => {
  const {
    cipDefinition,
    className,
    compare,
    cost,
    description,
    disableCompare,
    education,
    inDemandLabel,
    location,
    onCompare,
    outcomes,
    percentEmployed,
    timeToComplete,
    title,
    trainingId,
    url,
  } = props;

  const medianSalary = outcomes
    ? getMedianSalary(outcomes, 4) ?? getMedianSalary(outcomes, 2)
    : undefined;

  return (
    <div
      className={`resultCard${className ? ` ${className}` : ""}`}
      id={trainingId}
    >
      <div className="heading">
        <Heading level={3}>
          <LinkObject noIndicator url={url}>
            {title}
          </LinkObject>
        </Heading>
        <span>{(cost && toUsCurrency(cost)) || "$0"}</span>
      </div>
      <div className="information">
        <div className="main-info">
          {education && (
            <p className="education">
              <GraduationCapIcon size={16} />
              <span>{education}</span>
            </p>
          )}
          {location && (
            <p className="location">
              <MapPin weight="fill" size={16} />
              <span>{location}</span>
            </p>
          )}
          {timeToComplete && (
            <p className="timeToComplete">
              <ClockIcon size={16} />
              <span>{calendarLength(timeToComplete)} to complete</span>
            </p>
          )}
          {cipDefinition ? (
            <>
              <p className="cipCode">
                <Flex
                  alignItems="center"
                  gap="xxs"
                  elementTag="span"
                  columnBreak="none"
                >
                  <BookBookmarkIcon size={16} weight="fill" />
                  <span>CIP: {formatCip(cipDefinition.cipcode)}</span>
                </Flex>
                <b>{cipDefinition.ciptitle}</b>
              </p>
            </>
          ) : (
            <span>No Data Available</span>
          )}
          {description && (
            <p className="description">
              <span
                dangerouslySetInnerHTML={{
                  __html: `"...${replaceDoubleBracketsWithStrong(
                    description
                  )}..."`,
                }}
              />
            </p>
          )}
        </div>
        <div className="metrics-section">
          <p className="percentEmployed">
            <BriefcaseIcon size={16} />
            <span>
              {outcomes && hasOutcomeData(outcomes)
                ? `${formatPercentage(getPercentEmployed(outcomes), false)} employed`
                : percentEmployed
                ? `${Math.floor(percentEmployed * 100 * 10) / 10}% employed`
                : "-- employed"}
            </span>
          </p>

          {outcomes && hasOutcomeData(outcomes) && getCompletionRate(outcomes) !== undefined && (
            <p className="completion-rate">
              <GraduationCapIcon size={16} />
              <span>
                {`${formatPercentage(getCompletionRate(outcomes))} completion`}
              </span>
            </p>
          )}

          {outcomes && hasOutcomeData(outcomes) && medianSalary !== undefined && (
            <p className="median-wage">
              <CurrencyDollarIcon size={16} />
              <span>{`${formatSalary(medianSalary)} median wage`}</span>
            </p>
          )}
        </div>
      </div>
      <div className={`footing${!inDemandLabel ? " noLabel" : ""}`}>
        {inDemandLabel && (
          <Tag
            color="orange"
            iconWeight="fill"
            icon="Fire"
            chip
            title={inDemandLabel}
          />
        )}
        {compare && (
          <FormInput
            inputId={`checkbox_${trainingId}`}
            type="checkbox"
            label="Compare"
            disabled={disableCompare}
            onChange={() => {
              if (onCompare) {
                onCompare(trainingId);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export { ResultCard };
