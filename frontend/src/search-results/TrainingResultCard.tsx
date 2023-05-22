import React, { ReactElement, useContext } from "react";
import { TrainingResult } from "../domain/Training";
import { formatMoney } from "accounting";
import { Link } from "@reach/router";
import { InlineIcon } from "../components/InlineIcon";
import { InDemandTag } from "../components/InDemandTag";
import { formatPercentEmployed } from "../presenters/formatPercentEmployed";
import { SpacedCheckbox } from "../components/SpacedCheckbox";
import { FormGroup, FormControlLabel, useMediaQuery } from "@material-ui/core";
import { ComparisonActionType, ComparisonContext } from "../comparison/ComparisonContext";
import { useTranslation } from "react-i18next";

interface Props {
  trainingResult: TrainingResult;
  comparisonItems?: TrainingResult[];
}

export const TrainingResultCard = (props: Props): ReactElement => {
  const { state, dispatch } = useContext(ComparisonContext);
  const isTabletAndUp = useMediaQuery("(min-width:768px)");
  const { t } = useTranslation();

  const handleCheckboxChange = (checked: boolean): void => {
    dispatch({
      type: checked ? ComparisonActionType.ADD : ComparisonActionType.REMOVE,
      comparison: props.trainingResult,
      list: props.comparisonItems || [],
    });
  };

  const getLocationOrOnline = (): string => {
    if (props.trainingResult.online) {
      return t("SearchResultsPage.onlineClassLabel");
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
      state.comparison &&
      state.comparison.filter((el) => el.id === props.trainingResult.id).length > 0;

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
                disabled={props.comparisonItems && props.comparisonItems.length >= 3 && !isChecked}
              />
            }
            label={t("SearchResultsPage.comparisonCheckLabel")}
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
            <Link className="link-format-blue" to={`/training/${props.trainingResult.id}`}>
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
                ? t("SearchResultsPage.percentEmployed", {
                    percent: formatPercentEmployed(props.trainingResult.percentEmployed),
                  })
                : t("SearchResultsPage.percentEmployedUnavailable")}
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
              {t("SearchResultsPage.timeToComplete", {
                time: t(`CalendarLengthLookup.${props.trainingResult.calendarLength}`),
              })}
            </span>
          </p>
          <p className="mtxs mbz">
            <span className="fin fas">
              <InlineIcon className="mrs">qr_code</InlineIcon>
              {props.trainingResult.cipCode
                  ? t("SearchResultsPage.cipCode") +`: ${props.trainingResult.cipCode}`
                  : t("SearchResultsPage.cipCodeUnavailable")}
            </span>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          {isTabletAndUp && (
            <p data-testid="result-highlight">
              {boldHighlightedSection(props.trainingResult.highlight)}
            </p>
          )}
          <div className="mtxs mbz flex fac">
            {props.trainingResult.inDemand ? <InDemandTag /> : <></>}
            {
              (
              !props.trainingResult.inDemand &&
              props.trainingResult.localExceptionCounty &&
              (props.trainingResult.localExceptionCounty.includes(removeCountyFromEnd(props.trainingResult.county)) || props.trainingResult.online)
                ? <InDemandTag counties={props.trainingResult.localExceptionCounty} />
                : <></>
            )}
            {props.comparisonItems && <ComparisonCheckbox />}
          </div>
        </div>
      </div>
    </div>
  );
};

function removeCountyFromEnd(str: string) {
  const trimmedStr = str.trim();
  const countyIndex = trimmedStr.lastIndexOf("County");

  if (countyIndex !== -1 && countyIndex === trimmedStr.length - 6) {
    return trimmedStr.substring(0, countyIndex).trim();
  }

  return trimmedStr;
}