import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { InlineIcon } from "./InlineIcon";

interface Props {
  county: string;
}

export const LocalWaiverTag = (props: Props): ReactElement => {
  const { t } = useTranslation();

  return (
    <span className="fin fas bg-orange-tag tag pvxxs phd mrs">
      <InlineIcon className="mrxs">local_fire_department</InlineIcon>
      {t("SearchResultsPageStrings.localWaiverTag", { county: props.county })}
    </span>
  );
};
