describe('The Home Page', () => {
  it('pongs from the server', () => {
    cy.visit('/');
    cy.contains("pong").should('exist');
  })
});