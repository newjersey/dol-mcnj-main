// Core outcome-related interfaces
export interface NAICSIndustry {
    code: string;
    title: string;
    rank: number; // 1st, 2nd, 3rd most common industry
}

export interface QuarterlyEmploymentMetrics {
    quarter: 2 | 4; // Type-safe quarter values
    employedCount?: number;
    employmentRate?: number;
    medianAnnualSalary?: number;
    naicsIndustries?: NAICSIndustry[];
}

export interface CompletionMetrics {
    exiters?: number;
    completers?: number;
    completionRate?: number;
    credentialRate?: number;
}

export interface ProgramOutcome {
    completion?: CompletionMetrics;
    employment?: QuarterlyEmploymentMetrics[];
}