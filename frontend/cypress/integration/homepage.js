describe('The Home Page', () => {
  it('displays list of program titles', () => {
    cy.visit('/');
    cy.contains("Automated Office Systems Processor").should('exist');
    cy.contains("$7,570.00").should('exist');

    cy.contains("Skincare").should('exist');
    cy.contains("$14,119.00").should('exist');
  })
});