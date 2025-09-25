// The auto-select logic fetches career map(s) and then selects the first pathway's lowest level occupation
// We stub the GraphQL responses used by client() calls (industry -> careerMaps, then individual pathway fetch)
// so that the effect has deterministic data to operate on. Then we assert the query string updates.
describe('Career Pathways auto-select (manufacturing)', () => {
	beforeEach(() => {
		cy.intercept('POST', '**/environments/**', (req) => {
			const body = req.body as { query: string; variables?: { id?: string } };
			// Debug: surface which query received
			// eslint-disable-next-line no-console
			console.log('GraphQL intercepted', body.query.slice(0,40));
			if (body.query.includes('query Industry')) {
				req.alias = 'industry';
				return req.reply({
					statusCode: 200,
					body: { data: { industryCollection: { items: [{ sys: { id: 'ind-manufacturing' }, title: 'Manufacturing', shorthandTitle: 'Manufacturing', slug: 'manufacturing', description: { json: {} }, photo: null, careerMaps: { items: [{ title: 'Production Operations', learnMoreBoxes: [], sys: { id: 'map-prod' } }] }, inDemandCollection: { items: [] }, industryAccordionCollection: { items: [] } }] } } }
				});
			}
			if (body.query.includes('query Maps')) {
				req.alias = 'map';
				return req.reply({
					statusCode: 200,
					body: { data: { careerMap: { title: 'Production Operations', sys: { id: 'map-prod' }, learnMoreBoxes: [], pathways: { items: [{ sys: { id: 'path-prod' }, title: 'Production', occupationsCollection: { items: [ { sys: { id: 'occ-asm' }, title: 'Assembler', shortTitle: null, level: 1, salaryRangeStart: null, salaryRangeEnd: null, educationLevel: null }, { sys: { id: 'occ-sr-asm' }, title: 'Senior Assembler', shortTitle: null, level: 2, salaryRangeStart: null, salaryRangeEnd: null, educationLevel: null } ] } }] } } } }
				});
			}
			if (body.query.includes('query Occupation')) {
				req.alias = 'occupation';
				const occId = body.variables?.id;
				const title = occId === 'occ-sr-asm' ? 'Senior Assembler' : 'Assembler';
				return req.reply({ statusCode: 200, body: { data: { careerMapObject: { sys: { id: occId }, title } } } });
			}
		});
	});

	it('injects first field & occupation when none provided', () => {
		cy.visit('/career-pathways/manufacturing');
		// Instead of waiting on GraphQL aliases (which may resolve server-side before hydration), poll for the expected query string.
		cy.location('search', { timeout: 10000 }).should('match', /\?field=production&occupation=assembler$/);
		// Also assert the occupation node button for the selected occupation exists (map rendered)
		cy.get('[data-testid="occupation-node-assembler"]', { timeout: 10000 }).should('exist');
	});
});
