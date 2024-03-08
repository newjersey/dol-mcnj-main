import { useMediaQuery } from "@material-ui/core";
import React, { ReactElement, useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { STAT_MISSING_DATA_INDICATOR } from "../constants";
import { ContextualInfoContext } from "../contextual-info/ContextualInfoContext";

interface Props {
  title: string;
  tooltipText?: string;
  data: string;
  dataSource?: string;
  backgroundColorClass: string;
}

export const StatBlock = (props: Props): ReactElement => {
  const { t } = useTranslation();

  const isTabletAndUp = useMediaQuery("(min-width:768px)");
  const { setContextualInfo } = useContext(ContextualInfoContext);

  const dataMissingOrSource =
    props.data === STAT_MISSING_DATA_INDICATOR
      ? t("StatBlock.missingDataExplanation")
      : `${t("StatBlock.dataSourceLabel")} ${props.dataSource ?? t("StatBlock.defaultDataSource")}`;

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
          <button
            onClick={onClickInfo}
            className="contextual-link-button"
            data-testid="accordion-button"
          >
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
