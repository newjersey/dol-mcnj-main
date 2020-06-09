describe('The Home Page', () => {
  it('displays list of program titles', () => {
    cy.visit('/');
    cy.contains("Automated Office Systems Processor").should('exist');
    cy.contains("Human Resources Professional with Payroll Practice and Management-(online)").should('exist');
  })
});