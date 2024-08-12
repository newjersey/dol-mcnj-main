// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import '@testing-library/cypress/add-commands';

function terminalLog(violations) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`
  )
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length
    })
  )

  cy.task('table', violationData)
};

Cypress.Commands.add("checkA11y", () => {
  cy.checkA11y(null, null, terminalLog);
});

Cypress.Commands.add("shouldBeVisible", (selector, isVisible) => {
  const visibility = isVisible ? "exist" : "not.exist";
  cy.get(`${selector}`).should(visibility);
});

Cypress.Commands.add("shouldBeActive", (selector, isActive) => {
  const hasClass = isActive ? "have.class" : "not.have.class";
  cy.get(`${selector}`).should(hasClass, "active");
})

Cypress.Commands.add("navHasOneActiveLink", (navId) => {
  cy.get(navId).within(() => {
    cy.get('.active-link').should('have.length', 1);
  })
})

Cypress.Commands.add('typeSpecialCharacters', (selector, text) => {
    cy.get(selector).clear(); // Clear the input first.
    cy.wait(500);
    Array.from(text).forEach((char) => {
        // Type each character. Even if not returning a chainable from this command,
        // the internal use of cy.get() and cy.type() ensures correct execution order.
        cy.get(selector).type(char, { delay: 200 });
    });
    // No need to explicitly return a Chainable object here
});
