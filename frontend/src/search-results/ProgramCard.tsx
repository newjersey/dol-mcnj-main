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
          <h2 className="blue text-m weight-500">{props.program.name}</h2>
        </div>
        <div className="col-xs-4 align-right">
          <h3 className="text-m weight-500">{formatMoney(props.program.totalCost)}</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 col-md-push-8 align-right-when-lg">
          <p className="mb-when-lg">
            <i className="material-icons mrxs hide-when-lg">card_travel</i>
            {formatPercentEmployed(props.program.percentEmployed)}
          </p>
        </div>
        <div className="col-md-8 col-md-pull-4">
          <p className="mt-when-lg">
            <i className="material-icons mrxs">location_on</i>
            {props.program.provider.city}
          </p>
        </div>
      </div>
    </div>
  );
};
