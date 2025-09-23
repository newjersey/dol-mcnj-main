describe('Career Pathways occupation selection (manufacturing)', () => {
	beforeEach(() => {
		cy.intercept('POST', '**/environments/**', (req) => {
			const body = req.body as { query: string; variables?: { id?: string } };
			// eslint-disable-next-line no-console
			console.log('GraphQL intercepted', body.query.slice(0,40));
			if (body.query.includes('query Industry')) {
				req.alias = 'industry';
				return req.reply({ statusCode: 200, body: { data: { industryCollection: { items: [{ sys: { id: 'ind-manufacturing' }, title: 'Manufacturing', shorthandTitle: 'Manufacturing', slug: 'manufacturing', description: { json: {} }, photo: null, careerMaps: { items: [{ title: 'Production Operations', learnMoreBoxes: [], sys: { id: 'map-prod' } }] }, inDemandCollection: { items: [] }, industryAccordionCollection: { items: [] } }] } } } });
			}
			if (body.query.includes('query Maps')) {
				req.alias = 'map';
				return req.reply({ statusCode: 200, body: { data: { careerMap: { title: 'Production Operations', sys: { id: 'map-prod' }, learnMoreBoxes: [], pathways: { items: [{ sys: { id: 'path-prod' }, title: 'Production', occupationsCollection: { items: [ { sys: { id: 'occ-asm' }, title: 'Assembler', shortTitle: null, level: 1, salaryRangeStart: null, salaryRangeEnd: null, educationLevel: null }, { sys: { id: 'occ-sr-asm' }, title: 'Senior Assembler', shortTitle: null, level: 2, salaryRangeStart: null, salaryRangeEnd: null, educationLevel: null } ] } }] } } } } });
			}
			if (body.query.includes('query Occupation')) {
				req.alias = 'occupation';
				const occId = body.variables?.id;
				const title = occId === 'occ-sr-asm' ? 'Senior Assembler' : 'Assembler';
				return req.reply({ statusCode: 200, body: { data: { careerMapObject: { sys: { id: occId }, title } } } });
			}
		});
	});

	it('updates URL & details on single click', () => {
		cy.visit('/career-pathways/manufacturing');
		// Wait until auto-select applied (URL updated) and first occupation node present
		cy.location('search', { timeout: 10000 }).should('match', /\?field=production&occupation=assembler$/);
		cy.get('[data-testid="occupation-node-assembler"]', { timeout: 10000 }).should('exist');
		// Perform selection of second occupation
		cy.get('[data-testid="occupation-node-senior-assembler"]', { timeout: 10000 }).click();
		// URL should update to new occupation slug
		cy.location('search', { timeout: 10000 }).should('match', /\?field=production&occupation=senior-assembler$/);
	});
});
