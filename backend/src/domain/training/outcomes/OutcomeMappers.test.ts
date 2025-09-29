import { mapProgramOutcomeFromDb, getEmployment, getTopIndustry } from './OutcomeMappers';

describe('OutcomeMappers', () => {
  describe('mapProgramOutcomeFromDb', () => {
    it('maps a complete DB row to ProgramOutcome', () => {
      const dbRow = {
        exiters: 400,
        completers: 245,
        completion_rate: 0.6125,
        credential_rate: 61.25,
        n_employed_q2: 347,
        employment_rate_q2: 84.6341463414634,
        median_q2_annual: 48463.92,
        n_employed_q4: 202,
        employment_rate_q4: 49.2682926829268,
        median_q4_annual: 50133,
        quarter2_naics1_code: "623110",
        quarter2_naics1_title: "Nursing Care Facilities",
        quarter2_naics2_code: "622110",
        quarter2_naics2_title: "General Medical and Surgical Hospitals",
        quarter2_naics3_code: "621610",
        quarter2_naics3_title: "Home Health Care Services",
        quarter4_naics1_code: "623110",
        quarter4_naics1_title: "Nursing Care Facilities",
        quarter4_naics2_code: "622110",
        quarter4_naics2_title: "General Medical and Surgical Hospitals",
        quarter4_naics3_code: "561320",
        quarter4_naics3_title: "Temporary Help Services"
      };

      const result = mapProgramOutcomeFromDb(dbRow);

      expect(result).toBeDefined();
      expect(result?.completion).toEqual({
        exiters: 400,
        completers: 245,
        completionRate: 0.6125,
        credentialRate: 61.25
      });
      
      expect(result?.employment).toHaveLength(2);
      expect(result?.employment?.[0].quarter).toBe(2);
      expect(result?.employment?.[0].employmentRate).toBe(84.6341463414634);
      expect(result?.employment?.[0].naicsIndustries).toHaveLength(3);
      expect(result?.employment?.[0].naicsIndustries?.[0]).toEqual({
        code: "623110",
        title: "Nursing Care Facilities",
        rank: 1
      });
    });

    it('maps partial data correctly', () => {
      const dbRow = {
        completion_rate: 0.75,
        employment_rate_q2: 80.5
      };

      const result = mapProgramOutcomeFromDb(dbRow);

      expect(result).toBeDefined();
      expect(result?.completion).toEqual({
        exiters: undefined,
        completers: undefined,
        completionRate: 0.75,
        credentialRate: undefined
      });

      expect(result?.employment).toHaveLength(1);
      expect(result?.employment?.[0].quarter).toBe(2);
      expect(result?.employment?.[0].employmentRate).toBe(80.5);
      expect(result?.employment?.[0].naicsIndustries).toEqual([]);
    });

    it('returns undefined for empty row', () => {
      const result = mapProgramOutcomeFromDb({});
      expect(result).toBeUndefined();
    });

    it('returns undefined for null row', () => {
      const result = mapProgramOutcomeFromDb(null as never);
      expect(result).toBeUndefined();
    });

    it('extracts NAICS industries correctly', () => {
      const dbRow = {
        employment_rate_q2: 75,
        quarter2_naics1_code: "111111",
        quarter2_naics1_title: "Industry 1",
        quarter2_naics3_code: "333333",
        quarter2_naics3_title: "Industry 3"
        // Note: missing naics2 to test sparse data
      };

      const result = mapProgramOutcomeFromDb(dbRow);

      expect(result?.employment?.[0].naicsIndustries).toEqual([
        { code: "111111", title: "Industry 1", rank: 1 },
        { code: "333333", title: "Industry 3", rank: 3 }
      ]);
    });
  });

  describe('getEmployment', () => {
    const mockOutcome = {
      employment: [
        { quarter: 2 as const, employedCount: 100, employmentRate: 80, medianAnnualSalary: 40000, naicsIndustries: [] },
        { quarter: 4 as const, employedCount: 90, employmentRate: 75, medianAnnualSalary: 42000, naicsIndustries: [] }
      ]
    };

    it('returns employment data for specified quarter', () => {
      const result = getEmployment(mockOutcome, 2);
      expect(result?.quarter).toBe(2);
      expect(result?.employmentRate).toBe(80);
    });

    it('returns undefined for non-existent quarter', () => {
      const result = getEmployment(mockOutcome, 3 as 2 | 4);
      expect(result).toBeUndefined();
    });

    it('returns undefined for undefined outcome', () => {
      const result = getEmployment(undefined, 2);
      expect(result).toBeUndefined();
    });
  });

  describe('getTopIndustry', () => {
    it('returns first industry when available', () => {
      const employment = {
        quarter: 2 as const,
        employedCount: 100,
        employmentRate: 80,
        medianAnnualSalary: 40000,
        naicsIndustries: [
          { code: "111111", title: "Industry 1", rank: 1 },
          { code: "222222", title: "Industry 2", rank: 2 }
        ]
      };

      const result = getTopIndustry(employment);
      expect(result).toEqual({ code: "111111", title: "Industry 1", rank: 1 });
    });

    it('returns undefined when no industries available', () => {
      const employment = {
        quarter: 2 as const,
        employedCount: 100,
        employmentRate: 80,
        medianAnnualSalary: 40000,
        naicsIndustries: []
      };

      const result = getTopIndustry(employment);
      expect(result).toBeUndefined();
    });

    it('returns undefined for undefined employment', () => {
      const result = getTopIndustry(undefined);
      expect(result).toBeUndefined();
    });
  });
});