import { IconSelector } from "@components/modules/IconSelector";
import { LabelBox } from "@components/modules/LabelBox";
import { Flex } from "@components/utility/Flex";
import { InfoIcon } from "@phosphor-icons/react";
import { calendarLength } from "@utils/calendarLength";
import { slugify } from "@utils/slugify";
import { TrainingProps } from "@utils/types";
import { ReactNode } from "react";
import { Tooltip } from "react-tooltip";

export const QuickFacts = ({ training }: { training: TrainingProps }) => {
  const FactItem = ({
    label,
    icon,
    children,
    toolTip,
  }: {
    label: string;
    icon: any;
    children: ReactNode;
    toolTip?: string;
  }) => (
    <Flex alignItems="flex-start" gap="xs" elementTag="span" columnBreak="none">
      <IconSelector name={icon} size={18} weight="bold" />
      <Flex elementTag="span" direction="column" gap="xxs">
        <strong>
          {label}:
          {toolTip && (
            <>
              <Tooltip id={slugify(label)} place="top">
                <div className="max-w-[250px] text-pretty">{toolTip}</div>
              </Tooltip>
              <InfoIcon
                data-tooltip-id={slugify(label)}
                weight="fill"
                size={18}
              />
            </>
          )}
        </strong>
        <span>{children}</span>
      </Flex>
    </Flex>
  );

  return (
    <LabelBox
      large
      subheading="Details about this Learning Opportunity"
      color="green"
      title="Quick Facts"
      className="stats"
    >
      <Flex direction="column" gap="xs">
        {training.languages && training.languages.length > 0 && (
          <FactItem label="Languages" icon="Globe">
            <>{training.languages.join(", ")}</>
          </FactItem>
        )}
        {training.prerequisites && (
          <FactItem label="Prerequisites" icon="ListBullets">
            <>{training.prerequisites}</>
          </FactItem>
        )}

        {training.certifications && (
          <FactItem label="Certifications" icon="GraduationCap">
            <>{training.certifications}</>
          </FactItem>
        )}

        {training.calendarLength && (
          <FactItem label="Completion Time" icon="Timer">
            <>{calendarLength(training.calendarLength)}</>
          </FactItem>
        )}

        {!!training.totalClockHours && (
          <FactItem
            label="Total Hours"
            icon="Clock"
            toolTip="Total Hours are the total number of actual hours spent attending class or instructional activity in order to complete the program."
          >
            <Flex alignItems="center" gap="micro" columnBreak="none">
              {training.totalClockHours} hours
            </Flex>
          </FactItem>
        )}
      </Flex>
    </LabelBox>
  );
};
