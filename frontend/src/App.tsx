import { ReactElement } from "react";
import RedirectToNewTE from "./components/RedirectToNewTE";
import { OccupationPage } from "./occupation-page/OccupationPage";
import { PrivacyPolicyPage } from "./privacy-policy-page/PrivacyPolicyPage";
import { TermsOfServicePage } from "./terms-of-service-page/TermsOfServicePage";
import { FaqPage } from "./faq-page/FaqPage";
import { TrainingProviderPage } from "./training-provider-page/TrainingProviderPage";
import { Client } from "./domain/Client";
import { Router, globalHistory } from "@reach/router";
import { NotFoundPage } from "./error/NotFoundPage";
import { FundingPage } from "./funding-page/FundingPage";
import { LandingPageCounselor } from "./landing-page/LandingPageCounselor";
import { LandingPageExplorer } from "./landing-page/LandingPageExplorer";
import { EtplPage } from "./etpl-page/EtplPage";
import { FaqRoutes } from "./faqs/FaqRoutes";
import { FinancialPage } from "./financial-page/FinancialPage";
import * as Sentry from "@sentry/react";
import "@newjersey/njwds/dist/css/styles.css";

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
const GA_TRACKING_ID = "UA-140253594-9";
globalHistory.listen(({ location }) => {
  if (typeof window.gtag === "function") {
    window.gtag("config", GA_TRACKING_ID, { page_path: location.pathname });
  }
});

export const App = (props: Props): ReactElement => {
    return (
        <Router>
            <LandingPageCounselor path="/counselor" client={props.client} />
            <LandingPageExplorer path="/explorer" client={props.client} />
            {FaqRoutes({ client: props.client })}
            <RedirectToNewTE path="/search" />
            <RedirectToNewTE path="/search/:searchQuery" />
            <RedirectToNewTE path="/training/:id" />
            <RedirectToNewTE path="/in-demand-occupations" />
            <OccupationPage path="/occupation/:soc" client={props.client} />
            <FinancialPage path="/tuition-assistance" client={props.client} />
            <FundingPage path="/funding" client={props.client} />
            <PrivacyPolicyPage path="/privacy-policy" client={props.client} />
            <TermsOfServicePage path="/terms-of-service" client={props.client} />
            <FaqPage path="/faq" client={props.client} />
            <TrainingProviderPage path="/training-provider-resources" client={props.client} />
            <EtplPage path="/etpl" client={props.client} />
            <NotFoundPage default client={props.client} />
            <RedirectToNewTE path="/*" />
        </Router>
    );
};