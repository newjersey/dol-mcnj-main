import { ProgramOutcome, QuarterlyEmploymentMetrics, NAICSIndustry } from '@/utils/types/components';

/**
 * Frontend utilities for working with program outcomes
 */

export const getQuarterlyEmployment = (
  outcome: ProgramOutcome | undefined,
  quarter: 2 | 4
): QuarterlyEmploymentMetrics | undefined => {
  return outcome?.employment?.find(q => q.quarter === quarter);
};

export const getTopIndustryForQuarter = (
  outcome: ProgramOutcome | undefined,
  quarter: 2 | 4
): string | undefined => {
  const quarterData = getQuarterlyEmployment(outcome, quarter);
  return quarterData?.naicsIndustries?.[0]?.title; // Rank 1 industry
};

export const hasOutcomeData = (outcome: ProgramOutcome | undefined): boolean => {
  return !!(outcome?.completion || outcome?.employment?.length);
};

export const getAvailableQuarters = (outcome: ProgramOutcome | undefined): (2 | 4)[] => {
  return outcome?.employment?.map(e => e.quarter) || [];
};

export const getHighestEmploymentRate = (outcome: ProgramOutcome | undefined): number | undefined => {
  if (!outcome?.employment?.length) return undefined;

  return Math.max(
    ...outcome.employment
      .map(e => e.employmentRate)
      .filter((rate): rate is number => rate !== undefined)
  );
};

export const getEmploymentRate = (outcome: ProgramOutcome | undefined, quarter: 2 | 4): number | undefined => {
  return getQuarterlyEmployment(outcome, quarter)?.employmentRate;
};

export const getMedianSalary = (outcome: ProgramOutcome | undefined, quarter: 2 | 4): number | undefined => {
  return getQuarterlyEmployment(outcome, quarter)?.medianAnnualSalary;
};

export const getCompletionRate = (outcome: ProgramOutcome | undefined): number | undefined => {
  return outcome?.completion?.completionRate;
};

export const getCredentialRate = (outcome: ProgramOutcome | undefined): number | undefined => {
  return outcome?.completion?.credentialRate;
};

export const formatPercentage = (rate: number | undefined): string => {
  if (rate === undefined || rate === null) return 'N/A';
  return `${rate.toFixed(1)}%`;
};

export const formatSalary = (salary: number | undefined): string => {
  if (salary === undefined || salary === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(salary);
};

export const getTopIndustries = (outcome: ProgramOutcome | undefined, quarter: 2 | 4): NAICSIndustry[] => {
  return getQuarterlyEmployment(outcome, quarter)?.naicsIndustries || [];
};

// Legacy compatibility functions for migration
export const getPercentEmployed = (outcome: ProgramOutcome | undefined): number | undefined => {
  // Return the highest employment rate from available quarters for backward compatibility
  return getHighestEmploymentRate(outcome);
};

export const getAverageSalary = (outcome: ProgramOutcome | undefined): number | undefined => {
  // Return the median salary from Q2 if available, otherwise Q4, for backward compatibility
  return getMedianSalary(outcome, 2) || getMedianSalary(outcome, 4);
};