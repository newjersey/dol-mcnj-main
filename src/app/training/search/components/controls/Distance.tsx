"use client";
import { useContext, useState } from "react";
import {
  extractParam,
  removeSearchParams,
  updateSearchParams,
  updateSearchParamsNavigate,
} from "../../utils/filterFunctions";
import { ResultsContext } from "../Results";
import { getSearchData } from "../../utils/getSearchData";
import { FormInput } from "@components/modules/FormInput";
import { zipCodes } from "@utils/zipCodeCoordinates";
import { Flex } from "@components/utility/Flex";
import { WarningCircle } from "@phosphor-icons/react";

export const Distance = () => {
  let { results, setResults } = useContext(ResultsContext);
  const isInitialZipValid =
    zipCodes.filter((zip) => zip === extractParam("zip", results)).length > 0
      ? true
      : false;

  const [zipError, setZipError] = useState(!isInitialZipValid);
  const [zipCode, setZipCode] = useState(extractParam("zip", results) || "");
  const [attempted, setAttempted] = useState(
    extractParam("zip", results) ? !isInitialZipValid || false : false
  );

  return (
    <div className="section distance">
      <div className="label">Event a New Jersey Zip Code</div>
      <div className="input-row">
        <FormInput
          type="select"
          inputId="miles"
          label="Miles from Zip Code"
          hideLabel
          disabled={zipError}
          defaultValue={extractParam("miles", results) || undefined}
          options={[
            { key: "Miles", value: "" },
            { key: "5", value: "5" },
            { key: "10", value: "10" },
            { key: "25", value: "25" },
            { key: "50", value: "50" },
            { key: "100", value: "100" },
            { key: "200", value: "200" },
          ]}
          onChangeSelect={(e) => {
            if (e.target.value === "") {
              removeSearchParams([{ key: "miles" }, { key: "zip" }]);
            }
            updateSearchParamsNavigate(
              [
                { key: "miles", value: e.target.value },
                { key: "zip", value: zipCode || "" },
                { key: "p", value: "1" },
              ],
              getSearchData,
              setResults
            );
          }}
        />
        <span>from</span>
        <FormInput
          inputId="zip"
          label="Zip Code"
          ariaLabel="Search by ZIP code"
          hideLabel
          type="number"
          defaultValue={extractParam("zip", results) || undefined}
          placeholder="Zip Code"
          onChange={(e) => {
            updateSearchParams("zip", e.target.value);
            setZipCode(e.target.value);
          }}
          onBlur={() => {
            setAttempted(true);
            const isValidZip =
              zipCodes.filter((zip) => zip === zipCode).length > 0
                ? false
                : true;
            setZipError(isValidZip);
          }}
        />
      </div>
      {zipError && attempted ? (
        <Flex
          elementTag="span"
          alignItems="flex-start"
          gap="micro"
          className="errorMessage"
        >
          <WarningCircle weight="fill" />
          Please enter a 5-digit New Jersey ZIP code.
        </Flex>
      ) : undefined}
    </div>
  );
};
