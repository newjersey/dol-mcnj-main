import { LabelBox } from "@components/modules/LabelBox";
import { Flex } from "@components/utility/Flex";
import {
  Baby,
  Briefcase,
  Globe,
  Moon,
  WheelchairMotion,
} from "@phosphor-icons/react";
import { TrainingProps } from "@utils/types";

export const SupportServices = ({ training }: { training: TrainingProps }) => {
  return (
    <LabelBox
      large
      subheading="Support services provided for the Learning Opportunity"
      color="green"
      title="Support Services"
      className="services"
    >
      <Flex direction="column" gap="xs">
        {training.hasEveningCourses && (
          <Flex
            alignItems="flex-start"
            gap="xs"
            columnBreak="none"
            style={{
              width: "100%",
            }}
          >
            <Moon size={18} weight="bold" />
            <span
              style={{
                display: "block",
                width: "calc(100% - 30px)",
              }}
            >
              This provider offers evening courses
            </span>
          </Flex>
        )}
        {training.languages.length !== 0 && (
          <Flex
            alignItems="flex-start"
            gap="xs"
            columnBreak="none"
            style={{
              width: "100%",
            }}
          >
            <Globe size={18} weight="bold" />
            <span
              style={{
                display: "block",
                width: "calc(100% - 30px)",
              }}
            >
              Programs may be available in other languages
            </span>
          </Flex>
        )}
        {training.isWheelchairAccessible && (
          <Flex
            alignItems="flex-start"
            gap="xs"
            columnBreak="none"
            style={{
              width: "100%",
            }}
          >
            <WheelchairMotion size={18} weight="bold" />
            <span
              style={{
                display: "block",
                width: "calc(100% - 30px)",
              }}
            >
              The facility is wheelchair accessible
            </span>
          </Flex>
        )}
        {training.hasJobPlacementAssistance && (
          <Flex
            alignItems="flex-start"
            gap="xs"
            columnBreak="none"
            style={{
              width: "100%",
            }}
          >
            <Briefcase size={18} weight="bold" />
            <span
              style={{
                display: "block",
                width: "calc(100% - 30px)",
              }}
            >
              Job placement and/or career assistance is available at this
              provider
            </span>
          </Flex>
        )}
        {training.hasChildcareAssistance && (
          <Flex
            alignItems="flex-start"
            gap="xs"
            columnBreak="none"
            style={{
              width: "100%",
            }}
          >
            <Baby size={18} />
            <span
              style={{
                display: "block",
                width: "calc(100% - 30px)",
              }}
            >
              This provider has childcare at the facility or provides assistance
              with finding childcare
            </span>
          </Flex>
        )}
        <p className="disclaimer">
          Services are subject to provider details, contact this provider for
          more information on services
        </p>
      </Flex>
    </LabelBox>
  );
};
