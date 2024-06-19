import {
  ReactElement,
  useState
} from "react";
import { RouteComponentProps, WindowLocation } from "@reach/router";

import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { TrainingData } from "../domain/Training";
import pageImage from "../images/ogImages/searchResults.png";

import { Breadcrumbs } from "./Breadcrumbs";
import { ResultsHeader } from "./ResultsHeader";
import { getSearchQuery } from "./searchResultFunctions";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

export const SearchResultsPage = ({
  client,
  location
}: Props): ReactElement<Props> => {
  const [metaData, setMetaData] = useState<TrainingData["meta"]>();
  
  const searchQuery = getSearchQuery(location?.search);

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
        <div id="search-results-heading">
          <ResultsHeader searchQuery={searchQuery || ""}
                  metaCount={metaData?.totalItems || 0} />
        </div>
      </div>
    </Layout>
  );
};