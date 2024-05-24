import {
  ChangeEvent,
  ReactElement,
  useContext,
  useEffect,
  useState
} from "react";
// import { useTranslation } from "react-i18next";
import { WindowLocation } from "@reach/router";
import { RouteComponentProps } from "@reach/router";

import { CircularProgress } from "@material-ui/core";

import { logEvent } from "../analytics";
import { ComparisonContext } from "../comparison/ComparisonContext";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { TrainingResult, TrainingData } from "../domain/Training";
import { SomethingWentWrongPage } from "../error/SomethingWentWrongPage";
import { usePageTitle } from "../utils/usePageTitle";

import { Breadcrumbs } from "./Breadcrumbs";
import { FilterDrawer } from "../filtering/FilterDrawer";
import { ResultsCount } from "./ResultsCount";
import { SearchSelects } from "./SearchSelects";
import { TrainingComparison } from "./TrainingComparison";
import { TrainingResultCard } from "./TrainingResultCard";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

export const SearchResultsPage = ({ client, location }: Props) : ReactElement<Props> => {
  // const { t } = useTranslation();

  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [metaCount, setMetaCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageTitle, setPageTitle] = useState<string>(
    `Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
  );
  const [sortBy, setSortBy] = useState<"asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match" | undefined>();
  const [trainings, setTrainings] = useState<TrainingResult[]>([]);
  const [miles, setMiles] = useState<string | undefined>();
  const [zipCode, setZipCode] = useState<string | undefined>();

  const comparisonState = useContext(ComparisonContext).state;

  const searchString = location?.search;
  const regex = /(?<=\?q=).*?(?=&|$)/;

  const searchQuery = `${searchString?.match(regex)}`;

  usePageTitle(pageTitle);

  const getPageTitle = (): void => {
    if (!searchQuery || searchQuery === "null") {
      setPageTitle(`Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`);
    } else {
      const query = decodeURIComponent(searchQuery.replace(/\+/g, " ")).toLocaleLowerCase();
      setPageTitle(
        `${query} | Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
      );
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location?.search);

    setIsLoading(true);

    urlParams.forEach((value, key) => {
      switch (key) {
        case "limit":
          setItemsPerPage(Number(value));
          break;
        case "miles":
          setMiles(value);
          break;
        case "p":
          setPageNumber(Number(value));
          break;
        case "sort":
          setSortBy(value as "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match");
          break;
        case "zipCode":
          setZipCode(value);
          break;
        default:
          break;
      }
    })

    if (pageNumber) {
      const queryToSearch = searchQuery || "";

      if (queryToSearch && queryToSearch !== "null") {
        client.getTrainingsByQuery(
          queryToSearch,
          {
            onSuccess: ({ data, meta }: TrainingData) => {
              setTrainings(data);
              setMetaCount(meta.totalItems);
              getPageTitle();
              setIsLoading(false);
            },
            onError: () => {
              setIsError(true);
            },
          },
          pageNumber,
          itemsPerPage,
          sortBy,
        );
      }
    }
  }, [
    location?.pathname,
    location?.search,
    pageNumber,
    itemsPerPage,
    sortBy
  ]);

  if (isError) {
    return <SomethingWentWrongPage client={client} />;
  }

  const handleSortChange = (event: ChangeEvent<{ value: unknown }>): void => {
    const newSortOrder = event.target.value as "asc" | "desc" | "price_asc"  | "price_desc" | "EMPLOYMENT_RATE" | "best_match";
    setSortBy(newSortOrder);
    logEvent("Search", "Updated sort", newSortOrder);
  }

  const handleLimitChange = (event: ChangeEvent<{ value: string }>): void => {
    setIsLoading(true);
    setItemsPerPage(
      event.target.value as unknown as number,
    );
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("p", "1");
    newUrl.searchParams.set("limit", event.target.value);
    window.history.pushState({}, "", newUrl.toString());
  }

  return (
    <Layout
      noFooter
      client={client}
      seo={{
        title: pageTitle,
        url: location?.pathname
      }}
    >
      <div id="search-results-page">
        <div className="container">
          <div className="results-count-container">
            <Breadcrumbs />
            <div className="results-count-selects-container">
              <div>
                {!isLoading && (
                  <ResultsCount
                    searchQuery={searchQuery}
                    metaCount={metaCount}
                  />
                )}
              </div>
              <SearchSelects
                handleSortChange={handleSortChange}
                handleLimitChange={handleLimitChange}
                itemsPerPage={itemsPerPage}
                sortBy={sortBy}
              />
            </div>
            {!isLoading && (
              <FilterDrawer
                searchQuery={searchQuery}
                miles={miles}
                zipCode={zipCode}
              />
            )}
            <div>
              {isLoading ? (
                <div className="fdr fjc ptl">
                  <CircularProgress color="secondary" />
                </div>
              ) : (
                <div>
                  {trainings.map((training) => (
                    <TrainingResultCard
                      key={training.id}
                      trainingResult={training}
                      comparisonItems={comparisonState.comparison}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {!isLoading && (
          <TrainingComparison comparisonItems={comparisonState.comparison} />
        )}
      </div>
    </Layout>
  )
};