import { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { FormControlLabel, Switch } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { toggleParams } from "../utils/updateUrlParams";

export const InDemandOnlyFilter = (): ReactElement => {
  const { t } = useTranslation();

  const [inDemandOnly, setInDemandOnly] = useState<boolean>(false);
  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const inDemandOnlyFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.IN_DEMAND_ONLY,
    );
    if (inDemandOnlyFilter) {
      setInDemandOnly(inDemandOnlyFilter.value);
    } else if (inDemandOnlyFilter == null && inDemandOnly) {
      setInDemandOnly(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

  const applyInDemandOnlyFilter = (event: ChangeEvent<HTMLInputElement>): void => {
    setInDemandOnly(event.target.checked);
    dispatch({
      type: event.target.checked ? FilterActionType.ADD : FilterActionType.REMOVE,
      filter: {
        element: FilterableElement.IN_DEMAND_ONLY,
        value: event.target.checked,
        func: (trainingResults): TrainingResult[] => trainingResults.filter((it) => it.inDemand),
      },
    });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inDemand = urlParams.get("inDemand");

    if (inDemand === "true") {
      setInDemandOnly(true);
      applyInDemandOnlyFilter({ target: { checked: true } } as ChangeEvent<HTMLInputElement>);
    }
  }, []);

  return (
    <FormControlLabel
      control={
        <Switch
          checked={inDemandOnly}
          onChange={(e) => {
            applyInDemandOnlyFilter(e);
            toggleParams({
              condition: e.target.checked,
              value: `${e.target.checked}`,
              key: "inDemand",
              valid: true,
            });
          }}
          name="inDemandOnly"
          color="primary"
        />
      }
      label={t("SearchAndFilter.inDemandFilterLabel")}
    />
  );
};
