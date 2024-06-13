import {
  ChangeEvent,
  ReactElement,
  useContext,
  useEffect,
  useState
} from "react";
import { RouteComponentProps, WindowLocation } from "@reach/router";
import { CircularProgress } from "@material-ui/core";

import { logEvent } from "../analytics";
import { ComparisonContext } from "../comparison/ComparisonContext";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { TrainingResult, TrainingData } from "../domain/Training";
import pageImage from "../images/ogImages/searchResults.png";
import { usePageTitle } from "../utils/usePageTitle";

import { ErrorBlock } from "../error/ErrorPage";

import { FilterDrawer } from "../filtering/FilterDrawer";

import { Breadcrumbs } from "./Breadcrumbs";
import { Pagination } from "./Pagination";
import { ResultsHeader } from "./ResultsHeader";
import { SearchTips } from "./SearchTips";
import { SearchSelects } from "./SearchSelects";
import { TrainingComparison } from "./TrainingComparison";
import { TrainingResultCard } from "./TrainingResultCard";

import { getPageTitle, getSearchQuery } from "./searchResultFunctions";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

export const SearchResultsPage = ({ client, location }: Props): ReactElement<Props> => {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [metaData, setMetaData] = useState<TrainingData["meta"]>();
  const [pageNumber, setPageNumber] = useState<number>();
  const [pageTitle, setPageTitle] = useState<string>(
    `Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
  );
  const [sortBy, setSortBy] = useState<"asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match">("best_match");
  const [trainings, setTrainings] = useState<TrainingResult[]>([]);

  const [cipCode, setCipCode] = useState<string>();
  const [completeIn, setCompleteIn] = useState<string[]>();
  const [county, setCounty] = useState<string>();
  const [inDemand, setInDemand] = useState<boolean>(false);
  const [languages, setLanguages] = useState<string[]>();
  const [maxCost, setMaxCost] = useState<number>();
  const [miles, setMiles] = useState<number>();
  const [socCode, setSocCode] = useState<string>();
  const [zipcode, setZipcode] = useState<string>();

  const comparisonState = useContext(ComparisonContext).state;
  const searchQuery = getSearchQuery(location?.search);

  usePageTitle(pageTitle);

  const getTrainingData = (
    queryToSearch: string | null,
    pageNumber: number,
    itemsPerPage: number,
    sortBy: "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match",
    cipCode: string | undefined,
    completeIn: number[] | undefined,
    county: string | undefined,
    inDemand: string | undefined,
    languages: string[] | undefined,
    maxCost: number | undefined,
    miles: number | undefined,
    socCode: string | undefined,
    zipcode: string | undefined,
  ): void => {  
    if (queryToSearch && queryToSearch !== null) {
      client.getTrainingsByQuery(
        queryToSearch,
        {
          onSuccess: ({ data, meta }: TrainingData) => {
            setTrainings(data);
            setMetaData(meta);
            getPageTitle(setPageTitle, searchQuery);
            setIsLoading(false);
          },
          onError: () => {
            console.log("ERR")
            setIsError(true);
            setIsLoading(false);
          },
        },
        pageNumber,
        itemsPerPage,
        sortBy,
        cipCode,
        completeIn,
        county,
        inDemand,
        languages,
        maxCost,
        miles,
        socCode,
        zipcode,
      );
    } else {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("p");
    const limit = urlParams.get("limit");
    const cipCodeValue = urlParams.get("cip");
    const completeInValue = urlParams.get("completeIn");
    const countyValue = urlParams.get("county");
    const inDemandValue = urlParams.get("inDemand");
    const languagesValue = urlParams.get("languages");
    const maxCostValue = urlParams.get("maxCost");
    const milesValue = urlParams.get("miles");
    const socCodeValue = urlParams.get("soc");
    const zipcodeValue = urlParams.get("zipcode");
    
    setIsLoading(true)
    setPageNumber(page ? parseInt(page) : 1);
    setItemsPerPage(limit ? parseInt(limit) : 10);

    const queryToSearch = searchQuery ? searchQuery : "";

    let cipCode, county, inDemand, languages, maxCost, miles, socCode, zipcode;
    const completeInArray:number[] = [];

    if (cipCodeValue) {
      const numOnly = cipCodeValue.replace(/\D/g,'');
      setCipCode(numOnly);
      cipCode = numOnly;
    }

    if (completeInValue) {
      const completeValues = completeInValue.includes("," || "%2C") ? completeInValue.split("," || "%2C") : [completeInValue];
      setCompleteIn(completeValues);
      completeValues.map((value) => {
        switch(value) {
          case "days":
            completeInArray.push(1, 2, 3);
            break;
          case "weeks":
            completeInArray.push(4,5);
            break;
          case "months":
            completeInArray.push(6, 7);
            break;
          case "years":
            completeInArray.push(8, 9, 10);
            break;
        }
      });
    }

    if (countyValue) {
      setCounty(countyValue);
      county = countyValue;
    }

    if (inDemandValue) {
      setInDemand(inDemandValue === "true");
      inDemand = inDemandValue;
    }

    if (languagesValue) {
      const langArray = languagesValue.includes("," || "%2C") ? languagesValue.split("," || "%2C") : [languagesValue];
      setLanguages(langArray);
      languages = langArray;
    }

    if (maxCostValue) {
      setMaxCost(parseInt(maxCostValue));
      maxCost = parseInt(maxCostValue);
    }
    
    if (milesValue) {
      setMiles(parseInt(milesValue))
      miles = parseInt(milesValue);
    };

    if (socCodeValue) {
      setSocCode(socCodeValue);
      socCode = socCodeValue.replace(/\D/g,'');
    }
    
    if (zipcodeValue) {
      setZipcode(zipcodeValue);
      zipcode = zipcodeValue;
    }

    if (pageNumber) {
      getTrainingData(
        queryToSearch,
        pageNumber,
        itemsPerPage,
        sortBy,
        cipCode,
        completeInArray,
        county,
        inDemand,
        languages,
        maxCost,
        miles,
        socCode,
        zipcode
      );
    }
  }, [searchQuery, client, pageNumber, itemsPerPage, sortBy]);
  
  const handleLimitChange = (event: ChangeEvent<{ value: string }>): void => {
    setIsLoading(true);
    setItemsPerPage(
      event.target.value as unknown as number,
    );
  };
  
  const handleSortChange = (event: ChangeEvent<{ value: unknown }>): void => {
    const newSortOrder = event.target.value as "asc" | "desc" | "price_asc"  | "price_desc" | "EMPLOYMENT_RATE" | "best_match";
    setSortBy(newSortOrder);
    logEvent("Search", "Updated sort", newSortOrder);
  };

  return (
    <Layout
      noFooter
      client={client}
      seo={{
        title: pageTitle,
        url: location?.pathname || "/training/search",
        image: pageImage,
      }}
    >
      <div id="search-results-page" className="container">
        <Breadcrumbs />
        <div id="search-results-filters">
          <div id="results-heading">
            <div className="results-count">
              {!isLoading && (
                <ResultsHeader
                  searchQuery={searchQuery || ""}
                  metaCount={metaData?.totalItems || 0}
                />
              )}
            </div>
            <div>
              {!isLoading
                && !isError
                && trainings.length > 0
                && (
                  <SearchSelects
                    handleSortChange={handleSortChange}
                    handleLimitChange={handleLimitChange}
                    itemsPerPage={10}
                    sortBy={sortBy}
                  />
              )}
            </div>
          </div>
          {!isLoading
            && (
            <FilterDrawer
              searchQuery={searchQuery || ""}
              cipCode={cipCode}
              completeIn={completeIn}
              county={county}
              inDemand={inDemand}
              languages={languages}
              maxCost={maxCost}
              miles={miles}
              socCode={socCode}
              zipcode={zipcode}
            />
          )}
        </div>
        <div id="results-container">
          {isLoading && (
            <div className="fdr fjc ptl">
              <CircularProgress color="secondary" />
            </div>
          )}
          {isError && (
            <ErrorBlock
              headerText="Could not load search results"
            >
              <p>
                Try reloading the page or searching again. If problem persists, please try again later.
              </p>
            </ErrorBlock>
          )}
          {!isLoading
            && !isError
            && trainings.length <= 5
            && (
              <SearchTips />
          )}
          {!isLoading
            && !isError
            && trainings.length > 0
            && (
            <div id="results-list">
              {trainings.map((training) => (
                <TrainingResultCard
                  key={training.id}
                  trainingResult={training}
                  comparisonItems={comparisonState.comparison}
                />
              ))}
              {!isLoading
                && trainings.length > 0
                && pageNumber
                && (
                <Pagination
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  currentPage={pageNumber || 1}
                  totalPages={metaData?.totalPages || 0}
                  hasPreviousPage={metaData?.hasPreviousPage || false}
                  hasNextPage={metaData?.hasNextPage || false}
                  setPageNumber={setPageNumber}
                />
              )}
            </div>
          )}
        </div>
        {!isLoading && (
          <TrainingComparison comparisonItems={comparisonState.comparison} />
        )}
      </div>
  </Layout>
  );
};