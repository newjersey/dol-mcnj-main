import { Icon, useMediaQuery } from "@material-ui/core";
import ReactTooltip from "react-tooltip";
import React, { ReactElement } from "react";
import { StatBlockStrings } from "../localizations/StatBlockStrings";

interface Props {
  title: string;
  tooltipText?: string;
  data: string;
  dataSource?: string;
  backgroundColorClass: string;
}

export const StatBlock = (props: Props): ReactElement => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");

  const getDataMissingOrSource = (data: string): ReactElement | undefined => {
    if (data === StatBlockStrings.missingDataIndicator) {
      return <div>{StatBlockStrings.missingDataExplanation}</div>;
    } else {
      return (
        <div>
          {StatBlockStrings.dataSourceLabel}&nbsp;
          {props.dataSource || StatBlockStrings.defaultDataSource}
        </div>
      );
    }
  };

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
        <div>{props.title}</div>
        {!isTabletAndUp && <div className="stat-block-number mla mrs">{props.data}</div>}
        {props.tooltipText && (
          <div className="flex">
            <Icon fontSize="small" data-for={`${props.title}-tooltip`} data-tip="">
              info
            </Icon>
            <ReactTooltip
              id={`${props.title}-tooltip`}
              className="tooltip"
              border={true}
              borderColor={"#dbdada"}
              effect="solid"
              place="bottom"
              type="light"
            >
              <div className="pbs">{props.tooltipText}</div>
              {getDataMissingOrSource(props.data)}
            </ReactTooltip>
          </div>
        )}
      </div>
      {isTabletAndUp && <div className="stat-block-number ptm pbs">{props.data}</div>}
    </div>
  );
};
