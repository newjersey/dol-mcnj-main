describe("Support Resources Page", () => {
  it("is accessible", () => {
    cy.visit("/support-resources");
    cy.injectAxe();

    cy.contains(
      "Helpful links to programs, resources, and services beyond My Career NJ"
    ).should("exist");
    cy.checkA11y();
  });
});
