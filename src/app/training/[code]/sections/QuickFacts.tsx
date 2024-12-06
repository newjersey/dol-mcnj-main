import { IconSelector } from "@components/modules/IconSelector";
import { LabelBox } from "@components/modules/LabelBox";
import { Flex } from "@components/utility/Flex";
import { Tooltip } from "@components/utility/Tooltip";
import { Info } from "@phosphor-icons/react";
import { calendarLength } from "@utils/calendarLength";
import { TrainingProps } from "@utils/types";
import { ReactNode } from "react";

export const QuickFacts = ({ training }: { training: TrainingProps }) => {
  const FactItem = ({
    label,
    icon,
    children,
  }: {
    label: string;
    icon: any;
    children: ReactNode;
  }) => (
    <Flex alignItems="flex-start" gap="xs" elementTag="span" columnBreak="none">
      <IconSelector name={icon} size={18} weight="bold" />
      <Flex elementTag="span" direction="column" gap="xxs">
        <strong>{label}: </strong>
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
          <FactItem label="Total Hours" icon="Clock">
            <Flex alignItems="center" gap="micro" columnBreak="none">
              <Tooltip
                copy="Total Hours are the total number of actual hours spent attending class or instructional activity in order to complete the program."
                style={{
                  height: "20px",
                }}
              >
                <Info weight="fill" size={18} />
              </Tooltip>
              {training.totalClockHours} hours
            </Flex>
          </FactItem>
        )}
      </Flex>
    </LabelBox>
  );
};
