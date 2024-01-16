import { ReactElement } from "react";
import { Client } from "../domain/Client";
import { Redirect } from "@reach/router";

export const FaqRoutes = ({ client }: { client: Client }): ReactElement => {
  return (
    <>
      <Redirect from="/faq/child-care" to="/faq" />
      <Redirect from="/faq/enroll-program" to="/faq" />
      <Redirect from="/faq/search-help" to="/faq" />
      <Redirect from="/faq/health-insurance" to="/faq" />
      <Redirect from="/faq/job-listings" to="/faq" />
      <Redirect from="/faq/unemployment-insurance" to="/faq" />
      <Redirect from="/faq/funding-opportunities" to="/faq" />
      <Redirect from="/faq/data-sources" to="/faq" />
      <Redirect from="/faq/labor-demand-occupations" to="/faq" />
      <Redirect from="/faq/registered-apprenticeship" to="/faq" />
      <Redirect from="/faq/etpl-performance-standards" to="/faq" />
      <Redirect from="/faq/etpl-out-of-state-provider" to="/faq" />
    </>
  );
};
