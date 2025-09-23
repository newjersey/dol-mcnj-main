describe('Career Pathways navigation & URL ordering', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/occupations/*', (req) => {
      const id = req.url.split('/').pop();
      req.reply({
        statusCode: 200,
        body: { id, title: 'Sample Occupation Title' }
      });
    }).as('getOccupation');
  });

  it('keeps indemand param if not resolved (no occupation param)', () => {
    cy.visit('/career-pathways/health?indemand=999');
    cy.location('search').should('eq', '?indemand=999');
  });

  it('migrates indemand to occupation when resolvable', () => {
    cy.visit('/career-pathways/health?indemand=123');
    cy.wait('@getOccupation');
    // After client normalization, should include occupation param (slugified)
    cy.location('search').should((search) => {
      expect(search).to.match(/occupation=sample-occupation-title$/);
      expect(search).not.to.contain('indemand=');
    });
  });

  it('orders params with field first then occupation', () => {
    // Pre-seed location with out-of-order params
    cy.visit('/career-pathways/health?occupation=sample-occupation-title&field=some-field');
    cy.location('search').should('eq', '?field=some-field&occupation=sample-occupation-title');
  });

  it('normalizes uppercase and spaced occupation to slug', () => {
    cy.visit('/career-pathways/health?occupation=Sample%20Occupation%20Title');
    cy.location('search').should('eq', '?occupation=sample-occupation-title');
  });

  it('drops unknown params while preserving valid ones', () => {
    cy.visit('/career-pathways/health?foo=bar&field=test-field&occupation=sample-occupation-title');
    cy.location('search').should('eq', '?field=test-field&occupation=sample-occupation-title');
  });

  it('replaces indemand with occupation only when resolvable (simulated)', () => {
    cy.intercept('GET', '/api/occupations/321', {
      statusCode: 200,
      body: { id: '321', title: 'Resolvable Occupation' }
    }).as('resolvableOcc');
    cy.visit('/career-pathways/health?indemand=321');
    cy.wait('@resolvableOcc');
    cy.location('search').should('eq', '?occupation=resolvable-occupation');
  });

  it('keeps indemand when not resolvable then migrates after manual occupation change', () => {
    cy.visit('/career-pathways/health?indemand=999');
    cy.location('search').should('eq', '?indemand=999');
    // Simulate user navigation by directly visiting occupation param
    cy.visit('/career-pathways/health?field=test-field&occupation=some-job');
    cy.location('search').should('eq', '?field=test-field&occupation=some-job');
  });
});