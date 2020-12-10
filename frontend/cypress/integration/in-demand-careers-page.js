describe("In Demand Careers page", () => {
  it("displays in demand careers", () => {
    cy.visit("/");
    cy.contains("View Occupations").click();

    cy.location("pathname").should("eq", "/in-demand-careers");

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

  it("links to occupation page from list or from search", () => {
    cy.visit("/");
    cy.contains("View Occupations").click();

    cy.contains("Computer and Mathematical").click();
    cy.contains("Web Developers").click();
    cy.location("pathname").should("eq", "/occupation/15-1254");

    cy.visit("/");
    cy.contains("View Occupations").click();

    cy.get('input[aria-label="occupation-search"]').type("web");
    cy.contains("Web Developers").click();
    cy.location("pathname").should("eq", "/occupation/15-1254");
  });
});
