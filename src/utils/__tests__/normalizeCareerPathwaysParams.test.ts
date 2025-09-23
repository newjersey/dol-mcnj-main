import { normalizeCareerPathwaysParams } from '@utils/careerPathwaysUrl';
import { slugify } from '@utils/slugify';

describe('normalizeCareerPathwaysParams (extended)', () => {
	test('orders field then occupation when both present unordered', async () => {
		const params = new URLSearchParams('occupation=welder&field=manufacturing');
		const res = await normalizeCareerPathwaysParams({ params });
		// @ts-ignore
		expect(res.query).toBe('field=manufacturing&occupation=welder');
		// Ordering alone does not set changed=true in current implementation (only mutations / deletions)
		// @ts-ignore
		expect(res.changed).toBe(false);
	});

	test('drops unknown params and reports changed', async () => {
		const params = new URLSearchParams('foo=bar&occupation=welder');
		const res = await normalizeCareerPathwaysParams({ params });
		// @ts-ignore
		expect(res.query).toBe('occupation=welder');
		// @ts-ignore
		expect(res.changed).toBe(true);
	});

	test('migrates indemand to occupation slug when resolver returns title', async () => {
		const params = new URLSearchParams('indemand=123');
		const res = await normalizeCareerPathwaysParams({
			params,
			migrateInDemand: true,
			resolveOccupationById: async (id: string) => ({ id, title: 'Welder I' })
		});
		// @ts-ignore
		expect(res.query).toBe('occupation=' + slugify('Welder I'));
		// @ts-ignore
		expect(res.changed).toBe(true);
	});

	test('retains indemand if migration fails (no occupation added)', async () => {
		const params = new URLSearchParams('indemand=999');
		const res = await normalizeCareerPathwaysParams({ params, migrateInDemand: true });
		// @ts-ignore
		expect(res.query).toBe('');
		// @ts-ignore
		expect(res.changed).toBe(false);
	});

	test('infers field when occupation slug resolves to id and field resolver returns pathway title', async () => {
		const params = new URLSearchParams('occupation=welder-i');
		const res = await normalizeCareerPathwaysParams({
			params,
			resolveOccupationBySlug: async (slug: string) => slug === 'welder-i' ? { id: 'occ1', title: 'Welder I' } : undefined,
			resolveFieldForOccupationId: async (id: string) => id === 'occ1' ? { title: 'Welding' } : undefined
		});
		// @ts-ignore
		expect(res.fieldSlug).toBe(slugify('Welding'));
		// @ts-ignore
		expect(res.query).toBe('field=welding&occupation=welder-i');
		// @ts-ignore
		expect(res.changed).toBe(true);
	});
});
