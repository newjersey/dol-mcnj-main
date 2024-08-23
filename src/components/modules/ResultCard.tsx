"use client";
import { toUsCurrency } from "@utils/toUsCurrency";
import { Heading } from "./Heading";
import {
  BookBookmark,
  Briefcase,
  CalendarBlank,
  Clock,
  GraduationCap,
  MapPin,
  QrCode,
} from "@phosphor-icons/react";
import { Tag } from "./Tag";
import { FormInput } from "./FormInput";
import { LinkObject } from "./LinkObject";
import { calendarLength } from "@utils/calendarLength";
import { replaceDoubleBracketsWithStrong } from "@utils/replaceDoubleBracketsWithStrong";
import { CipDefinition } from "@utils/types";
import { formatCip } from "@utils/formatCip";
import { Flex } from "@components/utility/Flex";

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
  percentEmployed?: number;
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
    percentEmployed,
    timeToComplete,
    title,
    trainingId,
    url,
  } = props;
  return (
    <div
      className={`resultCard${className ? ` ${className}` : ""}`}
      id={trainingId}
    >
      <div className="heading">
        <LinkObject noIndicator url={url}>
          <Heading level={3}>{title}</Heading>
        </LinkObject>
        <span>{(cost && toUsCurrency(cost)) || "$0"}</span>
      </div>
      <div className="information">
        <div className="education-row">
          {education && (
            <p className="education">
              <GraduationCap size={16} />
              <span>{education}</span>
            </p>
          )}

          <p className="percentEmployed">
            <Briefcase size={16} />
            <span>
              {percentEmployed
                ? `${Math.floor(percentEmployed * 100 * 10) / 10}% employed`
                : "--"}
            </span>
          </p>
        </div>
        {location && (
          <p className="location">
            <MapPin weight="fill" size={16} />
            <span>{location}</span>
          </p>
        )}
        {timeToComplete && (
          <p className="timeToComplete">
            <Clock size={16} />
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
                <BookBookmark size={16} weight="fill" />
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
                  description,
                )}..."`,
              }}
            />
          </p>
        )}
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
              onCompare && onCompare(trainingId);
            }}
          />
        )}
      </div>
    </div>
  );
};

export { ResultCard };
