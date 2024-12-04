"use client";
import { Button } from "@components/modules/Button";
import { FormInput } from "@components/modules/FormInput";
import { Switch } from "@components/modules/Switch";
import { Flex } from "@components/utility/Flex";
import { CaretDown, CaretUp, WarningCircle } from "@phosphor-icons/react";
import { counties } from "@utils/counties";
import { allLanguages } from "@utils/languages";
import { camelify } from "@utils/slugify";
import { FetchResultsProps, ResultProps } from "@utils/types";
import { zipCodes } from "@utils/zipCodeCoordinates";
import { useEffect, useState } from "react";
import { getSearchData } from "../utils/getSearchData";

interface FilterProps {
  allItems?: ResultProps[];
  className?: string;
  searchParams?: string;
  setResults?: (results: FetchResultsProps) => void;
}

const Filter = ({ className, searchParams = "", setResults }: FilterProps) => {
  const extractQuery = () => {
    return searchParams.split("q=")[1].split("&")[0];
  };

  const extractParam = (param: string) => {
    const q = new URLSearchParams(searchParams);
    return q.get(param);
  };
  const isInitialZipValid =
    zipCodes.filter((zip) => zip === extractParam("zip")).length > 0
      ? true
      : false;

  const [searchValue, setSearchValue] = useState<string>(extractQuery() || "");
  const [searchQuery, setSearchQuery] = useState<string>(searchParams);
  const [loading, setLoading] = useState(true);
  const [zipError, setZipError] = useState(!isInitialZipValid);
  const [zipCode, setZipCode] = useState(extractParam("zip") || "");
  const [attempted, setAttempted] = useState(
    extractParam("zip") ? !isInitialZipValid || false : false
  );
  const [showMore, setShowMore] = useState(false);

  const updateSearchParams = (key: string, value: string) => {
    const q = new URL(window.location.href);
    const searchParams = q.searchParams;

    if (!value || value === "" || value === "false") {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }

    setSearchQuery(`${searchParams}`);
  };

  const updateSearchParamsNavigate = async (
    keyValueArray: { key: string; value: string }[]
  ) => {
    const q = new URL(window.location.href);
    const searchParams = q.searchParams;

    keyValueArray.forEach((keyValue) => {
      if (
        !keyValue.value ||
        keyValue.value === "" ||
        keyValue.value === "false"
      ) {
        searchParams.delete(keyValue.key);
      } else {
        searchParams.set(keyValue.key, keyValue.value);
      }
    });

    setSearchQuery(`${searchParams || ""}`);

    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${searchParams}`
    );

    const searchParamObject = {
      searchParams: Object.fromEntries(searchParams.entries()),
    };

    const searchProps = await getSearchData(searchParamObject as any);

    if (setResults) {
      setResults(searchProps);
    }
  };

  const removeSearchParams = (keyArray: { key: string }[]) => {
    const q = new URL(window.location.href);
    const searchParams = q.searchParams;

    keyArray.forEach((key) => {
      searchParams.delete(key.key);
      setSearchQuery(`${searchParams || ""}`);
    });

    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${searchParams}`
    );
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <aside
      id="searchFilter"
      className={`searchFilter${className ? ` ${className}` : ""}`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateSearchParamsNavigate([
            { key: "q", value: searchValue },
            { key: "p", value: "1" },
          ]);
        }}
      >
        {/* SEARCH */}
        <div className="section search">
          <FormInput
            inputId="search"
            label="Searching for training courses"
            hideLabel
            ariaLabel="search"
            type="search"
            defaultValue={extractQuery() || ""}
            onChange={(e) => {
              setSearchValue(e.target.value);
              updateSearchParams("q", e.target.value);
            }}
            placeholder="Searching for training courses"
          />
          <Button
            type="submit"
            buttonId="searchSubmit"
            defaultStyle="secondary"
            label={extractParam("q") ? "Update Results" : "Search"}
            onClick={() => {
              if (searchQuery) {
                const q = new URL(window.location.href);
                const searchParams = q.searchParams;
                searchParams.set("q", searchQuery);
              }
            }}
          />

          <Button
            type="button"
            defaultStyle="secondary"
            outlined
            label=" Clear Filters"
            onClick={() => {
              window.location.href = `/training/search?q=${extractParam("q")}`;
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
              disabled={zipError || loading}
              defaultValue={extractParam("miles") || undefined}
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
                updateSearchParamsNavigate([
                  { key: "miles", value: e.target.value },
                  { key: "zip", value: zipCode || "" },
                  { key: "p", value: "1" },
                ]);
              }}
            />
            <span>from</span>
            <FormInput
              inputId="zip"
              label="Zip Code"
              ariaLabel="Search by ZIP code"
              disabled={loading}
              hideLabel
              type="number"
              defaultValue={extractParam("zip") || undefined}
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
            disabled={loading}
            inputId="county"
            label="Filter by County"
            defaultValue={extractParam("county") || undefined}
            options={[
              { key: "", value: "" },
              ...counties.map((county) => ({
                key: county,
                value: county,
              })),
            ]}
            onChangeSelect={(e) => {
              updateSearchParamsNavigate([
                { key: "county", value: e.target.value },
              ]);
            }}
          />
        </div>
        {/* IN-DEMAND */}
        <div className="section inDemandOnly">
          <Switch
            inputId="inDemandOnly"
            label="Show In-Demand Trainings Only"
            disabled={loading}
            defaultChecked={extractParam("inDemand") === "true"}
            onChange={(e) => {
              updateSearchParamsNavigate([
                { key: "inDemand", value: e.target.checked.toString() },
                { key: "p", value: "1" },
              ]);
            }}
          />
        </div>
        {/* COST */}
        <div className="section cost">
          <FormInput
            type="number"
            inputId="maxCost"
            label="Max Cost"
            disabled={loading}
            defaultValue={extractParam("maxCost") || undefined}
            onChange={(e) => {
              updateSearchParamsNavigate([
                { key: "maxCost", value: e.target.value },
                { key: "p", value: "1" },
              ]);
            }}
          />
        </div>
        {/* FORMAT */}
        <div className="section format">
          <p className="label">Class Format</p>
          <FormInput
            type="checkbox"
            disabled={loading}
            inputId="in-person"
            label="In-Person"
            defaultChecked={extractParam("inPerson") === "true"}
            onChange={(e) => {
              updateSearchParamsNavigate([
                { key: "inPerson", value: e.target.checked.toString() },
                { key: "p", value: "1" },
              ]);
            }}
          />

          <FormInput
            type="checkbox"
            inputId="online"
            defaultChecked={extractParam("online") === "true"}
            disabled={loading}
            label="Online"
            onChange={(e) => {
              updateSearchParamsNavigate([
                { key: "online", value: e.target.checked.toString() },
                { key: "p", value: "1" },
              ]);
            }}
          />
        </div>
        {/* COMPLETION TIME */}
        <div className="section completion">
          <p className="label">Time to Complete</p>
          <FormInput
            type="checkbox"
            inputId="days"
            defaultChecked={extractParam("days") === "true"}
            disabled={loading}
            label="Days"
            onChange={(e) => {
              updateSearchParamsNavigate([
                { key: "days", value: e.target.checked.toString() },
                { key: "p", value: "1" },
              ]);
            }}
          />
          <FormInput
            type="checkbox"
            inputId="weeks"
            defaultChecked={extractParam("weeks") === "true"}
            disabled={loading}
            label="Weeks"
            onChange={(e) => {
              updateSearchParamsNavigate([
                { key: "weeks", value: e.target.checked.toString() },
                { key: "p", value: "1" },
              ]);
            }}
          />
          <FormInput
            type="checkbox"
            inputId="months"
            disabled={loading}
            label="Months"
            defaultChecked={extractParam("months") === "true"}
            onChange={(e) => {
              updateSearchParamsNavigate([
                { key: "months", value: e.target.checked.toString() },
                { key: "p", value: "1" },
              ]);
            }}
          />
          <FormInput
            type="checkbox"
            disabled={loading}
            inputId="years"
            defaultChecked={extractParam("years") === "true"}
            label="Years"
            onChange={(e) => {
              updateSearchParamsNavigate([
                { key: "years", value: e.target.checked.toString() },
                { key: "p", value: "1" },
              ]);
            }}
          />
        </div>
        {/* SERVICES */}
        <div className="section services">
          <p className="label">Filter by Provider Services</p>

          <Switch
            inputId="wheelchair-accessible"
            defaultChecked={extractParam("isWheelchairAccessible") === "true"}
            label="Wheelchair Accessible"
            disabled={loading}
            onChange={(e) => {
              updateSearchParamsNavigate([
                {
                  key: "isWheelchairAccessible",
                  value: e.target.checked.toString(),
                },
                { key: "p", value: "1" },
              ]);
            }}
          />
          <Switch
            inputId="childcare-assistance"
            label="Childcare Assistance"
            defaultChecked={extractParam("hasChildcareAssistance") === "true"}
            disabled={loading}
            onChange={(e) => {
              updateSearchParamsNavigate([
                {
                  key: "hasChildcareAssistance",
                  value: e.target.checked.toString(),
                },
              ]);
            }}
          />
          <Switch
            inputId="offer-evening-courses"
            label="Offer Evening Courses"
            defaultChecked={extractParam("hasEveningCourses") === "true"}
            disabled={loading}
            onChange={(e) => {
              updateSearchParamsNavigate([
                {
                  key: "hasEveningCourses",
                  value: e.target.checked.toString(),
                },
                { key: "p", value: "1" },
              ]);
            }}
          />
          <Switch
            inputId="job-placement-assistance"
            label="Job Placement Assistance"
            disabled={loading}
            defaultChecked={
              extractParam("hasJobPlacementAssistance") === "true"
            }
            onChange={(e) => {
              updateSearchParamsNavigate([
                {
                  key: "hasJobPlacementAssistance",
                  value: e.target.checked.toString(),
                },
                { key: "p", value: "1" },
              ]);
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
                disabled={loading}
                inputId={lang}
                label={lang}
                defaultChecked={extractParam(camelify(lang)) === "true"}
                onChange={(e) => {
                  updateSearchParamsNavigate([
                    {
                      key: camelify(lang),
                      value: e.target.checked.toString(),
                    },
                    { key: "p", value: "1" },
                  ]);
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
            disabled={loading}
            label="Filter by CIP Code"
            defaultValue={extractParam("cipCode") || undefined}
            placeholder="i.e. 011102"
            onChange={(e) => {
              updateSearchParamsNavigate([
                { key: "cipCode", value: e.target.value },
                { key: "p", value: "1" },
              ]);
            }}
          />
          <FormInput
            type="text"
            disabled={loading}
            inputId="soc"
            label="Filter by SOC Code"
            defaultValue={extractParam("socCode") || undefined}
            placeholder="i.e. 43-9041"
            onChange={(e) => {
              updateSearchParamsNavigate([
                { key: "socCode", value: e.target.value },
                { key: "p", value: "1" },
              ]);
            }}
          />
        </Flex>
      </form>
    </aside>
  );
};

export { Filter };
