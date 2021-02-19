import React, { ReactElement, useState } from "react";
import { PrimaryButton } from "../components/PrimaryButton";
import { TrainingResult } from "../domain/Training";
import { Button } from "@material-ui/core";
import { Icon } from "@material-ui/core";
import { ComparisonTable } from "./ComparisonTable";

interface Props {
  className?: string;
  trainings: TrainingResult[];
  setTrainingsToCompare: (setItemsToCompare: TrainingResult[]) => void;
}

export const TrainingComparison = (props: Props): ReactElement => {
  const [showComparison, setShowComparison] = useState<boolean>(false);

  const removeItem = (item: TrainingResult): void => {
    const newList = props.trainings.filter((el) => el !== item);
    props.setTrainingsToCompare(newList);
  };

  const compareItems = (): void => {
    setShowComparison(true);
  };

  const collapseItems = (): void => {
    setShowComparison(false);
  };

  const clearItems = (): void => {
    props.setTrainingsToCompare([]);
    setShowComparison(false);
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
              <div className="comparison-item fdc fjb" key={item.id}>
                <h4 className="">{item.name}</h4>
                <p className="mbs">{item.providerName}</p>

                <Button className="btn-remove" onClick={(): void => removeItem(item)}>
                  <Icon fontSize="inherit">cancel</Icon>
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
    return <ComparisonTable data={props.trainings} />;
  };

  if (props.trainings.length > 0) {
    return (
      <div
        className={`training-comparison bg-light-green width-100 btdcd ${
          showComparison ? "expanded" : ""
        }`}
      >
        <div className="container ptm pbl">
          <div className={`grid-container pbm ${showComparison ? "expanded" : ""}`}>
            {!showComparison && comparisonCollapsed()}
            {showComparison && comparisonExpanded()}

            <div className="button-container fdc fje">
              {showComparison && (
                <PrimaryButton className="btn-collapse" onClick={collapseItems}>
                  Collapse
                </PrimaryButton>
              )}

              {!showComparison && (
                <PrimaryButton className="btn-compare" onClick={compareItems}>
                  Compare
                </PrimaryButton>
              )}
              <PrimaryButton className="btn-clear-all" onClick={clearItems}>
                Clear all
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
