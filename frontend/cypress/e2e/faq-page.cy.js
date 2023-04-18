describe("FAQ Page", () => {
  it("is accessible", () => {
    cy.visit("/faq");
    cy.injectAxe();

    cy.contains("Get answers to all of your NJ Career Central questions").should("exist");
    cy.checkA11y();
  });
});
