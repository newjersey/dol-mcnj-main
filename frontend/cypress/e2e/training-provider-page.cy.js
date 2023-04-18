describe("Training Provider Resources Page", () => {
  it("is accessible", () => {
    cy.visit("/training-provider-resources");
    cy.injectAxe();

    cy.contains(
      "As a training program provider, you may have questions about data collection requirements"
    ).should("exist");
    cy.checkA11y();
  });
});
