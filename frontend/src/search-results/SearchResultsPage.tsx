import { ReactElement, useState } from "react";
import { WindowLocation } from "@reach/router";
import { RouteComponentProps } from "@reach/router";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "@phosphor-icons/react";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { usePageTitle } from "../utils/usePageTitle";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

const PageNumbers = [10, 25, 50, 100];

export const SearchResultsPage = ({ client, location }: Props): ReactElement => {
  const { t } = useTranslation();

  const [itemsPerPage, setItemsPerPage] = useState<number>(PageNumbers[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageTitle, setPageTitle] = useState<string>(
    `Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
  );

  usePageTitle(pageTitle);

  const handleResultsPerPageChange = (event: SelectChangeEvent<number>) => {
    setItemsPerPage(event.target.value as number);
  }

  return (
    <Layout
      noFooter
      client={client}
      seo={{
        title: pageTitle,
        url: location?.pathname,
      }}
    >
      <div id="search-results-page" className="container results-count-container">
        <div>
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
              <ArrowLeft size={24} /> Back
            </a>
          </nav>
        </div>

        <div className="row sorting-controls">
          <div className="input-wrapper per-page-wrapper">
            <InputLabel id="results-per-page">Results per page</InputLabel>
            <Select
              labelId="results-per-page"
              id="select-results-per-page"
              value={itemsPerPage}
              label="Results per page"
              onChange={handleResultsPerPageChange}
            >
              {PageNumbers.map((number) => (
                <MenuItem key={number} value={number}>
                  {number}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
        Search Results
      </div>
    </Layout>
  )
};
