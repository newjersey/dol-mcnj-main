import React, { ReactElement } from "react";
import { TrainingResult } from "../domain/Training";
import { formatMoney } from "accounting";

interface Props {
  trainingResult: TrainingResult;
}

export const TrainingResultCard = (props: Props): ReactElement => {
  const formatPercentEmployed = (percentEmployed: number | null): string => {
    if (percentEmployed === null) {
      return "--";
    }

    return (Math.trunc(percentEmployed * 1000) / 10).toFixed(1) + "% employed";
  };

  return (
    <a href={`/training/${props.trainingResult.id}`} className="no-link-format">
      <div className="card mbs container-fluid pam">
        <div className="row">
          <div className="col-xs-8">
            <h2 className="blue text-m weight-500">{props.trainingResult.name}</h2>
          </div>
          <div className="col-xs-4 align-right">
            <h3 className="text-m weight-500">{formatMoney(props.trainingResult.totalCost)}</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-md-push-8 align-right-when-lg">
            <p className="mb-when-lg">
              <i className="material-icons mrxs hide-when-lg">card_travel</i>
              {formatPercentEmployed(props.trainingResult.percentEmployed)}
            </p>
          </div>
          <div className="col-md-8 col-md-pull-4">
            <p className="mt-when-lg mbz">
              <i className="material-icons mrxs">location_on</i>
              {props.trainingResult.provider.city}
            </p>
            <p className="mtxs">
              <i className="material-icons mrxs">school</i>
              {props.trainingResult.provider.name}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
};
