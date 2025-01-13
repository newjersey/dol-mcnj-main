"use client";
import { useContext } from "react";
import {
  extractParam,
  updateSearchParamsNavigate,
} from "../../utils/filterFunctions";
import { ResultsContext } from "../Results";
import { FormInput } from "@components/modules/FormInput";
import { getSearchData } from "../../utils/getSearchData";

export const Cost = () => {
  let { results, setResults } = useContext(ResultsContext);

  return (
    <div className="section cost">
      <FormInput
        type="number"
        inputId="maxCost"
        label="Max Cost"
        defaultValue={extractParam("maxCost", results) || undefined}
        onChange={(e) => {
          updateSearchParamsNavigate(
            [
              { key: "maxCost", value: e.target.value },
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
