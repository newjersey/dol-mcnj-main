import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { InlineIcon } from "./InlineIcon";

interface Props {
  className?: string;
  counties?: string[];
}

export const InDemandTag = (props: Props): ReactElement => {
  const { t } = useTranslation();

  // Helper function to format array into human-readable string
  const formatCounties = (counties: string[] = []) => {
    if(counties.length === 0) return '';
    if(counties.length === 1) return `${counties[0]} County`;

    // Handle case when there are two counties
    if(counties.length === 2) return `${counties[0]} and ${counties[1]} Counties`;

    const lastCounty = counties.pop();
    return `${counties.join(', ')}, and ${lastCounty} Counties`;
  };

  // Formatted counties string
  const countiesString = formatCounties(props.counties);

  return (
      <span className={`fin fas bg-orange-tag tag pvxxs phd mrs ${props.className}`}>
      <InlineIcon className="mrxs">local_fire_department</InlineIcon>
        {
          countiesString
              ? t("SearchResultsPage.inDemandCountiesTag", {counties: countiesString})
              : t("SearchResultsPage.inDemandTag")
        }
    </span>
  );
};
