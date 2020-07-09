describe('Search', () => {
  it('searches from the homepage', () => {
    // on homepage
    cy.visit('/');
    cy.contains('Search for Training').should('exist');

    // input search
    cy.get('input').type('baker');
    cy.get('button').contains('Search').click();

    // on search results page
    cy.location('pathname').should('eq', '/search/baker');
    cy.get('input').should('have.value', 'baker');

    // matches by title
    cy.contains('Baking and Pastry Professional').should('exist');

    // matches by title but is suspended
    cy.contains('Art of International Bread Baking').should('not.exist');

    // matches by description
    cy.contains('Pastry Arts Academic Credit Certificate').should('exist');
  });

  it('searches from the search results page', () => {
    // on results page
    cy.visit('/search');

    // displays all programs
    cy.contains("Automated Office Systems Processor").should('exist');
    cy.contains("$7,570.00").should('exist');
    cy.contains("--").should("exist");
    cy.contains("Clifton").should("exist");

    cy.contains("Skincare").should('exist');
    cy.contains("$14,119.00").should('exist');
    cy.contains("71.4%").should('exist');
    cy.contains("Ocean Township").should('exist');

    // input search
    cy.get('input').type('baker');
    cy.get('button').contains('Search').click();

    cy.location('pathname').should('eq', '/search/baker');

    // matches by title
    cy.contains('Baking and Pastry Professional').should('exist');

    // matches by title but is suspended
    cy.contains('Art of International Bread Baking').should('not.exist');

    // matches by description
    cy.contains('Pastry Arts Academic Credit Certificate').should('exist');

    // removes others
    cy.contains('Automated Office Systems Processor').should('not.exist');
  })

  it('links back to home page', () => {
    cy.visit('/search');
    cy.contains('Training Explorer').click();
    cy.location('pathname').should('eq', '/');
  });
});