describe('Not Found Page', () => {
  it('404s on bad routes', () => {
    cy.visit('/badroute');
    cy.contains('Sorry, we can\'t seem to find that page').should('exist');
  });

  it('404s on failed training lookups', () => {
    cy.visit('/training/not-a-valid-id');
    cy.contains('Sorry, we can\'t seem to find that page').should('exist');
  })
});