import React, { ReactElement, useReducer } from "react";
import { LandingPage } from "./landing-page/LandingPage";
import { SearchResultsPage } from "./search-results/SearchResultsPage";
import { TrainingPage } from "./training-page/TrainingPage";
import { OccupationPage } from "./occupation-page/OccupationPage";
import { PrivacyPolicyPage } from "./privacy-policy-page/PrivacyPolicyPage";
import { TermsOfServicePage } from "./terms-of-service-page/TermsOfServicePage";
import { Client } from "./domain/Client";
import { Router } from "@reach/router";
import { NotFoundPage } from "./error/NotFoundPage";
import { InDemandOccupationsPage } from "./in-demand-occupations-page/InDemandOccupationsPage";
import { FundingPage } from "./funding-page/FundingPage";
import {
  initialFilterState,
  FilterReducer,
  filterReducer,
  FilterContext,
} from "./filtering/FilterContext";
import { SortReducer, sortReducer, initialSortState, SortContext } from "./sorting/SortContext";

interface Props {
  client: Client;
}

export const App = (props: Props): ReactElement => {
  const [sortState, sortDispatch] = useReducer<SortReducer>(sortReducer, initialSortState);
  const [filterState, filterDispatch] = useReducer<FilterReducer>(
    filterReducer,
    initialFilterState
  );

  return (
    <SortContext.Provider value={{ state: sortState, dispatch: sortDispatch }}>
      <FilterContext.Provider value={{ state: filterState, dispatch: filterDispatch }}>
        <Router>
          <LandingPage path="/" />
          <SearchResultsPage path="/search" client={props.client} />
          <SearchResultsPage path="/search/:searchQuery" client={props.client} />
          <TrainingPage path="/training/:id" client={props.client} />
          <InDemandOccupationsPage path="/in-demand-occupations" client={props.client} />
          <OccupationPage path="/occupation/:soc" client={props.client} />
          <FundingPage path="/funding" />
          <PrivacyPolicyPage path="/privacy-policy" />
          <TermsOfServicePage path="/terms-of-service" />
          <NotFoundPage default />
        </Router>
      </FilterContext.Provider>
    </SortContext.Provider>
  );
};
