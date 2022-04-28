import React, { ReactElement } from "react";
import { InlineIcon } from "./InlineIcon";
import { SearchResultsPageStrings } from "../localizations/SearchResultsPageStrings";

interface Props {
  county: string;
}

export const LocalWaiverTag = (props: Props): ReactElement => {
  return (
    <span className="fin fas bg-orange-tag tag pvxxs phd mrs">
      <InlineIcon className="mrxs">local_fire_department</InlineIcon>
      {SearchResultsPageStrings.localWaiverTag.replace("{county}", props.county)}
    </span>
  );
};
