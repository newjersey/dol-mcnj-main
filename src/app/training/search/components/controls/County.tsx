"use client";
import { useContext } from "react";
import {
  extractParam,
  updateSearchParamsNavigate,
} from "../../utils/filterFunctions";
import { ResultsContext } from "../Results";
import { counties } from "@utils/counties";
import { getSearchData } from "../../utils/getSearchData";
import { FormInput } from "@components/modules/FormInput";

export const County = () => {
  let { results, setResults } = useContext(ResultsContext);

  return (
    <div className="section county">
      <FormInput
        type="select"
        inputId="county"
        label="Filter by County"
        defaultValue={extractParam("county", results) || undefined}
        options={[
          { key: "", value: "" },
          ...counties.map((county) => ({
            key: county,
            value: county,
          })),
        ]}
        onChangeSelect={(e) => {
          updateSearchParamsNavigate(
            [{ key: "county", value: e.target.value }],
            getSearchData,
            setResults
          );
        }}
      />
    </div>
  );
};
