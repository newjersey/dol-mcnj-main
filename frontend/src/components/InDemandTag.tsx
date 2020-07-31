import React, { ReactElement } from "react";
import { InlineIcon } from "./InlineIcon";

export const InDemandTag = (): ReactElement => {
  return (
    <span className="fin fas bg-orange tag pvxxs phd">
      <InlineIcon className="mrxs">local_fire_department</InlineIcon>
      In Demand
    </span>
  );
};
