import {
  getQuarterlyEmployment,
  getTopIndustryForQuarter,
  hasOutcomeData,
  getAvailableQuarters,
  getHighestEmploymentRate,
  getEmploymentRate,
  getMedianSalary,
  getCompletionRate,
  getCredentialRate,
  formatPercentage,
  formatSalary,
  getTopIndustries,
  getPercentEmployed,
  getAverageSalary
} from './outcomeHelpers';
import { ProgramOutcome } from './types/components';

const mockOutcome: ProgramOutcome = {
  completion: {
    exiters: 400,
    completers: 245,
    completionRate: "0.6125",
    credentialRate: "61.25"
  },
  employment: [
    {
      quarter: 2,
      employedCount: 347,
      employmentRate: "84.6341463414634",
      medianAnnualSalary: "48463.92",
      naicsIndustries: [
        {
          code: "623110",
          title: "Nursing Care Facilities",
          rank: 1
        },
        {
          code: "622110",
          title: "General Medical and Surgical Hospitals",
          rank: 2
        }
      ]
    },
    {
      quarter: 4,
      employedCount: 202,
      employmentRate: "49.2682926829268",
      medianAnnualSalary: "50133",
      naicsIndustries: [
        {
          code: "623110",
          title: "Nursing Care Facilities",
          rank: 1
        }
      ]
    }
  ]
};

