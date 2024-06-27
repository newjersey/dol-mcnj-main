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
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { TrainingData, TrainingResult } from "../domain/Training";
import pageImage from "../images/ogImages/searchResults.png";

import { Breadcrumbs } from "./Breadcrumbs";
import { Pagination } from "./Pagination";
import { ResultsHeader } from "./ResultsHeader";
import { TrainingComparison } from "./TrainingComparison";
import { TrainingResultCard } from "./TrainingResultCard";
import { SearchSelects } from "./SearchSelects";
import { SearchTips } from "./SearchTips";

import { ComparisonContext } from "../comparison/ComparisonContext";
import { FilterDrawer } from "../filtering/FilterDrawer";
import { CountyProps, LanguageProps } from "../filtering/filterLists";

import { getTrainingData, getSearchQuery } from "./searchFunctions";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

export const SearchResultsPage = ({
  client,
  location
}: Props): ReactElement<Props> => {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [metaData, setMetaData] = useState<TrainingData["meta"]>();

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>();
  const [sortBy, setSortBy] = useState<"asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match">("best_match");
  const [trainings, setTrainings] = useState<TrainingResult[]>([]);

  const [cipCode, setCipCode] = useState<string | undefined>(undefined);
  const [classFormat, setClassFormat] = useState<string[]>([]);
  const [completeIn, setCompleteIn] = useState<string[]>([]);
  const [county, setCounty] = useState<CountyProps | undefined>(undefined);
  const [inDemand, setInDemand] = useState<boolean>(false);
  const [languages, setLanguages] = useState<LanguageProps[]>([]);
  const [maxCost, setMaxCost] = useState<string | undefined>(undefined);
  const [miles, setMiles] = useState<string | undefined>(undefined);
  const [services, setServices] = useState<string[]>([]);
  const [socCode, setSocCode] = useState<string | undefined>(undefined);
  const [zipcode, setZipcode] = useState<string | undefined>(undefined);
  
  const comparisonState = useContext(ComparisonContext).state;
  const searchQuery = getSearchQuery(location?.search);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("p");
    const limit = urlParams.get("limit");
    const cipCodeValue = urlParams.get("cip");
    const classFormatValue = urlParams.get("format");
    const completeInValue = urlParams.get("completeIn");
    const countyValue = urlParams.get("county");
    const inDemandValue = urlParams.get("inDemand");
    const languagesValue = urlParams.get("languages");
    const maxCostValue = urlParams.get("maxCost");
    const milesValue = urlParams.get("miles");
    const servicesValue = urlParams.get("services");
    const socCodeValue = urlParams.get("soc");
    const zipcodeValue = urlParams.get("zipcode");

    const completeInArray:number[] = [];
    const limitValue = limit ? parseInt(limit) : 10;
    const pageNumberValue = page ? parseInt(page) : 1;

    setIsLoading(true);
    setPageNumber(pageNumberValue);
    setItemsPerPage(limitValue);

    if (cipCodeValue) {
      setCipCode(cipCodeValue);
    }

    if (classFormatValue) {
      const classFormatArray = classFormatValue.includes("," || "%2C") ? classFormatValue.split("," || "%2C") : [classFormatValue];
      setClassFormat(classFormatArray);
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
        return console.log('Organize completeIn times');
      });
    }

    if (countyValue) {
      setCounty(countyValue as CountyProps);
    }

    if (inDemandValue) {
      const inDemandText = inDemandValue.toLowerCase();
      setInDemand(inDemandText === "true");
    }

    if (languagesValue) {
      const languagesArray = languagesValue.includes("," || "%2C") ? languagesValue.split("," || "%2C") : [languagesValue];
      setLanguages(languagesArray as LanguageProps[]);
    }

    if (maxCostValue) {
      setMaxCost(maxCostValue);
    }

    if (milesValue) {
      setMiles(milesValue);
    }

    if (servicesValue) {
      const servicesArray = servicesValue.includes("," || "%2C") ? servicesValue.split("," || "%2C") : [servicesValue];
      setServices(servicesArray);
    }

    if (socCodeValue) {
      setSocCode(socCodeValue);
    }

    if (zipcodeValue) {
      setZipcode(zipcodeValue);
    }

    const queryToSearch = searchQuery ? searchQuery : "";
    getTrainingData(client,
                    queryToSearch,
                    setIsError,
                    setIsLoading,
                    setMetaData,
                    setTrainings);
  }, [client, searchQuery]);
  
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
        title: `Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
        url: location?.pathname || "/training/search",
        image: pageImage,
      }}
    >
      <div id="search-results-page" className="container">
        <Breadcrumbs />
        <div>
          <div id="search-results-heading">
            <ResultsHeader
              loading={isLoading}
              searchQuery={searchQuery || ""}
              metaCount={metaData?.totalItems || 0}
            />
            {!isLoading && trainings.length > 0 && (
              <SearchSelects
                handleSortChange={handleSortChange}
                handleLimitChange={handleLimitChange}
                itemsPerPage={itemsPerPage}
                sortBy={sortBy}
              />
            )}
          </div>
          {!isLoading && (
            <FilterDrawer
              searchQuery={searchQuery}
              cipCode={cipCode}
              classFormat={classFormat}
              completeIn={completeIn}
              county={county || ""}
              inDemand={inDemand}
              languages={languages}
              maxCost={maxCost}
              miles={miles}
              services={services}
              socCode={socCode || ""}
              zipcode={zipcode || ""}
            />
          )}
        </div>
        <div id="results-container">
          {isLoading && (
            <div className="fdr fjc ptl">
              <CircularProgress color="secondary" />
            </div>
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
                  key={training.ctid}
                  trainingResult={training}
                  comparisonItems={comparisonState.comparison}
                />
              ))}
              {pageNumber
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
          {!isLoading && (
            <TrainingComparison comparisonItems={comparisonState.comparison} />
          )}
        </div>
      </div>
    </Layout>
  );
};
