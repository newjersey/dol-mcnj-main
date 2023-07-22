describe("Support Resources Page", () => {
  it("is accessible", () => {
    cy.visit("/support-resources");
    cy.injectAxe();

    cy.contains("Browse support and assistance resources by category.").should("exist");
    cy.checkA11y();
  });
});
