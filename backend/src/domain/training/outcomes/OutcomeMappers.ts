import { ProgramOutcome, QuarterlyEmploymentMetrics, NAICSIndustry } from "./ProgramOutcome";

export function mapProgramOutcomeFromDb(row: any): ProgramOutcome | undefined {
    if (!row) return undefined;

    const outcome: ProgramOutcome = {};

    // Completion metrics
    if (
        row.exiters !== undefined ||
        row.completers !== undefined ||
        row.completion_rate !== undefined ||
        row.credential_rate !== undefined
    ) {
        outcome.completion = {
            exiters: row.exiters,
            completers: row.completers,
            completionRate: row.completion_rate,
            credentialRate: row.credential_rate,
        };
    }

    // Employment metrics by quarter
    const employment: QuarterlyEmploymentMetrics[] = [];
    if (row.n_employed_q2 !== undefined || row.employment_rate_q2 !== undefined || row.median_q2_annual !== undefined) {
        employment.push({
            quarter: 2,
            employedCount: row.n_employed_q2,
            employmentRate: row.employment_rate_q2,
            medianAnnualSalary: row.median_q2_annual,
            naicsIndustries: extractNAICSIndustries(row, 2),
        });
    }
    if (row.n_employed_q4 !== undefined || row.employment_rate_q4 !== undefined || row.median_q4_annual !== undefined) {
        employment.push({
            quarter: 4,
            employedCount: row.n_employed_q4,
            employmentRate: row.employment_rate_q4,
            medianAnnualSalary: row.median_q4_annual,
            naicsIndustries: extractNAICSIndustries(row, 4),
        });
    }
    if (employment.length > 0) {
        outcome.employment = employment;
    }

    return Object.keys(outcome).length ? outcome : undefined;
}

function extractNAICSIndustries(row: any, quarter: 2 | 4): NAICSIndustry[] {
    const prefix = `quarter${quarter}_naics`;
    const industries: NAICSIndustry[] = [];
    for (let i = 1; i <= 3; i++) {
        const code = row[`${prefix}${i}_code`];
        const title = row[`${prefix}${i}_title`];
        if (code && title) {
            industries.push({ code, title, rank: i });
        }
    }
    return industries;
}