import { ProgramOutcome, QuarterlyEmploymentMetrics, NAICSIndustry } from '@utils/types/components';

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
  if (!outcome) return false;
  
  // Check if completion data has meaningful values
  const hasCompletionData = outcome.completion && (
    outcome.completion.exiters !== null ||
    outcome.completion.completers !== null ||
    outcome.completion.completionRate !== null ||
    outcome.completion.credentialRate !== null
  );
  
  // Check if employment data has meaningful values
  const hasEmploymentData = outcome.employment && outcome.employment.some(emp => 
    emp.employedCount !== null ||
    emp.employmentRate !== null ||
    emp.medianAnnualSalary !== null ||
    (emp.naicsIndustries && emp.naicsIndustries.length > 0)
  );
  
  return !!(hasCompletionData || hasEmploymentData);
};

export const getAvailableQuarters = (outcome: ProgramOutcome | undefined): (2 | 4)[] => {
  return outcome?.employment?.map(e => e.quarter) || [];
};

export const getHighestEmploymentRate = (outcome: ProgramOutcome | undefined): number | undefined => {
  if (!outcome?.employment?.length) return undefined;

  const validRates = outcome.employment
    .map(e => {
      const rate = e.employmentRate;
      if (rate === undefined || rate === null) return undefined;
      return typeof rate === 'string' ? parseFloat(rate) : rate;
    })
    .filter((rate): rate is number => rate !== undefined && !isNaN(rate));

  // If no valid rates found, return undefined instead of -Infinity
  if (validRates.length === 0) return undefined;

  return Math.max(...validRates);
};

export const getEmploymentRate = (outcome: ProgramOutcome | undefined, quarter: 2 | 4): number | undefined => {
  const rate = getQuarterlyEmployment(outcome, quarter)?.employmentRate;
  if (rate === undefined || rate === null) return undefined;
  return typeof rate === 'string' ? parseFloat(rate) : rate;
};

export const getMedianSalary = (outcome: ProgramOutcome | undefined, quarter: 2 | 4): number | undefined => {
  const salary = getQuarterlyEmployment(outcome, quarter)?.medianAnnualSalary;
  if (salary === undefined || salary === null) return undefined;
  return typeof salary === 'string' ? parseFloat(salary) : salary;
};

export const getCompletionRate = (outcome: ProgramOutcome | undefined): number | undefined => {
  const rate = outcome?.completion?.completionRate;
  if (rate === undefined || rate === null) return undefined;
  return typeof rate === 'string' ? parseFloat(rate) : rate;
};

export const getCredentialRate = (outcome: ProgramOutcome | undefined): number | undefined => {
  const rate = outcome?.completion?.credentialRate;
  if (rate === undefined || rate === null) return undefined;
  return typeof rate === 'string' ? parseFloat(rate) : rate;
};

export const formatPercentage = (rate: number | undefined): string => {
  if (rate === undefined || rate === null || typeof rate !== 'number') return 'N/A';
  // If the number is less than 1, assume it's a decimal (0.6125 = 61.25%)
  const percentage = rate < 1 ? rate * 100 : rate;
  return `${Math.round(percentage)}%`;
};

  if (salary === undefined || typeof salary !== 'number') return 'N/A';
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