describe("FAQ Page", () => {
  it("is accessible", () => {
    cy.visit("/faq");
    cy.injectAxe();

    // TODO add My Career NJ back in after the content has been updated in Contentful

    cy.contains("Get answers to all of your").should("exist");
    cy.checkA11y();
  });
});
