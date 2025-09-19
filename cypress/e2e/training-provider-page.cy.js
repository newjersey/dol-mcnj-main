describe("Training Provider Resources Page", () => {
  it("is accessible", () => {
    cy.visit("/training-provider-resources");
    cy.injectAxe();

    cy.contains("Training provider data collection, ETPL, and quality assurance guidance").should(
      "exist",
    );
    cy.checkA11y();
  });
});
