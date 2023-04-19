describe("Tuition Assistance Resources Page", () => {
  it("is accessible", () => {
    cy.visit("/tuition-assistance");
    cy.injectAxe();

    cy.contains(
      "There are numerous resources for New Jerseyans seeking financial assistance for education and training."
    ).should("exist");
    cy.checkA11y();
  });
});
