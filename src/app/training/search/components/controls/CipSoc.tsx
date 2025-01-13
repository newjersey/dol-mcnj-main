"use client";
import { useContext } from "react";
import {
  extractParam,
  updateSearchParamsNavigate,
} from "../../utils/filterFunctions";
import { ResultsContext } from "../Results";
import { FormInput } from "@components/modules/FormInput";
import { getSearchData } from "../../utils/getSearchData";
import { Flex } from "@components/utility/Flex";

export const CipSoc = () => {
  let { results, setResults } = useContext(ResultsContext);

  return (
    <Flex gap="sm" direction="column" fill className="section cipsoc">
      <FormInput
        type="text"
        inputId="cip"
        label="Filter by CIP Code"
        defaultValue={extractParam("cipCode", results) || undefined}
        placeholder="i.e. 011102"
        onChange={(e) => {
          updateSearchParamsNavigate(
            [
              { key: "cipCode", value: e.target.value },
              { key: "p", value: "1" },
            ],
            getSearchData,
            setResults
          );
        }}
      />
      <FormInput
        type="text"
        inputId="soc"
        label="Filter by SOC Code"
        defaultValue={extractParam("socCode", results) || undefined}
        placeholder="i.e. 43-9041"
        onChange={(e) => {
          updateSearchParamsNavigate(
            [
              { key: "socCode", value: e.target.value },
              { key: "p", value: "1" },
            ],
            getSearchData,
            setResults
          );
        }}
      />
    </Flex>
  );
};
