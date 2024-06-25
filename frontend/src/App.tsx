import React, { ReactElement, useEffect, useReducer, useState, useMemo, Suspense } from "react";
import { Router, Redirect, globalHistory } from "@reach/router";
import ReactGA from "react-ga";
import * as Sentry from "@sentry/react";
import { Client } from "./domain/Client";

import {
  initialFilterState,
  filterReducer,
  FilterContext,
} from "./filtering/FilterContext";
import {
  sortReducer,
  initialSortState,
  SortContext,
} from "./sorting/SortContext";
import {
  initialComparisonState,
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


// Lazy load pages
const SearchResultsPage = React.lazy(() => import("./search-results/SearchResultsPage").then(module => ({ default: module.SearchResultsPage })));
const TrainingPage = React.lazy(() => import("./training-page/TrainingPage").then(module => ({ default: module.TrainingPage })));
const OccupationPage = React.lazy(() => import("./occupation-page/OccupationPage").then(module => ({ default: module.OccupationPage })));
const ContactUsPage = React.lazy(() => import("./contact-us-page/ContactUsPage").then(module => ({ default: module.ContactUsPage })));
const PrivacyPolicyPage = React.lazy(() => import("./privacy-policy-page/PrivacyPolicyPage").then(module => ({ default: module.PrivacyPolicyPage })));
const TermsOfServicePage = React.lazy(() => import("./terms-of-service-page/TermsOfServicePage").then(module => ({ default: module.TermsOfServicePage })));
const FaqPage = React.lazy(() => import("./faq-page/FaqPage").then(module => ({ default: module.FaqPage })));
const TrainingProviderPage = React.lazy(() => import("./training-provider-page/TrainingProviderPage").then(module => ({ default: module.TrainingProviderPage })));
const NotFoundPage = React.lazy(() => import("./error/NotFoundPage").then(module => ({ default: module.NotFoundPage })));
const InDemandOccupationsPage = React.lazy(() => import("./in-demand-occupations-page/InDemandOccupationsPage").then(module => ({ default: module.InDemandOccupationsPage })));
const CareerPathwaysPage = React.lazy(() => import("./career-pathways-page/CareerPathwaysPage").then(module => ({ default: module.CareerPathwaysPage })));
const TrainingExplorerPage = React.lazy(() => import("./training-explorer-page/TrainingExplorerPage").then(module => ({ default: module.TrainingExplorerPage })));
const AllSupportPage = React.lazy(() => import("./all-support-page/AllSupportPage").then(module => ({ default: module.AllSupportPage })));
const ResourceCategoryPage = React.lazy(() => import("./resource-category-page/ResourceCategoryPage").then(module => ({ default: module.ResourceCategoryPage })));
const LandingPage = React.lazy(() => import("./landing-page/LandingPage").then(module => ({ default: module.LandingPage })));


interface Props {
  client: Client;
}

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

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
  const [sortState, sortDispatch] = useReducer(sortReducer, initialSortState);
  const [filterState, filterDispatch] = useReducer(filterReducer, initialFilterState);
  const [comparisonState, comparisonDispatch] = useReducer(comparisonReducer, initialComparisonState);
  const [contextualInfo, setContextualInfo] = useState<ContextualInfo>(initialContextualInfoState);

  useEffect(() => {
    ReactGA.initialize("G-THV625FWWB", { testMode: process.env.NODE_ENV === 'test' });
  }, []);

  const sortContextValue = useMemo(() => ({ state: sortState, dispatch: sortDispatch }), [sortState]);
  const filterContextValue = useMemo(() => ({ state: filterState, dispatch: filterDispatch }), [filterState]);
  const comparisonContextValue = useMemo(() => ({ state: comparisonState, dispatch: comparisonDispatch }), [comparisonState]);
  const contextualInfoValue = useMemo(() => ({ contextualInfo, setContextualInfo }), [contextualInfo]);

  return (
      <ComparisonContext.Provider value={comparisonContextValue}>
        <SortContext.Provider value={sortContextValue}>
          <FilterContext.Provider value={filterContextValue}>
            <ContextualInfoContext.Provider value={contextualInfoValue}>
              <Suspense fallback={<div>Loading...</div>}>
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
                  <ContactUsPage path="/contact" client={props.client} />
                  <TrainingProviderPage path="/training-provider-resources" client={props.client} />
                  <AllSupportPage path="/support-resources" client={props.client} />
                  <ResourceCategoryPage path="/support-resources/:slug" client={props.client} />
                  <NotFoundPage default client={props.client} />

                  <Redirect from="/search" to="/training/search" />
                  <Redirect from="/search?q=:searchQuery" to="/training/search?q=:searchQuery" noThrow />
                  <Redirect from="/etpl" to="/faq#etpl-program-general-information" />

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
              </Suspense>
              {process.env.REACT_APP_FEATURE_MULTILANG === "true" && <LanguageSwitchButton />}
              <ContextualInfoPanel />
            </ContextualInfoContext.Provider>
          </FilterContext.Provider>
        </SortContext.Provider>
      </ComparisonContext.Provider>
  );
};
