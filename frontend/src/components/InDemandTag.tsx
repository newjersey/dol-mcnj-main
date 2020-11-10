import React, { ReactElement } from "react";
import { InlineIcon } from "./InlineIcon";

interface Props {
  className?: string;
}

export const InDemandTag = (props: Props): ReactElement => {
  return (
    <span className={`fin fas bg-orange tag pvxxs phd mrs ${props.className}`}>
      <InlineIcon className="mrxs">local_fire_department</InlineIcon>
      In Demand
    </span>
  );
};
