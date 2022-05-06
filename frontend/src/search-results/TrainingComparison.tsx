import React, { ReactElement, useState, useContext } from "react";
import { TrainingResult } from "../domain/Training";
import { useMediaQuery } from "@material-ui/core";
import { Icon } from "@material-ui/core";
import { ComparisonTable } from "./ComparisonTable";
import { ComparisonActionType, ComparisonContext } from "../comparison/ComparisonContext";
import { UnstyledButton } from "../components/UnstyledButton";
import { Button } from "../components/Button";
import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
  comparisonItems: TrainingResult[];
}

export const TrainingComparison = (props: Props): ReactElement => {
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [scrollEnd, setScrollEnd] = useState<boolean>(true);
  const isTabletAndUp = useMediaQuery("(min-width:768px)");
  const { t } = useTranslation();

  const { dispatch } = useContext(ComparisonContext);

  const compareItems = (): void => {
    setShowComparison(true);
  };

  const collapseItems = (): void => {
    setShowComparison(false);
  };

  const removeItem = (item: TrainingResult): void => {
    dispatch({
      type: ComparisonActionType.REMOVE,
      comparison: item,
      list: props.comparisonItems,
    });
  };

  const clearItems = (): void => {
    dispatch({
      type: ComparisonActionType.REMOVE_ALL,
      comparison: props.comparisonItems[0],
      list: [],
    });
  };

  const scrollTable = (): void => {
    setScrollEnd(!scrollEnd);
  };

  const comparisonCollapsed = (): ReactElement => {
    const items = [];

    for (let i = 0; i < 3; i++) {
      props.comparisonItems[i] ? items.push(props.comparisonItems[i]) : items.push(undefined);
    }

    return (
      <>
        {items.map((item, key) => {
          if (item?.id) {
            return (
              <div className="comparison-item fdc" key={item.id}>
                <h4 className={isTabletAndUp ? "" : "truncated"}>{item.name}</h4>
                <p className={isTabletAndUp ? "mbs" : "truncated mbs"}>{item.providerName}</p>

                <UnstyledButton className="btn-remove" onClick={(): void => removeItem(item)}>
                  <Icon fontSize="inherit">cancel</Icon>
                  <span className="visually-hidden">
                    {t("SearchResultsPageStrings.comparisonRemove")}
                  </span>
                </UnstyledButton>
              </div>
            );
          } else {
            return <div key={key} className="comparison-item empty" />;
          }
        })}
      </>
    );
  };

  const comparisonExpanded = (): ReactElement => {
    return (
      <>
        {!isTabletAndUp && props.comparisonItems.length > 2 && (
          <div className={`width-100 ${scrollEnd ? "align-right" : ""}`}>
            <Icon
              className={`pointer ${!scrollEnd ? "icon-flip" : ""}`}
              role="button"
              onClick={scrollTable}
            >
              play_circle_filled
            </Icon>
          </div>
        )}
        <ComparisonTable data={props.comparisonItems} scrollEnd={scrollEnd} />
      </>
    );
  };

  if (props.comparisonItems.length > 0) {
    return (
      <div
        data-testid="training-comparison"
        className={`training-comparison bg-light-green width-100 btdcd ${
          showComparison ? "expanded" : ""
        }`}
      >
        <div className="container pvm">
          <div
            className={`grid-container ${isTabletAndUp && "pbm"} ${
              showComparison ? "expanded" : ""
            }`}
          >
            {!showComparison && comparisonCollapsed()}
            {showComparison && comparisonExpanded()}

            <div className={`button-container fdc fje ${!isTabletAndUp && "ptm"}`}>
              {showComparison && (
                <Button variant="outline" className="btn-collapse" onClick={collapseItems}>
                  {t("SearchResultsPageStrings.comparisonCollapse")}
                </Button>
              )}

              {!showComparison && (
                <Button variant="outline" className="btn-compare" onClick={compareItems}>
                  {t("SearchResultsPageStrings.comparisonCompare")}
                </Button>
              )}
              <Button variant="outline" className="btn-clear-all" onClick={clearItems}>
                {t("SearchResultsPageStrings.comparisonClear")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
