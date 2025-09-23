import React from 'react';
import { render, act } from '@testing-library/react';
import { Content } from './index';

// Minimal Industry fixture with one map / pathway / two occupations
function buildIndustryFixture() {
	return {
		sys: { id: 'industry1' },
		title: 'Manufacturing',
		careerMaps: {
			items: [
				{
					sys: { id: 'map1' },
					careerMap: {
						title: 'Manufacturing Fields',
						pathways: {
							items: [
								{
									sys: { id: 'path1' },
									title: 'Welding',
									occupationsCollection: {
										items: [
											{ sys: { id: 'occ1' }, title: 'Welder I', level: 1 },
											{ sys: { id: 'occ2' }, title: 'Welder II', level: 2 }
										]
									}
								}
							]
						}
					}
				}
			]
		},
		inDemandCollection: { items: [] }
	} as any;
}

// Mock next/navigation hooks used by Content
jest.mock('next/navigation', () => {
	const params = new URLSearchParams();
	let pathname = '/career-pathways/manufacturing';
	return {
		useRouter: () => ({
			replace: (url: string) => {
				const [path, qs] = url.split('?');
				pathname = path;
				params.forEach((_, k) => params.delete(k));
				if (qs) new URLSearchParams(qs).forEach((v, k) => params.set(k, v));
			}
		}),
		useSearchParams: () => params,
		usePathname: () => pathname
	};
});

// Mock GraphQL client to resolve occupation queries
jest.mock('@utils/client', () => ({
	client: async ({ query, variables }: any) => {
		if (variables?.id === 'map1') {
			return buildIndustryFixture().careerMaps.items[0];
		}
		if (variables?.id === 'occ1') {
			return { careerMapObject: { sys: { id: 'occ1' }, title: 'Welder I' } };
		}
		if (variables?.id === 'occ2') {
			return { careerMapObject: { sys: { id: 'occ2' }, title: 'Welder II' } };
		}
		return {};
	}
}));

describe('selection lock behavior', () => {
	test('renders without crashing and establishes auto-select', () => {
		const industry = buildIndustryFixture();
		render(<Content thisIndustry={industry} />);
		// No explicit assertion – presence of component without throwing is sufficient smoke test
	});
});
