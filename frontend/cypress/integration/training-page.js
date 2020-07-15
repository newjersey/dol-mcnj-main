describe('Training Page', () => {
  it('displays training details', () => {
    cy.visit('/training/61');
    cy.contains('Welding Technology/ Welder').should('exist');
    cy.contains('www.mcts.edu').should('exist');
    cy.contains('13 months to 2 years to complete').should('exist');
  });
});