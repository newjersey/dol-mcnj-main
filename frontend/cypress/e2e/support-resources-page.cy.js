describe("Support Resources Page", () => {
  it("is accessible", () => {
    cy.visit("/support-resources");
    cy.injectAxe();

    cy.contains("Helpful links to programs, resources, and services beyond My Career NJ").should(
      "exist",
    );
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.checkA11y();
  });
});
