import { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { WindowLocation } from "@reach/router";
import { RouteComponentProps } from "@reach/router";
import { CircularProgress } from "@material-ui/core";
import { ArrowLeft } from "@phosphor-icons/react";

import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { TrainingResult, TrainingData } from "../domain/Training";
import { usePageTitle } from "../utils/usePageTitle";

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
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageTitle, setPageTitle] = useState<string>(
    `Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
  );
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

  const getResultCount = (): ReactElement => {
    let message;

    if (!searchQuery || searchQuery === "null") {
      message = t("SearchResultsPage.noSearchTermHeader");
    } else {
      const query = decodeURIComponent(searchQuery.replace(/\+/g, " "));
      message = t("SearchResultsPage.resultsString", {
        count: metaData?.totalItems,
        query,
      });
    }

    return <h2 className="text-xl weight-500 pts mbs cutoff-text">{message}</h2>;
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location?.search);
    const limit = urlParams.get("limit") || "10";
    const miles = urlParams.get("miles") || undefined;
    const page = urlParams.get("p") || "1";
    const sortBy = urlParams.get("sortBy") || "best_match";
    const zip = urlParams.get("zip") || undefined;

    setIsLoading(true);

    if (limit) {
      setItemsPerPage(parseInt(limit));
    }

    if (page) {
      setPageNumber(parseInt(page));
    }

    if (pageNumber) {
      console.log(searchQuery)
      const queryToSearch = searchQuery || "";

      if (queryToSearch && queryToSearch !== "null") {
        client.getTrainingsByQuery(
          queryToSearch,
          {
            onSuccess: ({ data, meta }: TrainingData) => {
              setTrainings(data);
              setMetaData(meta);
              getPageTitle();
              setIsLoading(false);
            },
            onError: () => {
              setIsError(true);
            },
          },
          pageNumber,
          itemsPerPage,
          sortBy as "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match" | undefined,
          zip,
          miles,
        );
      }
    }

    console.log(trainings, metaData)
  }, [location?.pathname]);

  useEffect(() => {
    console.log(trainings)
  }, [trainings]);

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
          <nav className="usa-breadcrumb" aria-label="Breadcrumbs">
            <ol className="usa-breadcrumb__list">
              <li className="usa-breadcrumb__list-item">
                <a className="usa-breadcrumb__link" href="/">
                  Home
                </a>
              </li>
              <li className="usa-breadcrumb__list-item">
                <a className="usa-breadcrumb__link" href="/training">
                  Training Explorer
                </a>
              </li>
              <li className="usa-breadcrumb__list-item use-current" aria-current="page">
                <span data-testid="title">Advanced Search</span>
              </li>
            </ol>
            <a className="back-link" href="/training">
              <ArrowLeft size={24} />
              Back
            </a>
          </nav>


          <div className="row fixed-wrapper">
            <div className="col-md-12 fdr fac">
              <div className="result-count-text">
                {!isLoading && getResultCount()}
              </div>
            </div>
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
              <p>Results will go here</p>
            </div>
          
          )}
        </div>
      </div>
    </Layout>
  )
};