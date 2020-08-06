import React, { ReactElement } from "react";
import { InlineIcon } from "./InlineIcon";

interface Props {
  county: string;
}

export const LocalWaiverTag = (props: Props): ReactElement => {
  return (
    <span className="fin fas bg-orange tag pvxxs phd mrs">
      <InlineIcon className="mrxs">local_fire_department</InlineIcon>
      Waiver for {props.county} County
    </span>
  );
};
