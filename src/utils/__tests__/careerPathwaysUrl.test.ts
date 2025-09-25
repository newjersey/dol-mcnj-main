import { normalizeCareerPathwaysParams, reorderCareerPathwaysParamsSimple } from "@utils/careerPathwaysUrl";

describe("careerPathwaysUrl normalization", () => {
  test("orders field then occupation", async () => {
    const params = new URLSearchParams("occupation=welder&field=manufacturing");
    const result = await normalizeCareerPathwaysParams({ params });
  // @ts-ignore jest matcher
  expect(result.query).toBe("field=manufacturing&occupation=welder");
  });

  test("drops unknown params", async () => {
    const params = new URLSearchParams("foo=bar&occupation=welder");
    const result = await normalizeCareerPathwaysParams({ params });
  // @ts-ignore
  expect(result.query).toBe("occupation=welder");
  // @ts-ignore
  expect(result.changed).toBe(true);
  });

  test("migrates indemand when resolver returns occupation", async () => {
    const params = new URLSearchParams("indemand=123");
    const result = await normalizeCareerPathwaysParams({
      params,
      migrateInDemand: true,
  resolveOccupationById: async (id: string) => ({ id, title: "Test Occupation" }),
    });
  // @ts-ignore
  expect(result.query).toBe("occupation=test-occupation");
  // @ts-ignore
  expect(result.changed).toBe(true);
  });

  test("retains indemand when migration cannot resolve occupation", async () => {
    const params = new URLSearchParams("indemand=999");
    const result = await normalizeCareerPathwaysParams({ params, migrateInDemand: true });
    // query should be empty (no recognized ORDER params) and indemand preserved in original params
    // Since we don't delete indemand without migration, occupation absent & query empty
  // @ts-ignore
  expect(result.query).toBe("");
  // @ts-ignore
  expect(result.changed).toBe(false);
  });

  test("simple reorder helper", () => {
    const params = new URLSearchParams("occupation=welder&field=manufacturing");
    const q = reorderCareerPathwaysParamsSimple(params);
  // @ts-ignore
  expect(q).toBe("field=manufacturing&occupation=welder");
  });
});
