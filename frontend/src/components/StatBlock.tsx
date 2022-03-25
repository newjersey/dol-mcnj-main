import { useMediaQuery } from "@material-ui/core";
import React, { ReactElement, useContext, useCallback } from "react";
import { StatBlockStrings } from "../localizations/StatBlockStrings";
import { ContextualInfoContext } from "../contextual-info/ContextualInfoContext";

interface Props {
  title: string;
  tooltipText?: string;
  data: string;
  dataSource?: string;
  backgroundColorClass: string;
}

export const StatBlock = (props: Props): ReactElement => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");
  const { setContextualInfo } = useContext(ContextualInfoContext);

  const dataMissingOrSource =
    props.data === StatBlockStrings.missingDataIndicator
      ? StatBlockStrings.missingDataExplanation
      : `${StatBlockStrings.dataSourceLabel} ${
          props.dataSource ?? StatBlockStrings.defaultDataSource
        }`;

  const onClickInfo = useCallback(() => {
    setContextualInfo((prevValue) => ({
      ...prevValue,
      isOpen: true,
      title: props.title,
      body: props.tooltipText + ". " + dataMissingOrSource ?? "",
    }));
  }, [dataMissingOrSource, props.title, props.tooltipText, setContextualInfo]);

  const tooltipTargetIfMobile = (): Record<string, string> | undefined => {
    if (!isTabletAndUp) {
      return {
        "data-for": `${props.title}-tooltip`,
        "data-tip": "",
      };
    }
  };

  return (
    <div className={`${props.backgroundColorClass} stat-block`}>
      <div
        className={props.tooltipText ? "fdr fjb fac" : "fdr fje fac"}
        {...tooltipTargetIfMobile()}
      >
        {props.tooltipText != null ? (
          <button onClick={onClickInfo} className="contextual-link-button">
            <span className="contextual-link-text">{props.title}</span>
          </button>
        ) : (
          <div>{props.title}</div>
        )}
        {!isTabletAndUp && <div className="stat-block-number mla mrs">{props.data}</div>}
      </div>
      {isTabletAndUp && <div className="stat-block-number ptm pbs">{props.data}</div>}
    </div>
  );
};
