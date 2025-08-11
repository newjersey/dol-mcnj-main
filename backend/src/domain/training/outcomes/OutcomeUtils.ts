// Utility functions for working with outcomes
import { ProgramOutcome, QuarterlyEmploymentMetrics } from './ProgramOutcome';

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