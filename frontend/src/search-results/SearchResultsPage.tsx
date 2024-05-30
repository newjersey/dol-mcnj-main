import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps, WindowLocation } from "@reach/router";

import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import pageImage from "../images/ogImages/searchResults.png";
import { usePageTitle } from "../utils/usePageTitle";

import { Breadcrumbs } from "./Breadcrumbs";
import { ResultsHeader } from "./ResultsHeader";

import { getPageTitle, getSearchQuery } from "./searchResultFunctions";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

export const SearchResultsPage = ({ client, location }: Props): ReactElement<Props> => {
  const [pageTitle, setPageTitle] = useState<string>(
    `Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
  );

  const searchQuery = getSearchQuery(location?.search);

  usePageTitle(pageTitle);

  useEffect(() => {
    getPageTitle(setPageTitle, searchQuery);
  }, [searchQuery]);

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
            <ResultsHeader
              searchQuery={searchQuery || ""}
              metaCount={0}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};