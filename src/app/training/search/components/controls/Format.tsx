"use client";
import { useContext } from "react";
import {
  extractParam,
  updateSearchParamsNavigate,
} from "../../utils/filterFunctions";
import { ResultsContext } from "../Results";
import { getSearchData } from "../../utils/getSearchData";
import { FormInput } from "@components/modules/FormInput";

export const Format = () => {
  let { results, setResults } = useContext(ResultsContext);

  return (
    <div className="section format">
      <p className="label">Class Format</p>
      <FormInput
        type="checkbox"
        inputId="in-person"
        label="In-Person"
        defaultChecked={extractParam("inPerson", results) === "true"}
        onChange={(e) => {
          updateSearchParamsNavigate(
            [
              { key: "inPerson", value: e.target.checked.toString() },
              { key: "p", value: "1" },
            ],

            getSearchData,
            setResults
          );
        }}
      />

      <FormInput
        type="checkbox"
        inputId="online"
        defaultChecked={extractParam("online", results) === "true"}
        label="Online"
        onChange={(e) => {
          updateSearchParamsNavigate(
            [
              { key: "online", value: e.target.checked.toString() },
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
