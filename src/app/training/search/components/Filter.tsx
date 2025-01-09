"use client";
import { Button } from "@components/modules/Button";
import { FormInput } from "@components/modules/FormInput";
import { Switch } from "@components/modules/Switch";
import { Flex } from "@components/utility/Flex";
import { CaretDown, CaretUp, WarningCircle } from "@phosphor-icons/react";
import { counties } from "@utils/counties";
import { allLanguages } from "@utils/languages";
import { camelify } from "@utils/slugify";
import { zipCodes } from "@utils/zipCodeCoordinates";
import { useContext, useState } from "react";
import { getSearchData } from "../utils/getSearchData";
import { ResultsContext } from "./Results";
import {
  extractParam,
  removeSearchParams,
  updateSearchParams,
  updateSearchParamsNavigate,
} from "../utils/filterFunctions";

interface FilterProps {
  className?: string;
}

const Filter = ({ className }: FilterProps) => {
  let { results, setResults, toggle, searchTerm } = useContext(ResultsContext);

  const isInitialZipValid =
    zipCodes.filter((zip) => zip === extractParam("zip", results)).length > 0
      ? true
      : false;

  const [zipError, setZipError] = useState(!isInitialZipValid);
  const [zipCode, setZipCode] = useState(extractParam("zip", results) || "");
  const [attempted, setAttempted] = useState(
    extractParam("zip", results) ? !isInitialZipValid || false : false
  );
  const [showMore, setShowMore] = useState(false);

  return (
    <aside
      id="searchFilter"
      className={`searchFilter${className ? ` ${className}` : ""}${
        toggle ? " open" : ""
      }`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateSearchParamsNavigate(
            [
              { key: "q", value: searchTerm },
              { key: "p", value: "1" },
            ],
            getSearchData,
            setResults
          );
        }}
      >
        {/* SEARCH */}
        <div className="section search">
          <Button
            type="button"
            defaultStyle="secondary"
            outlined
            label=" Clear Filters"
            onClick={() => {
              window.location.href = `/training/search?q=${extractParam(
                "q",
                results
              )}`;
            }}
          />
        </div>
        {/* DISTANCE */}
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
        {/* COUNTY */}
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
        {/* IN-DEMAND */}
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
        {/* COST */}
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
        {/* FORMAT */}
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
        {/* COMPLETION TIME */}
        <div className="section completion">
          <p className="label">Time to Complete</p>
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
        {/* SERVICES */}
        <div className="section services">
          <p className="label">Filter by Provider Services</p>

          <Switch
            inputId="wheelchair-accessible"
            defaultChecked={
              extractParam("isWheelchairAccessible", results) === "true"
            }
            label="Wheelchair Accessible"
            onChange={(e) => {
              updateSearchParamsNavigate(
                [
                  {
                    key: "isWheelchairAccessible",
                    value: e.target.checked.toString(),
                  },
                  { key: "p", value: "1" },
                ],
                getSearchData,
                setResults
              );
            }}
          />
          <Switch
            inputId="childcare-assistance"
            label="Childcare Assistance"
            defaultChecked={
              extractParam("hasChildcareAssistance", results) === "true"
            }
            onChange={(e) => {
              updateSearchParamsNavigate(
                [
                  {
                    key: "hasChildcareAssistance",
                    value: e.target.checked.toString(),
                  },
                ],
                getSearchData,
                setResults
              );
            }}
          />
          <Switch
            inputId="offer-evening-courses"
            label="Offer Evening Courses"
            defaultChecked={
              extractParam("hasEveningCourses", results) === "true"
            }
            onChange={(e) => {
              updateSearchParamsNavigate(
                [
                  {
                    key: "hasEveningCourses",
                    value: e.target.checked.toString(),
                  },
                  { key: "p", value: "1" },
                ],
                getSearchData,
                setResults
              );
            }}
          />
          <Switch
            inputId="job-placement-assistance"
            label="Job Placement Assistance"
            defaultChecked={
              extractParam("hasJobPlacementAssistance", results) === "true"
            }
            onChange={(e) => {
              updateSearchParamsNavigate(
                [
                  {
                    key: "hasJobPlacementAssistance",
                    value: e.target.checked.toString(),
                  },
                  { key: "p", value: "1" },
                ],
                getSearchData,
                setResults
              );
            }}
          />
        </div>
        {/* LANGUAGE */}
        <div className="section language">
          <p className="label">Filter by Language</p>
          <div className="items">
            {allLanguages.map((lang, index) => (
              <FormInput
                key={lang}
                type="checkbox"
                className={
                  showMore ? undefined : index > 3 ? "hide" : undefined
                }
                inputId={lang}
                label={lang}
                defaultChecked={
                  extractParam(camelify(lang), results) === "true"
                }
                onChange={(e) => {
                  updateSearchParamsNavigate(
                    [
                      {
                        key: camelify(lang),
                        value: e.target.checked.toString(),
                      },
                      { key: "p", value: "1" },
                    ],
                    getSearchData,
                    setResults
                  );
                }}
              />
            ))}
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowMore(!showMore);
            }}
          >
            {showMore ? <CaretUp size={20} /> : <CaretDown size={20} />}
            Show {showMore ? "less" : "more"}
          </a>
        </div>
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
      </form>
    </aside>
  );
};

export { Filter };
