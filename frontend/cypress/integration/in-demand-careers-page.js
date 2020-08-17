describe('In Demand Careers page', () => {
  it('displays in demand careers', () => {
    cy.visit('/');
    cy.contains('in-demand careers').click();

    cy.location('pathname').should('eq', '/in-demand-careers');

    cy.injectAxe();

    cy.contains('Compliance Officers').should('exist');
    cy.contains('Cost Estimators').should('exist');

    cy.checkA11y();
  });
});