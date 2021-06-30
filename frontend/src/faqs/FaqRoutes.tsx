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

export const FaqRoutes = (): ReactElement => {
  return (
    <>
      <FaqChildcare path="/faq/child-care" />
      <FaqEnrollProgram path="/faq/enroll-program" />
      <FaqHealthInsurance path="/faq/health-insurance" />
      <FaqJobListings path="/faq/job-listings" />
      <FaqSearchHelp path="/faq/search-help" />
      <FaqUnemploymentInsurance path="/faq/unemployment-insurance" />
      <FaqFundingOpportunities path="/faq/funding-opportunities" />
      <FaqDataSources path="/faq/data-sources" />
      <FaqLaborDemandOccupations path="/faq/labor-demand-occupations" />
      <FaqRegisteredApprenticeship path="/faq/registered-apprenticeship" />
      <FaqEtplPerformanceStandards path="/faq/etpl-performance-standards" />
      <FaqEtplOosProvider path="/faq/etpl-out-of-state-provider" />
    </>
  );
};