describe('outcomeHelpers', () => {
  describe('getQuarterlyEmployment', () => {
    it('returns employment data for specified quarter', () => {
      const result = getQuarterlyEmployment(mockOutcome, 2);
      expect(result?.quarter).toBe(2);
      expect(result?.employmentRate).toBe("84.6341463414634");
    });

    it('returns undefined for non-existent quarter', () => {
      const result = getQuarterlyEmployment(mockOutcome, 3 as any);
      expect(result).toBeUndefined();
    });

    it('returns undefined for undefined outcome', () => {
      const result = getQuarterlyEmployment(undefined, 2);
      expect(result).toBeUndefined();
    });
  });

  describe('getTopIndustryForQuarter', () => {
    it('returns top industry title for specified quarter', () => {
      const result = getTopIndustryForQuarter(mockOutcome, 2);
      expect(result).toBe("Nursing Care Facilities");
    });

    it('returns undefined for quarter with no industries', () => {
      const noIndustryOutcome = {
        ...mockOutcome,
        employment: [{ quarter: 2, employedCount: 100, employmentRate: "50", medianAnnualSalary: "30000", naicsIndustries: [] }]
      };
      const result = getTopIndustryForQuarter(noIndustryOutcome, 2);
      expect(result).toBeUndefined();
    });
  });

  describe('hasOutcomeData', () => {
    it('returns true for outcome with completion data', () => {
      expect(hasOutcomeData(mockOutcome)).toBe(true);
    });

    it('returns true for outcome with employment data', () => {
      const employmentOnlyOutcome: ProgramOutcome = {
        employment: [{ quarter: 2, employedCount: 100, employmentRate: "50", medianAnnualSalary: "30000", naicsIndustries: [] }]
      };
      expect(hasOutcomeData(employmentOnlyOutcome)).toBe(true);
    });

    it('returns false for undefined outcome', () => {
      expect(hasOutcomeData(undefined)).toBe(false);
    });

    it('returns false for empty outcome', () => {
      expect(hasOutcomeData({})).toBe(false);
    });
  });

  describe('getAvailableQuarters', () => {
    it('returns array of available quarters', () => {
      const result = getAvailableQuarters(mockOutcome);
      expect(result).toEqual([2, 4]);
    });

    it('returns empty array for undefined outcome', () => {
      const result = getAvailableQuarters(undefined);
      expect(result).toEqual([]);
    });
  });

  describe('getHighestEmploymentRate', () => {
    it('returns highest employment rate as number', () => {
      const result = getHighestEmploymentRate(mockOutcome);
      expect(result).toBe(84.6341463414634);
    });

    it('returns undefined for outcome with no employment data', () => {
      const noEmploymentOutcome: ProgramOutcome = { completion: { exiters: 100, completers: 80, completionRate: "0.8", credentialRate: "80" } };
      const result = getHighestEmploymentRate(noEmploymentOutcome);
      expect(result).toBeUndefined();
    });
  });

  describe('getEmploymentRate', () => {
    it('returns employment rate for specified quarter', () => {
      const result = getEmploymentRate(mockOutcome, 2);
      expect(result).toBe(84.6341463414634);
    });

    it('handles string employment rates', () => {
      const result = getEmploymentRate(mockOutcome, 4);
      expect(result).toBe(49.2682926829268);
    });
  });

  describe('getMedianSalary', () => {
    it('returns median salary for specified quarter', () => {
      const result = getMedianSalary(mockOutcome, 2);
      expect(result).toBe(48463.92);
    });

    it('handles string salary values', () => {
      const result = getMedianSalary(mockOutcome, 4);
      expect(result).toBe(50133);
    });
  });

  describe('getCompletionRate', () => {
    it('returns completion rate as number', () => {
      const result = getCompletionRate(mockOutcome);
      expect(result).toBe(0.6125);
    });

    it('returns undefined for outcome without completion data', () => {
      const noCompletionOutcome: ProgramOutcome = {};
      const result = getCompletionRate(noCompletionOutcome);
      expect(result).toBeUndefined();
    });
  });

  describe('getCredentialRate', () => {
    it('returns credential rate as number', () => {
      const result = getCredentialRate(mockOutcome);
      expect(result).toBe(61.25);
    });
  });

  describe('formatPercentage', () => {
    it('formats decimal as percentage', () => {
      expect(formatPercentage(0.6125)).toBe('61%');
    });

    it('formats percentage as percentage', () => {
      expect(formatPercentage(84.63, false)).toBe('85%');
    });

    it('returns N/A for undefined', () => {
      expect(formatPercentage(undefined)).toBe('N/A');
    });

    it('rounds to nearest integer', () => {
      expect(formatPercentage(0.847)).toBe('85%');
    });
  });

  describe('formatSalary', () => {
    it('formats number as currency', () => {
      expect(formatSalary(48463.92)).toBe('$48,464');
    });

    it('returns N/A for undefined', () => {
      expect(formatSalary(undefined)).toBe('N/A');
    });

    it('formats whole numbers without decimals', () => {
      expect(formatSalary(50000)).toBe('$50,000');
    });
  });

  describe('getTopIndustries', () => {
    it('returns industries for specified quarter', () => {
      const result = getTopIndustries(mockOutcome, 2);
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Nursing Care Facilities');
      expect(result[1].title).toBe('General Medical and Surgical Hospitals');
    });

    it('returns empty array for undefined outcome', () => {
      const result = getTopIndustries(undefined, 2);
      expect(result).toEqual([]);
    });
  });

  describe('legacy compatibility functions', () => {
    describe('getPercentEmployed', () => {
      it('returns highest employment rate converted to decimal', () => {
        const result = getPercentEmployed(mockOutcome);
        expect(result).toBeCloseTo(0.846341463414634);
      });

      it('returns undefined for no employment data', () => {
        const result = getPercentEmployed(undefined);
        expect(result).toBeUndefined();  
      });
    });

    describe('getAverageSalary', () => {
      it('returns Q2 median salary if available', () => {
        const result = getAverageSalary(mockOutcome);
        expect(result).toBe(48463.92);
      });

      it('returns Q4 median salary if Q2 not available', () => {
        const q4OnlyOutcome: ProgramOutcome = {
          employment: [{ quarter: 4, employedCount: 100, employmentRate: "50", medianAnnualSalary: "40000", naicsIndustries: [] }]
        };
        const result = getAverageSalary(q4OnlyOutcome);
        expect(result).toBe(40000);
      });
    });
  });
});