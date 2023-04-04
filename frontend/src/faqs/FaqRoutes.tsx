import React, { ReactElement } from "react";
import { FaqChildcare } from "./faq-child-care";
import { FaqEnrollProgram } from "./faq-enroll-program";
import { FaqFundingOpportunities } from "./faq-funding-opportunities";
import { FaqHealthInsurance } from "./faq-health-insurance";
import { FaqJobListings } from "./faq-job-listings";
import { FaqSearchHelp } from "./faq-search-help";
import { FaqUnemploymentInsurance } from "./faq-unemployment-insurance";
import { FaqDataSources } from "./faq-data-sources";
import { FaqLaborDemandOccupations } from "./labor-demand-occupations";
import { FaqRegisteredApprenticeship } from "./registered-apprenticeship";
import { FaqEtplPerformanceStandards } from "./etpl-performance-standards";
import { FaqEtplOosProvider } from "./etpl-out-of-state-provider";
import { Client } from "../domain/Client";

export const FaqRoutes = ({ client }: { client: Client }): ReactElement => {
  return (
    <>
      <FaqChildcare path="/faq/child-care" client={client} />
      <FaqEnrollProgram path="/faq/enroll-program" client={client} />
      <FaqHealthInsurance path="/faq/health-insurance" client={client} />
      <FaqJobListings path="/faq/job-listings" client={client} />
      <FaqSearchHelp path="/faq/search-help" client={client} />
      <FaqUnemploymentInsurance path="/faq/unemployment-insurance" client={client} />
      <FaqFundingOpportunities path="/faq/funding-opportunities" client={client} />
      <FaqDataSources path="/faq/data-sources" client={client} />
      <FaqLaborDemandOccupations path="/faq/labor-demand-occupations" client={client} />
      <FaqRegisteredApprenticeship path="/faq/registered-apprenticeship" client={client} />
      <FaqEtplPerformanceStandards path="/faq/etpl-performance-standards" client={client} />
      <FaqEtplOosProvider path="/faq/etpl-out-of-state-provider" client={client} />
    </>
  );
};
