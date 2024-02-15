describe("FAQ Page", () => {
  it("is accessible", () => {
    cy.visit("/faq");
    cy.injectAxe();

    cy.contains("Get answers to all of your NJ Career Central questions").should("exist");
    cy.checkA11y();
  });

  it("opens the Training Explorer section on the FAQ page", () => {
    cy.visit("/faq");
    cy.url().should("include", "#training");
    cy.contains("Tuition Assistance for Training").should("exist");
    cy.contains("Tuition Assistance for Training").should("exist");
  });
});
