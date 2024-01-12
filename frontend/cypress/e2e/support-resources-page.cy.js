describe("Support Resources Page", () => {
  it("is accessible", () => {
    cy.visit("/support-resources");
    cy.injectAxe();

    cy.contains("Browse support and assistance resources by category.").should("exist");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.checkA11y();
  });
});
