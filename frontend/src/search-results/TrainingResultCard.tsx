import React, { ReactElement } from "react";
import { TrainingResult } from "../domain/Training";
import { formatMoney } from "accounting";
import { CalendarLengthLookup } from "../localizations/CalendarLengthLookup";
import { Link } from "@reach/router";
import { InlineIcon } from "../components/InlineIcon";
import { InDemandTag } from "../components/InDemandTag";
import { LocalWaiverTag } from "../components/LocalWaiverTag";
import { formatPercentEmployed } from "../presenters/formatPercentEmployed";

interface Props {
  trainingResult: TrainingResult;
}

export const TrainingResultCard = (props: Props): ReactElement => {
  const getLocationOrOnline = (): string => {
    if (props.trainingResult.online) {
      return "Online Class";
    }

    return props.trainingResult.provider.city;
  };

  const boldHighlightedSection = (highlight: string): ReactElement[] => {
    if (highlight === "") {
      return [];
    }

    const boldedHighlights = highlight
      .split("[[")
      .flatMap((substring) => substring.split("]]"))
      .map((section, index) => {
        if (index % 2 !== 0) {
          return <b key={index}>{section}</b>;
        } else {
          return <span key={index}>{section}</span>;
        }
      });

    return [<span key="start">"...</span>, ...boldedHighlights, <span key="end">..."</span>];
  };

  return (
    <Link className="no-link-format" to={`/training/${props.trainingResult.id}`}>
      <div className="card mbs container-fluid pam hover-shadow">
        <div className="row mbd">
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
              <span className="fin fas">
                <InlineIcon className="hide-when-lg mrxs">card_travel</InlineIcon>
                {formatPercentEmployed(props.trainingResult.percentEmployed)} employed
              </span>
            </p>
          </div>
          <div className="col-md-8 col-md-pull-4">
            <p className="mtxs mbz">
              <span className="fin fas">
                <InlineIcon className="mrxs">school</InlineIcon>
                {props.trainingResult.provider.name}
              </span>
            </p>
            <p className="mtxs mbz">
              <span className="fin fas">
                <InlineIcon className="mrxs">location_on</InlineIcon>
                {getLocationOrOnline()}
              </span>
            </p>
            <p className="mtxs mbz">
              <span className="fin fas">
                <InlineIcon className="mrxs">av_timer</InlineIcon>
                {CalendarLengthLookup[props.trainingResult.calendarLength]}
              </span>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-10">
            <p>{boldHighlightedSection(props.trainingResult.highlight)}</p>
            <p className="mtxs mbz">
              {props.trainingResult.inDemand ? <InDemandTag /> : <></>}
              {props.trainingResult.localExceptionCounty.map((county) => (
                <LocalWaiverTag key={county} county={county} />
              ))}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
