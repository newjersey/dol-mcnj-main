import {
  formatPercentage,
  formatSalary,
  getEmploymentRate,
  getMedianSalary,
  getCompletionRate,
  getCredentialRate,
  hasOutcomeData,
  getTopIndustries,
  getQuarterlyEmployment,
  getHighestEmploymentRate,
  getPercentEmployed,
  getAverageSalary
} from './outcomeHelpers';
import { ProgramOutcome, QuarterlyEmploymentMetrics, NAICSIndustry } from './types/components';

describe('outcomeHelpers', () => {
  const mockOutcome: ProgramOutcome = {
    completion: {
      exiters: 100,
      completers: 80,
      completionRate: 0.8,
      credentialRate: 0.75
    },
    employment: [
      {
        quarter: 2,
        employedCount: 70,
        employmentRate: 87.5,
        medianAnnualSalary: 45000,
        naicsIndustries: [
          { code: '621111', title: 'Offices of Physicians', rank: 1 },
          { code: '622110', title: 'General Medical Hospitals', rank: 2 },
          { code: '621610', title: 'Home Health Care Services', rank: 3 }
        ]
      },
      {
        quarter: 4,
        employedCount: 65,
        employmentRate: 81.25,
        medianAnnualSalary: 48000,
        naicsIndustries: [
          { code: '621111', title: 'Offices of Physicians', rank: 1 },
          { code: '622110', title: 'General Medical Hospitals', rank: 2 }
        ]
      }
    ]
  };

  describe('formatPercentage', () => {
    it('formats decimal to percentage with one decimal place', () => {
      expect(formatPercentage(0.8756, true)).toBe('87.6%');
    });

    it('formats number as percentage with one decimal place when isDecimal=false', () => {
      expect(formatPercentage(87.56789, false)).toBe('87.6%');
    });

    it('handles zero correctly as decimal', () => {
      expect(formatPercentage(0, true)).toBe('0.0%');
    });

    it('handles zero correctly as number', () => {
      expect(formatPercentage(0, false)).toBe('0.0%');
    });

    it('handles undefined values', () => {
      expect(formatPercentage(undefined)).toBe('N/A');
    });

    it('handles null values correctly', () => {
      expect(formatPercentage(null as any)).toBe('N/A');
    });

    it('defaults to decimal conversion when isDecimal not specified', () => {
      expect(formatPercentage(0.613)).toBe('61.3%');
    });
  });

  describe('formatSalary', () => {
    it('formats currency without decimals', () => {
      expect(formatSalary(45000)).toBe('$45,000');
    });

    it('formats currency with cents removed', () => {
      expect(formatSalary(45000.99)).toBe('$45,001');
    });

    it('handles undefined values', () => {
      expect(formatSalary(undefined)).toBe('N/A');
    });

    it('handles undefined values correctly', () => {
      expect(formatSalary(undefined)).toBe('N/A');
    });

    it('handles zero salary', () => {
      expect(formatSalary(0)).toBe('$0');
    });
  });

  describe('getEmploymentRate', () => {
    it('returns Q2 employment rate', () => {
      expect(getEmploymentRate(mockOutcome, 2)).toBe(87.5);
    });

    it('returns Q4 employment rate', () => {
      expect(getEmploymentRate(mockOutcome, 4)).toBe(81.25);
    });

    it('returns undefined for missing quarter', () => {
      const outcomeWithoutQ4: ProgramOutcome = {
        employment: [{ quarter: 2, employmentRate: 87.5 }]
      };
      expect(getEmploymentRate(outcomeWithoutQ4, 4)).toBeUndefined();
    });

    it('returns undefined for undefined outcome', () => {
      expect(getEmploymentRate(undefined, 2)).toBeUndefined();
    });

    it('handles string employment rates', () => {
      const outcomeWithStringRate: ProgramOutcome = {
        employment: [{ quarter: 2, employmentRate: '87.5' as any }]
      };
      expect(getEmploymentRate(outcomeWithStringRate, 2)).toBe(87.5);
    });
  });

  describe('getMedianSalary', () => {
    it('returns Q2 median salary', () => {
      expect(getMedianSalary(mockOutcome, 2)).toBe(45000);
    });

    it('returns Q4 median salary', () => {
      expect(getMedianSalary(mockOutcome, 4)).toBe(48000);
    });

    it('returns undefined for missing quarter', () => {
      const outcomeWithoutQ4: ProgramOutcome = {
        employment: [{ quarter: 2, medianAnnualSalary: 45000 }]
      };
      expect(getMedianSalary(outcomeWithoutQ4, 4)).toBeUndefined();
    });

    it('returns undefined for undefined outcome', () => {
      expect(getMedianSalary(undefined, 2)).toBeUndefined();
    });

    it('handles string salaries', () => {
      const outcomeWithStringSalary: ProgramOutcome = {
        employment: [{ quarter: 2, medianAnnualSalary: '45000' as any }]
      };
      expect(getMedianSalary(outcomeWithStringSalary, 2)).toBe(45000);
    });
  });

  describe('getCompletionRate', () => {
    it('returns completion rate as percentage', () => {
      expect(getCompletionRate(mockOutcome)).toBe(0.8);
    });

    it('returns undefined for missing completion data', () => {
      const outcomeWithoutCompletion: ProgramOutcome = {
        employment: []
      };
      expect(getCompletionRate(outcomeWithoutCompletion)).toBeUndefined();
    });

    it('returns undefined for undefined outcome', () => {
      expect(getCompletionRate(undefined)).toBeUndefined();
    });

    it('handles string completion rates', () => {
      const outcomeWithStringRate: ProgramOutcome = {
        completion: { completionRate: '0.8' as any }
      };
      expect(getCompletionRate(outcomeWithStringRate)).toBe(0.8);
    });
  });

  describe('getCredentialRate', () => {
    it('returns credential rate as percentage', () => {
      expect(getCredentialRate(mockOutcome)).toBe(0.75);
    });

    it('returns undefined for missing credential data', () => {
      const outcomeWithoutCredential: ProgramOutcome = {
        employment: []
      };
      expect(getCredentialRate(outcomeWithoutCredential)).toBeUndefined();
    });
  });

  describe('hasOutcomeData', () => {
    it('returns true when completion data exists', () => {
      expect(hasOutcomeData(mockOutcome)).toBe(true);
    });

    it('returns true when employment data exists', () => {
      const outcomeWithOnlyEmployment: ProgramOutcome = {
        employment: [{ quarter: 2, employmentRate: 80 }]
      };
      expect(hasOutcomeData(outcomeWithOnlyEmployment)).toBe(true);
    });

    it('returns false for empty outcome', () => {
      const emptyOutcome: ProgramOutcome = {};
      expect(hasOutcomeData(emptyOutcome)).toBe(false);
    });

    it('returns false for undefined outcome', () => {
      expect(hasOutcomeData(undefined)).toBe(false);
    });

    it('returns true when completion object exists even with undefined values', () => {
      const undefinedOutcome: ProgramOutcome = {
        completion: {
          exiters: undefined,
          completers: undefined,
          completionRate: undefined,
          credentialRate: undefined
        },
        employment: []
      };
      // This returns true because the function checks !== null, and undefined !== null is true
      expect(hasOutcomeData(undefinedOutcome)).toBe(true);
    });
  });

  describe('getTopIndustries', () => {
    it('returns Q2 industries correctly', () => {
      const industries = getTopIndustries(mockOutcome, 2);
      expect(industries).toHaveLength(3);
      expect(industries[0]).toEqual({
        code: '621111',
        title: 'Offices of Physicians',
        rank: 1
      });
    });

    it('returns Q4 industries correctly', () => {
      const industries = getTopIndustries(mockOutcome, 4);
      expect(industries).toHaveLength(2);
      expect(industries[0]).toEqual({
        code: '621111',
        title: 'Offices of Physicians',
        rank: 1
      });
    });

    it('returns empty array for missing quarter', () => {
      const outcomeWithoutQ4: ProgramOutcome = {
        employment: [{ quarter: 2, naicsIndustries: [] }]
      };
      expect(getTopIndustries(outcomeWithoutQ4, 4)).toEqual([]);
    });

    it('returns empty array for undefined outcome', () => {
      expect(getTopIndustries(undefined, 2)).toEqual([]);
    });
  });

  describe('getQuarterlyEmployment', () => {
    it('returns correct quarterly data', () => {
      const q2Data = getQuarterlyEmployment(mockOutcome, 2);
      expect(q2Data?.quarter).toBe(2);
      expect(q2Data?.employmentRate).toBe(87.5);
    });

    it('returns undefined for missing quarter', () => {
      const outcomeWithoutQ4: ProgramOutcome = {
        employment: [{ quarter: 2 }]
      };
      expect(getQuarterlyEmployment(outcomeWithoutQ4, 4)).toBeUndefined();
    });
  });

  describe('getHighestEmploymentRate', () => {
    it('returns highest employment rate from available quarters', () => {
      expect(getHighestEmploymentRate(mockOutcome)).toBe(87.5);
    });

    it('returns undefined for empty employment data', () => {
      const emptyOutcome: ProgramOutcome = { employment: [] };
      expect(getHighestEmploymentRate(emptyOutcome)).toBeUndefined();
    });

    it('handles undefined outcome', () => {
      expect(getHighestEmploymentRate(undefined)).toBeUndefined();
    });

    it('ignores undefined rates', () => {
      const outcomeWithUndefined: ProgramOutcome = {
        employment: [
          { quarter: 2, employmentRate: undefined },
          { quarter: 4, employmentRate: 75.5 }
        ]
      };
      expect(getHighestEmploymentRate(outcomeWithUndefined)).toBe(75.5);
    });
  });

  describe('Legacy compatibility functions', () => {
    describe('getPercentEmployed', () => {
      it('returns highest employment rate for backward compatibility', () => {
        expect(getPercentEmployed(mockOutcome)).toBe(87.5);
      });
    });

    describe('getAverageSalary', () => {
      it('returns Q2 salary if available for backward compatibility', () => {
        expect(getAverageSalary(mockOutcome)).toBe(45000);
      });

      it('returns Q4 salary if Q2 not available', () => {
        const outcomeWithOnlyQ4: ProgramOutcome = {
          employment: [{ quarter: 4, medianAnnualSalary: 48000 }]
        };
        expect(getAverageSalary(outcomeWithOnlyQ4)).toBe(48000);
      });

      it('returns undefined if no salary data', () => {
        const outcomeWithoutSalary: ProgramOutcome = {
          employment: [{ quarter: 2 }]
        };
        expect(getAverageSalary(outcomeWithoutSalary)).toBeUndefined();
      });
    });
  });
});