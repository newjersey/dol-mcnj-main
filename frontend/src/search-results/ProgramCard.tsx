import React, { ReactElement } from "react";
import { Program } from "../domain/Program";
import { formatMoney } from "accounting";

interface Props {
  program: Program;
}

export const ProgramCard = (props: Props): ReactElement => {
  const formatPercentEmployed = (percentEmployed: number | null): string => {
    if (percentEmployed === null) {
      return "--";
    }

    return (Math.trunc(percentEmployed * 1000) / 10).toFixed(1) + "% employed";
  };

  return (
    <div className="card pam mbs container-fluid">
      <div className="row">
        <div className="col-xs-8">
          <h3 className="blue">{props.program.name}</h3>
          <p>
            <i className="material-icons mrxs">location_on</i>
            {props.program.provider.city}
          </p>
        </div>
        <div className="col-xs-4 align-right">
          <h3>{formatMoney(props.program.totalCost)}</h3>
          <p>{formatPercentEmployed(props.program.percentEmployed)}</p>
        </div>
      </div>
    </div>
  );
};
