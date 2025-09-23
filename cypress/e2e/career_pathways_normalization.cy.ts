describe('Career Pathways URL normalization - mismatch & invalid occupation', () => {
  beforeEach(() => {
    // Stub occupation API used during resolution
    cy.intercept('GET', '/api/occupations/*', (req) => {
      const id = req.url.split('/').pop();
      // Return a basic title if id matches pattern we expect; else 404 to simulate invalid
      if (id === 'valid-occ-id') {
        req.reply({ statusCode: 200, body: { id, title: 'Valid Occ Title' } });
      } else if (id === 'welder-id') {
        req.reply({ statusCode: 200, body: { id, title: 'Welder' } });
      } else {
        req.reply({ statusCode: 404, body: { error: 'Not found' } });
      }
    }).as('occupationApi');
  });

  it('adjusts occupation to match existing field when mismatch occurs', () => {
    // Starting with a field param plus a conflicting occupation param.
    // Expectation: keep ?field=preserved-field and replace occupation with first occupation in that field's pathway.
    cy.visit('/career-pathways/health?field=preserved-field&occupation=welder');
    cy.location('search').should((search) => {
      expect(search).to.match(/\?field=preserved-field&occupation=/);
      expect(search).not.to.contain('occupation=welder');
    });
  });

  it('removes invalid occupation & stale field params', () => {
    cy.visit('/career-pathways/health?field=some-field&occupation=totally-invalid-slug');
    // URL should be cleaned (params removed) after effect runs
    cy.location('search').should('eq', '');
  });
});
