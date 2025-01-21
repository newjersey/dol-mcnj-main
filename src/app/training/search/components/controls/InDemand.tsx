"use client";
import { useContext } from "react";
import {
  extractParam,
  updateSearchParamsNavigate,
} from "../../utils/filterFunctions";
import { ResultsContext } from "../Results";
import { getSearchData } from "../../utils/getSearchData";
import { Switch } from "@components/modules/Switch";

export const InDemand = () => {
  let { results, setResults } = useContext(ResultsContext);

  return (
    <div className="section inDemandOnly">
      <Switch
        inputId="inDemandOnly"
        label="Show In-Demand Trainings Only"
        defaultChecked={extractParam("inDemand", results) === "true"}
        onChange={(e) => {
          updateSearchParamsNavigate(
            [
              { key: "inDemand", value: e.target.checked.toString() },
              { key: "p", value: "1" },
            ],
            getSearchData,
            setResults
          );
        }}
      />
    </div>
  );
};
