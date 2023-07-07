describe("Career Support Page", () => {
  it("is accessible", () => {
    cy.visit("/support-resources/career-support");
    cy.injectAxe();
    cy.contains("Career Guidance, Job Search Help, and Re-entering the Workforce").should("exist");
    cy.checkA11y(null, null, (violations) => {
      cy.task('log', 'Accessibility violations found:');
      cy.task('table', violations);
    });
  });
});