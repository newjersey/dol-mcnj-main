"use client";
import { Button } from "@components/modules/Button";
import { FormInput } from "@components/modules/FormInput";
import { Heading } from "@components/modules/Heading";
import { decodeUrlEncodedString } from "@utils/decodeUrlEncodedString";
import { useContext, useEffect } from "react";
import { ResultsContext } from "./Results";
import { handleSortChange } from "../utils/handleSortChange";
import { handleItemsPerPageChange } from "../utils/handleItemsPerPageChange";
import { SEARCH_RESULTS_PAGE_DATA as contentData } from "@data/pages/training/search";
import {
  extractParam,
  updateSearchParamsNavigate,
} from "../utils/filterFunctions";
import { FunnelSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { getSearchData } from "../utils/getSearchData";

export const ResultsHeader = () => {
  let {
    itemsPerPage,
    results,
    searchTerm,
    setItemsPerPage,
    setResults,
    setSearchTerm,
    setSortValue,
    setToggle,
    sortValue,
    toggle,
  } = useContext(ResultsContext);

  const params = new URLSearchParams(results.searchParams);

  const paramArray = Array.from(params.entries()).filter(
    ([key]) => key !== "q" && key !== "toggle" && key !== "p"
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setSortValue(urlParams.get("sort") || "");
      setItemsPerPage(urlParams.get("limit") || "");
    }
  }, []);

  return (
    <div className="resultsHeader">
      <div className="headingContainer">
        <Heading level={2} className="resultsCount">
          {results.itemCount === 0 &&
          (searchTerm === "undefined" || searchTerm === "null") ? (
            <>Find Training</>
          ) : (
            <>
              {results.itemCount}{" "}
              {results.itemCount === 1 ? "result" : "results"} found for &quot;
              {decodeUrlEncodedString(`${extractParam("q", results)}`)}&quot;
            </>
          )}
        </Heading>
        <div className="searchFormContainer">
          <form
            className="searchForm"
            onSubmit={(e) => {
              e.preventDefault();
              const q = new URL(window.location.href);
              const searchParams = q.searchParams;
              searchParams.set("q", searchTerm);
              window.location.href = `/training/search?${searchParams.toString()}`;
            }}
          >
            <FormInput
              inputId="search"
              label="Searching for training courses"
              hideLabel
              ariaLabel="search"
              type="search"
              defaultValue={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Searching for training courses"
            />
            <Button
              type="submit"
              buttonId="searchSubmit"
              defaultStyle="secondary"
              label={searchTerm ? "Update Results" : "Search"}
              onClick={() => {
                if (searchTerm) {
                  const q = new URL(window.location.href);
                  const searchParams = q.searchParams;
                  searchParams.set("q", searchTerm);
                }
              }}
            >
              <MagnifyingGlass size={16} color="white" weight="bold" />
            </Button>
          </form>
          <Button
            className="editSearchToggle"
            type="button"
            outlined
            onClick={() => {
              setToggle(!toggle);
            }}
          >
            <FunnelSimple size={16} color="currentColor" weight="bold" />
            <span className="sr-only">Filter for Search</span>
            {paramArray.length > 0 && (
              <span className="filterCount">{paramArray.length}</span>
            )}
          </Button>
        </div>
      </div>

      <div className="resultsHeaderControls">
        <Button
          iconSuffix="FunnelSimple"
          className="editSearch"
          type="button"
          outlined
          onClick={() => {
            setToggle(!toggle);
            updateSearchParamsNavigate(
              [{ key: "toggle", value: (!toggle).toString() }],
              getSearchData,
              setResults
            );
          }}
        >
          Filters
        </Button>

        <div className="sortBy">
          <FormInput
            label="Sort By"
            type="select"
            defaultValue={sortValue}
            inputId="sortBy"
            onChangeSelect={handleSortChange}
            options={contentData.sortOptions}
          />

          <FormInput
            label="Items Per Page"
            type="select"
            defaultValue={itemsPerPage || "10"}
            inputId="sortBy"
            onChangeSelect={handleItemsPerPageChange}
            options={contentData.perPageOptions}
          />
        </div>
      </div>
    </div>
  );
};
