describe("Training Explorer Page", () => {
  it("is accessible", () => {
    cy.visit("/training");
    cy.injectAxe();

    cy.contains("Search for Training").should("exist");
    cy.checkA11y();
  });
});
