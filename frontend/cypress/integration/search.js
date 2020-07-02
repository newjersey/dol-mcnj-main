describe('Search', () => {
  it('searches from the homepage', () => {
    // on homepage
    cy.visit('/');
    cy.contains('Search for Training').should('exist');

    // input search
    cy.get('input').type('microsystem');
    cy.get('button').contains('Search').click();

    // on search results page
    cy.location('pathname').should('eq', '/search/microsystem');
    cy.get('input').should('have.value', 'microsystem');

    // matches by title
    cy.contains('Sun Microsystems Solaris 9: Basic System Admin I & II-online').should('exist');
    cy.contains('Sun Microsystems Solaris 9:Admin I and II').should('exist');

    // matches by description
    cy.contains('Java Programming').should('exist');
    cy.contains('Web Programmer Certification').should('exist');
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
    cy.get('input').type('microsystem');
    cy.get('button').contains('Search').click();

    cy.location('pathname').should('eq', '/search/microsystem');

    // matches by title
    cy.contains('Sun Microsystems Solaris 9: Basic System Admin I & II-online').should('exist');
    cy.contains('Sun Microsystems Solaris 9:Admin I and II').should('exist');

    // matches by description
    cy.contains('Java Programming').should('exist');
    cy.contains('Web Programmer Certification').should('exist');

    // removes others
    cy.contains('Patient Care Technician Program').should('not.exist');
  })
});