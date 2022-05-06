import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { InlineIcon } from "./InlineIcon";

interface Props {
  className?: string;
}

export const InDemandTag = (props: Props): ReactElement => {
  const { t } = useTranslation();

  return (
    <span className={`fin fas bg-orange-tag tag pvxxs phd mrs ${props.className}`}>
      <InlineIcon className="mrxs">local_fire_department</InlineIcon>
      {t("SearchResultsPageStrings.inDemandTag")}
    </span>
  );
};
