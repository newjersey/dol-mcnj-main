describe('Search', () => {
  it('searches for matches in title and description', () => {
    cy.visit('/');
    cy.get('input').type('microsystem');
    cy.get('button').contains('Search').click();

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