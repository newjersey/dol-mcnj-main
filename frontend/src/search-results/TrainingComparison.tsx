import React, { ReactElement, useState } from "react";
import { TertiaryButton } from "../components/TertiaryButton";
import { TrainingResult } from "../domain/Training";
import { Button, useMediaQuery } from "@material-ui/core";
import { Icon } from "@material-ui/core";
import { ComparisonTable } from "./ComparisonTable";

interface Props {
  className?: string;
  trainings: TrainingResult[];
  setTrainingsToCompare: (setItemsToCompare: TrainingResult[]) => void;
}

export const TrainingComparison = (props: Props): ReactElement => {
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [scrollEnd, setScrollEnd] = useState<boolean>(true);
  const isTabletAndUp = useMediaQuery("(min-width:768px)");

  const compareItems = (): void => {
    setShowComparison(true);
  };

  const collapseItems = (): void => {
    setShowComparison(false);
  };

  const removeItem = (item: TrainingResult): void => {
    const newList = props.trainings.filter((el) => el !== item);
    props.setTrainingsToCompare(newList);
  };

  const clearItems = (): void => {
    props.setTrainingsToCompare([]);
    setShowComparison(false);
  };

  const scrollTable = (): void => {
    setScrollEnd(!scrollEnd);
  };

  const comparisonCollapsed = (): ReactElement => {
    const items = [];

    for (let i = 0; i < 3; i++) {
      props.trainings[i] ? items.push(props.trainings[i]) : items.push(undefined);
    }

    return (
      <>
        {items.map((item, key) => {
          if (item?.id) {
            return (
              <div className="comparison-item fdc" key={item.id}>
                <h4 className={isTabletAndUp ? "" : "truncated"}>{item.name}</h4>
                <p className={isTabletAndUp ? "mbs" : "truncated mbs"}>{item.providerName}</p>

                <Button className="btn-remove" onClick={(): void => removeItem(item)}>
                  <Icon fontSize="inherit">cancel</Icon>
                  <span className="visually-hidden">Cancel</span>
                </Button>
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
        {!isTabletAndUp && props.trainings.length > 2 && (
          <div className={`width-100 ${scrollEnd ? "align-right" : ""}`}>
            <Icon
              className={`mbs pointer ${!scrollEnd ? "icon-flip" : ""}`}
              role="button"
              onClick={scrollTable}
            >
              play_circle_filled
            </Icon>
          </div>
        )}
        <ComparisonTable
          data={props.trainings}
          wide={props.trainings.length > 2}
          className={!scrollEnd ? "table-scroll" : ""}
        />
      </>
    );
  };

  if (props.trainings.length > 0) {
    return (
      <div
        data-testid="training-comparison"
        className={`training-comparison bg-light-green width-100 btdcd ${
          showComparison ? "expanded" : ""
        }`}
      >
        <div className="container ptm pbl">
          <div className={`grid-container pbm ${showComparison ? "expanded" : ""}`}>
            {!showComparison && comparisonCollapsed()}
            {showComparison && comparisonExpanded()}

            <div className={`button-container fdc fje ${!isTabletAndUp && "ptm"}`}>
              {showComparison && (
                <TertiaryButton className="btn-collapse" onClick={collapseItems}>
                  Collapse
                </TertiaryButton>
              )}

              {!showComparison && (
                <TertiaryButton className="btn-compare" onClick={compareItems}>
                  Compare
                </TertiaryButton>
              )}
              <TertiaryButton className="btn-clear-all" onClick={clearItems}>
                Clear all
              </TertiaryButton>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
