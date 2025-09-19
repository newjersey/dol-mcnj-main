describe("Career Support Page", () => {
  it("is accessible", () => {
    cy.visit("/support-resources/career-support");
    cy.injectAxe();
    cy.contains(
      "Planning your future is hard when you don’t know where to start",
    ).should("exist");
    cy.checkA11y();
  });
});
