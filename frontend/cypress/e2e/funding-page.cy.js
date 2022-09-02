describe("Funding Page", () => {
  it("is accessible", () => {
    cy.visit("/funding");
    cy.injectAxe();

    cy.contains("Ways to Fund Your Training in New Jersey").should("exist");
    cy.checkA11y();
  });
});
