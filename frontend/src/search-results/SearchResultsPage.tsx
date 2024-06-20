import {
  ChangeEvent,
  ReactElement,
  useState
} from "react";
import { RouteComponentProps, WindowLocation } from "@reach/router";

import { logEvent } from "../analytics";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { TrainingData } from "../domain/Training";
import pageImage from "../images/ogImages/searchResults.png";

import { Breadcrumbs } from "./Breadcrumbs";
import { ResultsHeader } from "./ResultsHeader";
import { SearchSelects } from "./SearchSelects";

import { FilterDrawer } from "../filtering/FilterDrawer";

import { getSearchQuery } from "./searchResultFunctions";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

export const SearchResultsPage = ({
  client,
  location
}: Props): ReactElement<Props> => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [metaData, setMetaData] = useState<TrainingData["meta"]>();
  const [sortBy, setSortBy] = useState<"asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match">("best_match");
  
  const searchQuery = getSearchQuery(location?.search);


  
  const handleLimitChange = (event: ChangeEvent<{ value: string }>): void => {
    setLoading(true);
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
              searchQuery={searchQuery || ""}
              metaCount={metaData?.totalItems || 0}
            />
            <SearchSelects
              handleSortChange={handleSortChange}
              handleLimitChange={handleLimitChange}
              itemsPerPage={itemsPerPage}
              sortBy={sortBy}
            />
          </div>
          {!loading && (
            <FilterDrawer />
          )}
        </div>
      </div>
    </Layout>
  );
};