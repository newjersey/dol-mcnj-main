import React, { ReactElement } from "react";
import { TrainingResult } from "../domain/Training";
import { formatMoney } from "accounting";
import { CalendarLengthLookup } from "../localizations/CalendarLengthLookup";
import { Link } from "@reach/router";
import { InlineIcon } from "../components/InlineIcon";
import { InDemandTag } from "../components/InDemandTag";
import { LocalWaiverTag } from "../components/LocalWaiverTag";
import { formatPercentEmployed } from "../presenters/formatPercentEmployed";
import { SpacedCheckbox } from "../components/SpacedCheckbox";
import { FormGroup, FormControlLabel } from "@material-ui/core";

interface Props {
  trainingResult: TrainingResult;
  compareResult?: boolean;
  items?: TrainingResult[];
  setTrainingsToCompare?: (setItemsToCompare: TrainingResult[]) => void;
}

export const TrainingResultCard = (props: Props): ReactElement => {
  const handleCheckboxChange = (checked: boolean): void => {
    if (props.items) {
      let comparisonItems = props.items;

      if (checked) {
        comparisonItems = [...props.items, props.trainingResult];
      } else {
        comparisonItems = comparisonItems.filter((el) => el !== props.trainingResult);
      }

      props.setTrainingsToCompare && props.setTrainingsToCompare(comparisonItems);
    }
  };

  const getLocationOrOnline = (): string => {
    if (props.trainingResult.online) {
      return "Online Class";
    }

    return `${props.trainingResult.city}, ${props.trainingResult.county}`;
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

  const ComparisonCheckbox = (): ReactElement => {
    const isChecked =
      props.items && props.items.filter((el) => el === props.trainingResult).length > 0;

    return (
      <label className="bold mla" htmlFor="comparison">
        <FormGroup id={`comparison-${props.trainingResult.id}`}>
          <FormControlLabel
            control={
              <SpacedCheckbox
                checked={isChecked}
                onChange={(e, checked): void => {
                  return handleCheckboxChange(checked);
                }}
                name="compare"
                color="primary"
                disabled={props.items && props.items.length >= 3 && !isChecked}
              />
            }
            label="Compare"
          />
        </FormGroup>
      </label>
    );
  };

  return (
    <div data-testid="card" className="card mbs container-fluid pam hover-shadow">
      <div className="row mbd">
        <div className="col-xs-8">
          <h2 className="blue text-m weight-500">
            <Link className="no-link-format" to={`/training/${props.trainingResult.id}`}>
              {props.trainingResult.name}
            </Link>
          </h2>
        </div>
        <div className="col-xs-4 align-right">
          <h3 className="text-m weight-500">{formatMoney(props.trainingResult.totalCost)}</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 col-md-push-8 align-right-when-lg">
          <p className="mts mbxs">
            <span className="fin fas">
              <InlineIcon className="hide-when-lg mrs">card_travel</InlineIcon>
              {props.trainingResult.percentEmployed
                ? formatPercentEmployed(props.trainingResult.percentEmployed) + " employed"
                : "--"}
            </span>
          </p>
        </div>
        <div className="col-md-8 col-md-pull-4">
          <p className="mtxs mbz">
            <span className="fin fas">
              <InlineIcon className="mrs">school</InlineIcon>
              {props.trainingResult.providerName}
            </span>
          </p>
          <p className="mtxs mbz">
            <span className="fin fas">
              <InlineIcon className="mrs">location_on</InlineIcon>
              {getLocationOrOnline()}
            </span>
          </p>
          <p className="mtxs mbz">
            <span className="fin fas">
              <InlineIcon className="mrs">av_timer</InlineIcon>
              {CalendarLengthLookup[props.trainingResult.calendarLength]}
            </span>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <p>{boldHighlightedSection(props.trainingResult.highlight)}</p>
          <div className="mtxs mbz flex fac">
            {props.trainingResult.inDemand ? <InDemandTag /> : <></>}
            {props.trainingResult.localExceptionCounty.map((county) => (
              <LocalWaiverTag key={county} county={county} />
            ))}
            {props.compareResult && <ComparisonCheckbox />}
          </div>
        </div>
      </div>
    </div>
  );
};
