import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { InlineIcon } from "./InlineIcon";
import { formatCountiesArrayToString } from "../utils/formatCountiesArrayToString";

interface Props {
  className?: string;
  counties?: string[];
}

export const InDemandTag = (props: Props): ReactElement => {
  const { t } = useTranslation();

  // Formatted counties string
  const countiesString = formatCountiesArrayToString(props.counties);

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
