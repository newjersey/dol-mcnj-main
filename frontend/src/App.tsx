import { ReactElement, useEffect, useReducer, useState } from "react";
import { SearchResultsPage } from "./search-results/SearchResultsPage";
import { TrainingPage } from "./training-page/TrainingPage";
import { OccupationPage } from "./occupation-page/OccupationPage";
import { PrivacyPolicyPage } from "./privacy-policy-page/PrivacyPolicyPage";
import { TermsOfServicePage } from "./terms-of-service-page/TermsOfServicePage";
import { FaqPage } from "./faq-page/FaqPage";
import { TrainingProviderPage } from "./training-provider-page/TrainingProviderPage";
import { Client } from "./domain/Client";
import { Router, Redirect, globalHistory } from "@reach/router";
import { NotFoundPage } from "./error/NotFoundPage";
import { InDemandOccupationsPage } from "./in-demand-occupations-page/InDemandOccupationsPage";
import ReactGA from "react-ga";
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
import { FaqRoutes } from "./faqs/FaqRoutes";
import {
  ContextualInfo,
  ContextualInfoContext,
  initialContextualInfoState,
} from "./contextual-info/ContextualInfoContext";
import { ContextualInfoPanel } from "./components/ContextualInfoPanel";
import { LanguageSwitchButton } from "./components/LanguageSwitchButton";
import { CareerPathwaysPage } from "./career-pathways-page/CareerPathwaysPage";
import { TrainingExplorerPage } from "./training-explorer-page/TrainingExplorerPage";
import * as Sentry from "@sentry/react";
import { AllSupportPage } from "./all-support-page/AllSupportPage";
import { ResourceCategoryPage } from "./resource-category-page/ResourceCategoryPage";
import { CareerNavigatorPage } from "./career-navigator-page/CareerNavigatorPage";
import { LandingPage } from "./landing-page/LandingPage";

interface Props {
  client: Client;
}

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

// Logs each Reach Router page as a separate pageview on Google Analytics
// eslint-disable-next-line
declare const window: any;
const GA_TRACKING_ID = "G-THV625FWWB";
globalHistory.listen(({ location }) => {
  if (typeof window.gtag === "function") {
    window.gtag("config", GA_TRACKING_ID, { page_path: location.pathname });
    ReactGA.initialize("G-THV625FWWB", {});
  }
});

export const App = (props: Props): ReactElement => {
  const [sortState, sortDispatch] = useReducer<SortReducer>(sortReducer, initialSortState);
  const [filterState, filterDispatch] = useReducer<FilterReducer>(
    filterReducer,
    initialFilterState,
  );
  const [comparisonState, comparisonDispatch] = useReducer<ComparisonReducer>(
    comparisonReducer,
    initialComparisonState,
  );
  const [contextualInfo, setContextualInfo] = useState<ContextualInfo>(initialContextualInfoState);

  useEffect(() => {
    ReactGA.initialize("G-THV625FWWB", { testMode: process.env.NODE_ENV === 'test' });
  }, []);

  return (
    <ComparisonContext.Provider value={{ state: comparisonState, dispatch: comparisonDispatch }}>
      <SortContext.Provider value={{ state: sortState, dispatch: sortDispatch }}>
        <FilterContext.Provider value={{ state: filterState, dispatch: filterDispatch }}>
          <ContextualInfoContext.Provider value={{ contextualInfo, setContextualInfo }}>
            <Router>
              <LandingPage path="/" client={props.client} />
              <TrainingExplorerPage path="/training" client={props.client} />
              {FaqRoutes({ client: props.client })}
              <SearchResultsPage path="/training/search" client={props.client} />
              <SearchResultsPage path="/training/search?q=:searchQuery" client={props.client} />
              <TrainingPage path="/training/:id" client={props.client} />
              <InDemandOccupationsPage path="/in-demand-occupations" client={props.client} />
              <OccupationPage path="/occupation/:soc" client={props.client} />
              <PrivacyPolicyPage path="/privacy-policy" client={props.client} />
              <TermsOfServicePage path="/terms-of-service" client={props.client} />
              <FaqPage path="/faq" client={props.client} />
              <TrainingProviderPage path="/training-provider-resources" client={props.client} />
              <AllSupportPage path="/support-resources" client={props.client} />
              <ResourceCategoryPage path="/support-resources/:slug" client={props.client} />
              <NotFoundPage default client={props.client} />

              <Redirect from="/search" to="/training/search" />
              <Redirect from="/search?q=:searchQuery" to="/training/search?q=:searchQuery" noThrow />
              <Redirect from="/etpl" to="/faq#etpl-program-general-information" />

              {process.env.REACT_APP_FEATURE_CAREER_NAVIGATOR === "true" && (
                  <CareerNavigatorPage path="/navigator" client={props.client} />
              )}
              {process.env.REACT_APP_FEATURE_CAREER_NAVIGATOR === "true" && (
                  <Redirect from="/career-navigator" to="/navigator" />
              )}
              {process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "true" && (
                  <CareerPathwaysPage path="/career-pathways" client={props.client} />
              )}
              {process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "true" && (
                  <CareerPathwaysPage path="/career-pathways/:slug" client={props.client} />
              )}
            </Router>
            {process.env.REACT_APP_FEATURE_MULTILANG === "true" && <LanguageSwitchButton />}
            <ContextualInfoPanel />
          </ContextualInfoContext.Provider>
        </FilterContext.Provider>
      </SortContext.Provider>
    </ComparisonContext.Provider>
  );
};
