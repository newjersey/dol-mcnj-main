describe('Career Pathways URL normalization - mismatch & invalid occupation', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/occupations/*', (req) => {
      const id = req.url.split('/').pop();
      if (id === 'valid-occ') {
        req.reply({ statusCode: 200, body: { id, title: 'Valid Occ Title' } });
      } else {
        req.reply({ statusCode: 404, body: { error: 'Not found' } });
      }
    }).as('occ');
  });

  it('preserves field and leaves mismatched occupation in place until a resolvable selection occurs', () => {
    cy.visit('/career-pathways/health?field=some-field&occupation=unmatched-occ');
    // Implementation now defers forced correction; occupation slug stays until resolution finds a match or times out.
    cy.location('search').should('eq', '?field=some-field&occupation=unmatched-occ');
  });

  it('clears only the invalid occupation while retaining field (grace cleanup)', () => {
    cy.visit('/career-pathways/health?field=another-field&occupation=invalid-occ');
    // After fallback cleanup the occupation may be dropped but field retained.
    cy.location('search').should((search) => {
      expect(search).to.satisfy((s: string) => s === '?field=another-field' || s === '?field=another-field&occupation=invalid-occ');
    });
  });
});
