describe("Not Found Page", () => {
  it("404s on bad routes", () => {
    cy.visit("/badroute");
    cy.injectAxe();

    cy.contains("We're sorry, we can't find the page you're looking for.").should("exist");

    cy.checkA11y();
  });

  /*  it("404s on failed training lookups", () => {
    cy.visit("/training/not-a-valid-id");
    cy.contains("Training not found").should("exist");
  });*/
});
