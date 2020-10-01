describe("Filtering", () => {
  it("filters by max cost", () => {
    cy.visit("/search/baker");
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('5 results found for "baker"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").type("5000");
      cy.get("input").blur();
    });

    cy.contains("Baking & Pastry Option, Culinary Arts").should("not.exist");
    cy.contains('3 results found for "baker"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").clear();
      cy.get("input").blur();
    });

    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('5 results found for "baker"').should("exist");
  });

  it("filters by training length", () => {
    cy.visit("/search/baker");
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('5 results found for "baker"').should("exist");

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
    cy.contains("Management Training").should("exist");
    cy.contains('11 results found for "internet marketing"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').check();
    });

    cy.contains("Certified Global Business Professional").should("exist");
    cy.contains("Management Training").should("not.exist");
    cy.contains('8 results found for "internet marketing"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').uncheck();
    });

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="online"]').check();
    });

    cy.contains("Certified Global Business Professional").should("not.exist");
    cy.contains("Management Training").should("exist");
    cy.contains('3 results found for "internet marketing"').should("exist");
  });

  it("filters by location", () => {
    cy.visit("/search/baker");
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('5 results found for "baker"').should("exist");

    cy.get('input[aria-label="Miles"]').type("5");
    cy.get('input[aria-label="Miles"]').blur();

    cy.get('input[aria-label="Zip Code"]').type("08012");
    cy.get('input[aria-label="Zip Code"]').blur();

    cy.contains("Baking & Pastry Option, Culinary Arts").should("not.exist");
    cy.contains("Baking and Pastry").should("exist");
    cy.contains('1 result found for "baker"').should("exist");

    cy.get('input[aria-label="Miles"]').clear();
    cy.get('input[aria-label="Miles"]').blur();

    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('5 results found for "baker"').should("exist");
  });

  it("filters by funding eligible", () => {
    cy.visit("/search/catering");
    cy.contains("Food Service Skills Training").should("exist");
    cy.contains("Catering Management").should("exist");
    cy.contains('16 results found for "catering"').should("exist");

    cy.get('input[name="fundingEligibleOnly"]').check();

    cy.contains("Food Service Skills Training").should("not.exist");
    cy.contains("Catering Management").should("exist");
    cy.contains('9 results found for "catering"').should("exist");

    cy.get('input[name="fundingEligibleOnly"]').uncheck();

    cy.contains("Food Service Skills Training").should("exist");
    cy.contains("Catering Management").should("exist");
    cy.contains('16 results found for "catering"').should("exist");
  });

  it("preserves a filter between pages", () => {
    cy.visit("/search/baker");
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").type("5000");
      cy.get("input").blur();
    });

    cy.contains("Baking for Beginners").click({ force: true });
    cy.location("pathname").should("eq", "/training/49248");
    cy.go("back");

    cy.contains("Baking & Pastry Option, Culinary Arts").should("not.exist");
    cy.contains("Max Cost").within(() => {
      cy.get("input").should("have.value", "5000");
    });
  });
});
