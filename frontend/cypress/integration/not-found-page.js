describe('Not Found Page', () => {
  it('404s on bad routes', () => {
    cy.visit('/badroute');
    cy.injectAxe();

    cy.contains('Sorry, we can\'t seem to find that page').should('exist');

    cy.checkA11y();
  });

  it('404s on failed training lookups', () => {
    cy.visit('/training/not-a-valid-id');
    cy.contains('Sorry, we can\'t seem to find that page').should('exist');
  })
});