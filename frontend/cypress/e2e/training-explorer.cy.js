describe("Training Explorer Page", () => {
  it("is accessible", () => {
    cy.visit("/training");
    cy.injectAxe();

    cy.contains("Search by job, training program, and more to find a training that works for you.").should(
      "exist",
    );
    cy.checkA11y();
  });
});
