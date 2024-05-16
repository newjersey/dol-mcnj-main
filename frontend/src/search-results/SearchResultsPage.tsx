import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { WindowLocation } from "@reach/router";
import { RouteComponentProps } from "@reach/router";

import { CircularProgress } from "@material-ui/core";

import { logEvent } from "../analytics";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { TrainingResult, TrainingData } from "../domain/Training";
import { SomethingWentWrongPage } from "../error/SomethingWentWrongPage";
import { usePageTitle } from "../utils/usePageTitle";

import { Breadcrumbs } from "./Breadcrumbs";
import { ResultsCount } from "./ResultsCount";
import { TrainingResultCard } from "./TrainingResultCard";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

export const SearchResultsPage = ({ client, location }: Props) : ReactElement<Props> => {
  const { t } = useTranslation();

  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [metaData, setMetaData] = useState<TrainingData["meta"]>();
  const [metaCount, setMetaCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageTitle, setPageTitle] = useState<string>(
    `Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
  );
  const [sortBy, setSortBy] = useState<"asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match" | undefined>();
  const [trainings, setTrainings] = useState<TrainingResult[]>([]);

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
    const limit = urlParams.get("limit") || "10";
    const miles = urlParams.get("miles") || undefined;
    const page = urlParams.get("p");
    const zip = urlParams.get("zip") || undefined;

    setIsLoading(true);

    if (limit) {
      setItemsPerPage(parseInt(limit));
    }

    if (page) {
      setPageNumber(parseInt(page));
    } else {
      setPageNumber(1);
    }

    if (pageNumber) {
      const queryToSearch = searchQuery || "";

      if (queryToSearch && queryToSearch !== "null") {
        client.getTrainingsByQuery(
          queryToSearch,
          {
            onSuccess: ({ data, meta }: TrainingData) => {
              setTrainings(data);
              setMetaData(meta);
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
          zip,
          miles,
        );
      }
    }

    console.log(trainings, metaData)
  }, [location?.pathname, pageNumber, itemsPerPage, sortBy]);

  if (isError) {
    return <SomethingWentWrongPage client={client} />;
  }

  const handleSortChange = (event: ChangeEvent<{ value: unknown }>): void => {
    const newSortOrder = event.target.value as "asc" | "desc" | "price_asc"  | "price_desc" | "EMPLOYMENT_RATE" | "best_match";
    setSortBy(newSortOrder);
    logEvent("Search", "Updated sort", newSortOrder);
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
      <div id="search-results-page" className="container">
        <div className="results-count-container">
          <Breadcrumbs />

          <div className="results-container">
            <div className="row fixed-wrapper">
              <div className="col-md-12 fdr fac">
                <div className="result-count-text">
                  {!isLoading && (
                    <ResultsCount
                      searchQuery={searchQuery}
                      metaCount={metaCount}
                    />
                  )}
                </div>
              </div>
            </div>
            <div>
              {trainings.length > 0 && (
                <div className="input-wrapper sorting-wrapper">
                  <label className="usa-label" htmlFor="per-page">
                    {t("SearchAndFilter.sortByLabel")}
                  </label>

                  <select
                    className="usa-select"
                    name="per-page"
                    id="per-page"
                    onChange={handleSortChange}
                  >
                    <option value="best_match">{t("SearchAndFilter.sortByBestMatch")}</option>
                    <option value="asc">A to Z</option>
                    <option value="desc">Z to A</option>
                    <option value="price_asc">{t("SearchAndFilter.sortByCostLowToHigh")}</option>
                    <option value="price_desc">{t("SearchAndFilter.sortByCostHighToLow")}</option>
                    <option value="EMPLOYMENT_RATE">{t("SearchAndFilter.sortByEmploymentRate")}</option>
                  </select>
                </div>
              )}
            </div>
            <div>
            {trainings.length > 0 && (
              <div className="input-wrapper per-page-wrapper">
                <label className="usa-label" htmlFor="per-page">
                  Results per page
                </label>

                <select
                  className="usa-select"
                  name="per-page"
                  defaultValue={itemsPerPage}
                  id="per-page"
                  onChange={(e) => {
                    setIsLoading(true);
                    setItemsPerPage(
                      e.target.options[e.target.selectedIndex].value as unknown as number,
                    );
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set("p", "1");
                    newUrl.searchParams.set("limit", e.target.value);
                    window.history.pushState({}, "", newUrl.toString());
                  }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            )}
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="fdr fjc ptl">
                <CircularProgress color="secondary" />
              </div>
            ) : (
              <div>
                <h1>Search Results</h1>
                {trainings.map((training) => (
                  <TrainingResultCard
                    key={training.id}
                    trainingResult={training}
                    // comparisonItems={comparisonState.comparison}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
};