"use client";
import { useContext } from "react";
import {
  extractParam,
  updateSearchParamsNavigate,
} from "../../utils/filterFunctions";
import { ResultsContext } from "../Results";
import { FormInput } from "@components/modules/FormInput";
import { getSearchData } from "../../utils/getSearchData";

export const CompletionTime = () => {
  let { results, setResults } = useContext(ResultsContext);

  return (
    <div className="section completion">
      <p className="label">Time to Complete</p>
      <div className="items">
        <FormInput
          type="checkbox"
          inputId="days"
          defaultChecked={extractParam("days", results) === "true"}
          label="Days"
          onChange={(e) => {
            updateSearchParamsNavigate(
              [
                { key: "days", value: e.target.checked.toString() },
                { key: "p", value: "1" },
              ],
              getSearchData,
              setResults
            );
          }}
        />
        <FormInput
          type="checkbox"
          inputId="weeks"
          defaultChecked={extractParam("weeks", results) === "true"}
          label="Weeks"
          onChange={(e) => {
            updateSearchParamsNavigate(
              [
                { key: "weeks", value: e.target.checked.toString() },
                { key: "p", value: "1" },
              ],
              getSearchData,
              setResults
            );
          }}
        />
        <FormInput
          type="checkbox"
          inputId="months"
          label="Months"
          defaultChecked={extractParam("months", results) === "true"}
          onChange={(e) => {
            updateSearchParamsNavigate(
              [
                { key: "months", value: e.target.checked.toString() },
                { key: "p", value: "1" },
              ],
              getSearchData,
              setResults
            );
          }}
        />
        <FormInput
          type="checkbox"
          inputId="years"
          defaultChecked={extractParam("years", results) === "true"}
          label="Years"
          onChange={(e) => {
            updateSearchParamsNavigate(
              [
                { key: "years", value: e.target.checked.toString() },
                { key: "p", value: "1" },
              ],
              getSearchData,
              setResults
            );
          }}
        />
      </div>
    </div>
  );
};
