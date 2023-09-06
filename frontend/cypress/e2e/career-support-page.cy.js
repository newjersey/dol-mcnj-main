describe("Career Support Page", () => {
  it("is accessible", () => {
    cy.visit("/support-resources/career-support");
    cy.injectAxe();
    cy.contains("Career Guidance, Job Search Help, and Re-entering the Workforce").should("exist");
    cy.checkA11y(null, null, (violations) => {
      cy.task("log", "Accessibility violations found:").then((result) => {
        assert.isNotNull(result, "Task log should have been called");
      });
      cy.task("table", violations).then((result) => {
        assert.isNotNull(result, "Task table should have been called");
      });
      assert.equal(violations.length, 0, "No accessibility violations should be detected");
    });
  });
});
