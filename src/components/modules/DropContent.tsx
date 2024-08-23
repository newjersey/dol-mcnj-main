"use client";
import {
  ContentfulRichTextProps,
  HeadingLevel,
  SectionIcons,
} from "@utils/types";
import { Heading } from "./Heading";
import { IconSelector } from "./IconSelector";
import { capitalizeFirstLetter } from "@utils/capitalizeFirstLetter";
import * as Svg from "@components/svgs";
import { useState } from "react";
import { Button } from "./Button";
import { colors } from "@utils/settings";
import { ContentfulRichText } from "./ContentfulRichText";
import { IconNames } from "@utils/enums";

interface DropContentProps {
  headingLevel: HeadingLevel;
  sys: {
    id: string;
  };
  url?: string;
  copy?: string;
  icon?: IconNames;
  testId?: string;
  systemIcon?: SectionIcons;
  message?: ContentfulRichTextProps;
}

export const DropContent = ({
  headingLevel,
  copy,
  testId,
  systemIcon,
  message,
  icon,
}: DropContentProps) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="dropContent" data-testid={testId}>
      <Button
        type="button"
        customBgColor={colors.secondaryLighter}
        customTextColor={colors.black}
        onClick={() => setOpen(!open)}
      >
        {copy && (
          <Heading level={headingLevel}>
            <span>
              {icon && (
                <IconSelector
                  name={icon}
                  size={32}
                  svgName={
                    capitalizeFirstLetter(systemIcon) as keyof typeof Svg
                  }
                />
              )}
              {copy}
            </span>

            <IconSelector name={open ? "CaretUp" : "CaretDown"} />
          </Heading>
        )}
      </Button>
      {message && (
        <ContentfulRichText
          className={`content${open ? " open" : ""}`}
          document={message?.json}
        />
      )}
    </div>
  );
};
