import { ReactElement } from "react";
import { RouteComponentProps, WindowLocation } from "@reach/router";

import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import pageImage from "../images/ogImages/searchResults.png";

import { Breadcrumbs } from "./Breadcrumbs";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

export const SearchResultsPage = ({
  client,
  location
}: Props): ReactElement<Props> => {

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
      </div>
    </Layout>
  );
};