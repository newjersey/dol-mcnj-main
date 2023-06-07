import { ReactElement, useReducer, useState } from "react";
import { LandingPage } from "./landing-page/LandingPage";
import { SearchResultsPage } from "./search-results/SearchResultsPage";
import { TrainingPage } from "./training-page/TrainingPage";
import { OccupationPage } from "./occupation-page/OccupationPage";
import { PrivacyPolicyPage } from "./privacy-policy-page/PrivacyPolicyPage";
import { TermsOfServicePage } from "./terms-of-service-page/TermsOfServicePage";
import { FaqPage } from "./faq-page/FaqPage";
import { TrainingProviderPage } from "./training-provider-page/TrainingProviderPage";
import { Client } from "./domain/Client";
import { Router, globalHistory } from "@reach/router";
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
import {
  initialComparisonState,
  ComparisonReducer,
  comparisonReducer,
  ComparisonContext,
} from "./comparison/ComparisonContext";
import { LandingPageCounselor } from "./landing-page/LandingPageCounselor";
import { LandingPageExplorer } from "./landing-page/LandingPageExplorer";
import { EtplPage } from "./etpl-page/EtplPage";
import { FaqRoutes } from "./faqs/FaqRoutes";
import {
  ContextualInfo,
  ContextualInfoContext,
  initialContextualInfoState,
} from "./contextual-info/ContextualInfoContext";
import { ContextualInfoPanel } from "./components/ContextualInfoPanel";
import "@newjersey/njwds/dist/css/styles.css";
import { LanguageSwitchButton } from "./components/LanguageSwitchButton";
import { FinancialPage } from "./financial-page/FinancialPage";
import { CareerPathwaysPage } from "./career-pathways-page/CareerPathwaysPage";
import { TrainingExplorerPage } from "./training-explorer-page/TrainingExplorerPage";

interface Props {
  client: Client;
}

// Logs each Reach Router page as a separate pageview on Google Analytics
// eslint-disable-next-line
declare const window: any;
const GA_TRACKING_ID = "UA-140253594-9";
globalHistory.listen(({ location }) => {
  if (typeof window.gtag === "function") {
    window.gtag("config", GA_TRACKING_ID, { page_path: location.pathname });
  }
});

export const App = (props: Props): ReactElement => {
  const [sortState, sortDispatch] = useReducer<SortReducer>(sortReducer, initialSortState);
  const [filterState, filterDispatch] = useReducer<FilterReducer>(
    filterReducer,
    initialFilterState
  );
  const [comparisonState, comparisonDispatch] = useReducer<ComparisonReducer>(
    comparisonReducer,
    initialComparisonState
  );
  const [contextualInfo, setContextualInfo] = useState<ContextualInfo>(initialContextualInfoState);

  return (
    <ComparisonContext.Provider value={{ state: comparisonState, dispatch: comparisonDispatch }}>
      <SortContext.Provider value={{ state: sortState, dispatch: sortDispatch }}>
        <FilterContext.Provider value={{ state: filterState, dispatch: filterDispatch }}>
          <ContextualInfoContext.Provider value={{ contextualInfo, setContextualInfo }}>
            <Router>
              <LandingPage path="/" client={props.client} />
              <TrainingExplorerPage path="/training-explorer" client={props.client} />
              <LandingPageCounselor path="/counselor" client={props.client} />
              <LandingPageExplorer path="/explorer" client={props.client} />
              {FaqRoutes({ client: props.client })}
              <SearchResultsPage path="/search" client={props.client} />
              <SearchResultsPage path="/search/:searchQuery" client={props.client} />
              <TrainingPage path="/training/:id" client={props.client} />
              <InDemandOccupationsPage path="/in-demand-occupations" client={props.client} />
              <OccupationPage path="/occupation/:soc" client={props.client} />
              <FinancialPage path="/tuition-assistance" client={props.client} />
              <CareerPathwaysPage path="/career-pathways" client={props.client} />
              <CareerPathwaysPage path="/career-pathways/:slug" client={props.client} />
              <FundingPage path="/funding" client={props.client} />
              <PrivacyPolicyPage path="/privacy-policy" client={props.client} />
              <TermsOfServicePage path="/terms-of-service" client={props.client} />
              <FaqPage path="/faq" client={props.client} />
              <TrainingProviderPage path="/training-provider-resources" client={props.client} />
              <EtplPage path="/etpl" client={props.client} />
              <NotFoundPage default client={props.client} />
            </Router>
            <LanguageSwitchButton />
            <ContextualInfoPanel />
          </ContextualInfoContext.Provider>
        </FilterContext.Provider>
      </SortContext.Provider>
    </ComparisonContext.Provider>
  );
};
