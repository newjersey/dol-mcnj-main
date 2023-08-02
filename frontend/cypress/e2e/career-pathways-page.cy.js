describe("Career Pathways Page", () => {
  it("is accessible", () => {
    cy.visit("/career-pathways");
    cy.injectAxe();

    cy.contains("Explore popular industries and careers in the state of New Jersey.").should(
      "exist"
    );
    cy.checkA11y();
  });

  it("is accessible", () => {
    cy.visit("/career-pathways/healthcare");
    cy.injectAxe();

    cy.contains("Select an Industry").should("exist");
    cy.checkA11y();
  });
});
