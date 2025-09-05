describe("Not Found Page", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (err) => {
      if (err.message.includes("NEXT_NOT_FOUND")) {
        return false;
      }
      return true;
    });
  });

  it("404s on bad routes", () => {
    cy.visit("/bad-route", { failOnStatusCode: false });
    cy.request({ url: "/bad-route", failOnStatusCode: false })
      .its("status")
      .should("equal", 404);
    cy.visit("/bad-route", { failOnStatusCode: false });
    cy.contains("Sorry, we can't seem to find that page").should("exist");
  });

  it("404s on failed training lookups", () => {
    cy.visit("/training/not-a-valid-id", { failOnStatusCode: false });
    cy.request({ url: "/training/not-a-valid-id", failOnStatusCode: false })
      .its("status")
      .should("equal", 404);
    cy.visit("/training/not-a-valid-id", { failOnStatusCode: false });
    cy.contains("Training not found").should("exist");
  });

  it("404s on failed occupation lookups", () => {
    cy.visit("/occupation/not-a-valid-id", { failOnStatusCode: false });
    cy.request({ url: "/occupation/not-a-valid-id", failOnStatusCode: false })
      .its("status")
      .should("equal", 404);
    cy.visit("/occupation/not-a-valid-id", { failOnStatusCode: false });
    cy.contains("Occupation not found").should("exist");
  });
});
