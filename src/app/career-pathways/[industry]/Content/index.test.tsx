import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Content } from './index';

// Minimal industry fixture with a single map, pathway, and two occupations
const industryFixture = (overrides: Partial<any> = {}) => ({
	title: 'Manufacturing',
	slug: 'manufacturing',
	description: 'desc',
	photo: null,
	industryAccordionCollection: { items: [] },
	sys: { id: 'industry1' },
	inDemandCollection: { items: [] },
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
										{ sys: { id: 'occ1' }, title: 'Welder I', level: 0 },
										{ sys: { id: 'occ2' }, title: 'Welder II', level: 1 }
									]
								}
							}
						]
					}
				}
			}
		]
	},
	...overrides
});

// Mock next/navigation to control router + search param state
const searchParamsStore = new URLSearchParams();

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
	useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
	useSearchParams: () => searchParamsStore,
	usePathname: () => '/career-pathways/manufacturing'
}));

// Mock network client returning occupation & pathway lookups
const clientMock = jest.fn(async ({ variables, query }) => {
  // Simulate the two query types by presence of variables.id or occupation id
  const id = variables?.id;
  if (id === 'map1') {
    return {
      careerMap: {
        title: 'Manufacturing Fields',
        pathways: {
          items: [
            {
              sys: { id: 'path1' },
              title: 'Welding',
              occupationsCollection: {
                items: [
                  { sys: { id: 'occ1' }, title: 'Welder I', level: 0 },
                  { sys: { id: 'occ2' }, title: 'Welder II', level: 1 }
                ]
              }
            }
          ]
        }
      }
    };
  }
  if (id === 'occ1') {
    return { careerMapObject: { sys: { id: 'occ1' }, title: 'Welder I', level: 0 } };
  }
  if (id === 'occ2') {
    return { careerMapObject: { sys: { id: 'occ2' }, title: 'Welder II', level: 1 } };
  }
  return {};
});

jest.mock('@utils/client', () => ({ client: (...args:any[]) => (clientMock as any)(...args) }));

// Mock fetch for endpoints invoked inside Details + normalization logic
const fetchMock = jest.fn(async (url: RequestInfo | URL) => {
	const href = typeof url === 'string' ? url : url.toString();
	// trainings search
	if (href.startsWith('/api/trainings/search')) {
		return {
			ok: true,
			status: 200,
			json: async () => ([
				{
					id: 'training1',
					name: 'Intro Welding Cert',
					providerName: 'ABC Institute',
					city: 'Newark',
					county: 'Essex',
					calendarLength: 30,
					totalCost: 1200
				}
			])
		} as any;
	}
	// job count (jobnumbers previously) endpoint pattern
	if (href.startsWith('/api/jobcount/')) {
		return {
			ok: true,
			status: 200,
			json: async () => ({ count: 42 })
		} as any;
	}
	// occupation lookup used in in-demand or normalization
	if (href.startsWith('/api/occupations/')) {
		const id = href.split('/').pop();
		return {
			ok: true,
			status: 200,
			json: async () => ({
				sys: { id },
				title: id === 'occ2' ? 'Welder II' : 'Welder I',
				description: 'Occupation description',
				salaryRangeStart: 30000,
				salaryRangeEnd: 45000
			})
		} as any;
	}
	return {
		ok: true,
		status: 200,
		json: async () => ({})
	} as any;
});

beforeAll(() => {
	// @ts-ignore
	global.fetch = fetchMock;
});

afterEach(() => {
	fetchMock.mockClear();
});

describe('Content navigation logic', () => {
		beforeEach(() => {
		mockReplace.mockReset();
		// Clear params each test
		Array.from(searchParamsStore.keys()).forEach(k => searchParamsStore.delete(k));
	});

	test('auto-selects first occupation when only field derived (no params)', async () => {
					render(<Content thisIndustry={industryFixture() as any} />);
					// yield microtask queue for useLayoutEffect scheduling
					await Promise.resolve();
					// Wait until both map fetch and first occupation fetch have occurred
					await waitFor(() => {
						const ids = clientMock.mock.calls.map(c => c[0]?.variables?.id);
						if (!ids.includes('map1')) throw new Error('map1 not fetched');
						if (!ids.includes('occ1')) throw new Error('occ1 not fetched');
					});
					await waitFor(() => {
						const call = mockReplace.mock.calls.find(c => /field=welding.*occupation=welder-i/.test(c[0]));
						if (!call) throw new Error('Expected router.replace with ordered field & occupation');
					}, { timeout: 2500 });

					// Ensure Details content rendered (occupation title) and fetch endpoints invoked
					await waitFor(() => {
						const occs = screen.getAllByText('Welder I');
						if (occs.length === 0) {
							throw new Error('Expected at least one Welder I element');
						}
					});
					// Wait for training fetch mock to resolve and render card title
					await waitFor(() => {
						screen.getByText('Intro Welding Cert');
					});
					// Ensure network layer invoked at least once
					if (fetchMock.mock.calls.length === 0) {
						throw new Error('Expected fetch to be called');
					}
	});
});

