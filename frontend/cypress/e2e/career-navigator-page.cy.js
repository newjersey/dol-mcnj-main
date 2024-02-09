xdescribe("Career Navigator Page", () => {
  it("is accessible", () => {
    cy.visit("/navigator");
    cy.injectAxe();

    cy.contains("Learn how to enter and advance a career in key NJ industries.").should("exist");
    cy.checkA11y();
  });
});
