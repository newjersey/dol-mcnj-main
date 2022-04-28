import React, { ReactElement } from "react";
import { InlineIcon } from "./InlineIcon";
import { SearchResultsPageStrings } from "../localizations/SearchResultsPageStrings";

interface Props {
  className?: string;
}

export const InDemandTag = (props: Props): ReactElement => {
  return (
    <span className={`fin fas bg-orange-tag tag pvxxs phd mrs ${props.className}`}>
      <InlineIcon className="mrxs">local_fire_department</InlineIcon>
      {SearchResultsPageStrings.inDemandTag}
    </span>
  );
};
