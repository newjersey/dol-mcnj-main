import React, { ReactElement } from "react";
import { TrainingResult } from "../domain/Training";
import { formatMoney } from "accounting";
import { CalendarLengthLookup } from "../localizations/CalendarLengthLookup";
import { Link } from "@reach/router";

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
    <Link className="no-link-format" to={`/training/${props.trainingResult.id}`}>
      <div className="card mbs container-fluid pam hover-shadow">
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
            <p className="mts mbxs">
              <i className="material-icons icon mrxs hide-when-lg">card_travel</i>
              {formatPercentEmployed(props.trainingResult.percentEmployed)}
            </p>
          </div>
          <div className="col-md-8 col-md-pull-4">
            <p className="mtxs mbz">
              <i className="material-icons icon mrxs">school</i>
              {props.trainingResult.provider.name}
            </p>
            <p className="mtxs mbz">
              <i className="material-icons icon mrxs">location_on</i>
              {props.trainingResult.provider.city}
            </p>
            <p className="mtxs mbz">
              <i className="material-icons icon mrxs">av_timer</i>
              {CalendarLengthLookup[props.trainingResult.calendarLength]}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
