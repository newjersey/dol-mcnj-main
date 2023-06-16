describe("Home Page", () => {
  it("is accessible", () => {
    cy.visit("/");
    cy.injectAxe();

    cy.contains(
      "Your home for career exploration, job training, and workforce support tools and resources."
    ).should("exist");
    cy.checkA11y();
  });
});
