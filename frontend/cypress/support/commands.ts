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

import 'cypress-axe';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      navHasOneActiveLink(navId: string): Chainable<Subject>;
      shouldBeVisible(selector: string, isVisible: boolean): Chainable<Subject>;
      shouldBeActive(selector: string, isActive: boolean): Chainable<Subject>;
    }
  }
}

function terminalLog(violations: any) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`
  )
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    // @ts-ignore
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
  cy.checkA11y(undefined, undefined, terminalLog);
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
