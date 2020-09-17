import { Icon, useMediaQuery } from "@material-ui/core";
import ReactTooltip from "react-tooltip";
import React, { ReactElement } from "react";

interface Props {
  title: string;
  tooltipText?: string;
  data: string;
  backgroundColorClass: string;
}

export const StatBlock = (props: Props): ReactElement => {
  const isTabletAndUp = useMediaQuery("(min-width:768px)");

  const getDataMissingOrSource = (data: string): ReactElement | undefined => {
    if (data === "--") {
      return (
        <div>
          * This information is missing because we haven’t received enough data from this institute.
        </div>
      );
    } else {
      return <div>Data source: NJ Dept of Labor</div>;
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
      {/*<div className="fdr fjc fac" { ...tooltipTargetIfMobile()}>*/}
      <div className="fdr fje fac" {...tooltipTargetIfMobile()}>
        <div>{props.title}</div>
        {!isTabletAndUp && <div className="stat-block-number mla mrs">{props.data}</div>}
        {props.tooltipText && (
          <div>
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
