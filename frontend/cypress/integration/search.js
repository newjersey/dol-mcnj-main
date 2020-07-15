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

    // displays all trainings
    cy.contains("Patient Care Technician Program").should('exist');
    cy.contains("$3,259.00").should('exist');
    cy.contains("0.0%").should("exist");
    cy.contains("Sewell").should("exist");
    cy.contains("Rowan College at Gloucester County Division of Continuing Ed - WIA Title 2").should("exist");
    cy.contains("3-5 months to complete").should("exist");

    cy.contains("Basic MIG").should('exist');
    cy.contains("$840.00").should('exist');
    cy.contains("--").should('exist');
    cy.contains("Paterson").should('exist');
    cy.contains("HoHoKus School of Trade - Customized Trainer").should('exist');
    cy.contains("1-2 days to complete").should('exist');

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
    cy.contains('Patient Care Technician Program').should('not.exist');
  });

  it('links back to home page', () => {
    cy.visit('/search');
    cy.contains('Training Explorer').click();
    cy.location('pathname').should('eq', '/');
  });

  it('links to a training detail page', () => {
    cy.visit('/search/baker');
    cy.contains('Baking and Pastry Professional').click({force: true});
    cy.location('pathname').should('eq', '/training/14146');

    // removes search results
    cy.contains('Pastry Arts Academic Credit Certificate').should('not.exist');

    // shows program
    cy.contains('Baking and Pastry Professional').should('exist');
  });
});