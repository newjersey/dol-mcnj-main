describe("In Demand Occupations page", () => {
  it("displays in demand occupations", () => {
    cy.visit("/in-demand-occupations");
    cy.location("pathname").should("eq", "/in-demand-occupations");

    cy.injectAxe();

    cy.contains("Business and Financial Operations").should("exist");
    cy.contains("Compliance Officers").should("not.exist");
    cy.contains("Cost Estimators").should("not.exist");

    cy.contains("Business and Financial Operations").click();

    cy.contains("Business and Financial Operations").should("exist");
    cy.contains("Compliance Officers").should("exist");
    cy.contains("Cost Estimators").should("exist");

    cy.checkA11y();
  });

  it("links to occupation page from list", () => {
    cy.visit("/in-demand-occupations");

    cy.contains("Computer and Mathematical").click();
    cy.contains("Web Developers").click({ force: true });
    cy.location("pathname").should("eq", "/occupation/15-1254");
  });

  it("links to occupation page from search", () => {
    cy.visit("/in-demand-occupations");

    cy.get('input[aria-label="occupation-search"]').type("web");
    cy.contains("Web Developers").click({ force: true });
    cy.location("pathname").should("eq", "/occupation/15-1254");
  });
});
