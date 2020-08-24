describe("Filtering", () => {
  it("filters by max cost", () => {
    cy.visit("/search/baker");
    cy.contains("Pastry Arts Academic Credit Certificate").should("exist");
    cy.contains('7 results found for "baker"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").type("5000");
      cy.get("input").blur();
    });

    cy.contains("Pastry Arts Academic Credit Certificate").should("not.exist");
    cy.contains('3 results found for "baker"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").clear();
      cy.get("input").blur();
    });

    cy.contains("Pastry Arts Academic Credit Certificate").should("exist");
    cy.contains('7 results found for "baker"').should("exist");
  });

  it("filters by employment outcomes", () => {
    cy.visit("/search/baker");
    cy.contains("Baking and Pastry Arts").should("exist");
    cy.contains('7 results found for "baker"').should("exist");

    cy.contains("Employment Rate").within(() => {
      cy.get('[type="checkbox"][name="best"]').check();
    });

    cy.contains("Baking and Pastry Arts").should("not.exist");
    cy.contains('0 results found for "baker"').should("exist");

    cy.contains("Employment Rate").within(() => {
      cy.get('[type="checkbox"][name="medium"]').check();
    });

    cy.contains("Baking and Pastry Arts").should("exist");
    cy.contains('3 results found for "baker"').should("exist");
  });

  it("filters by training length", () => {
    cy.visit("/search/baker");
    cy.contains("Baking and Pastry Arts").should("exist");
    cy.contains('7 results found for "baker"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="days"]').check();
    });

    cy.contains("Baking for Beginners").should("not.exist");
    cy.contains('0 results found for "baker"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="weeks"]').check();
    });

    cy.contains("Baking for Beginners").should("exist");
    cy.contains('1 result found for "baker"').should("exist");
  });

  it("filters by class format", () => {
    cy.visit("/search/internet%20marketing");
    cy.contains("Certified Global Business Professional").should("exist");
    cy.contains("Management Training - online").should("exist");
    cy.contains('8 results found for "internet marketing"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').check();
    });

    cy.contains("Certified Global Business Professional").should("exist");
    cy.contains("Management Training - online").should("not.exist");
    cy.contains('6 results found for "internet marketing"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').uncheck();
    });

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="online"]').check();
    });

    cy.contains("Certified Global Business Professional").should("not.exist");
    cy.contains("Management Training - online").should("exist");
    cy.contains('2 results found for "internet marketing"').should("exist");
  });

  it("filters by location", () => {
    cy.visit("/search/baker");
    cy.contains("Pastry Arts Academic Credit Certificate").should("exist");
    cy.contains('7 results found for "baker"').should("exist");

    cy.get('input[aria-label="Miles"]').type("5");
    cy.get('input[aria-label="Miles"]').blur();

    cy.get('input[aria-label="Zip Code"]').type("08608");
    cy.get('input[aria-label="Zip Code"]').blur();

    cy.contains("Pastry Arts Academic Credit Certificate").should("not.exist");
    cy.contains("Baking Technician").should("exist");
    cy.contains('1 result found for "baker"').should("exist");

    cy.get('input[aria-label="Miles"]').clear();
    cy.get('input[aria-label="Miles"]').blur();

    cy.contains("Pastry Arts Academic Credit Certificate").should("exist");
    cy.contains('7 results found for "baker"').should("exist");
  });

  it("preserves a filter between pages", () => {
    cy.visit("/search/baker");
    cy.contains("Pastry Arts Academic Credit Certificate").should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").type("5000");
      cy.get("input").blur();
    });

    cy.contains("Baking for Beginners").click({ force: true });
    cy.location("pathname").should("eq", "/training/49248");
    cy.go("back");

    cy.contains("Pastry Arts Academic Credit Certificate").should("not.exist");
    cy.contains("Max Cost").within(() => {
      cy.get("input").should("have.value", "5000");
    });
  });
});
