describe("Filtering", () => {
  it("filters by max cost", () => {
    cy.visit("/search/baking");
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('5 results found for "baking"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").type("5000");
      cy.get("input").blur();
    });

    cy.contains("Baking & Pastry Option, Culinary Arts").should("not.exist");
    cy.contains('2 results found for "baking"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").clear();
      cy.get("input").blur();
    });

    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('5 results found for "baking"').should("exist");
  });

  it("filters by training length", () => {
    cy.visit("/search/baking");
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('5 results found for "baking"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="days"]').check();
    });

    cy.contains("Culinary Arts").should("not.exist");
    cy.contains('0 results found for "baking"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="weeks"]').check();
    });

    cy.contains("Culinary Arts").should("exist");
    cy.contains('1 result found for "baking"').should("exist");
  });

  it("filters by class format", () => {
    cy.visit("/search/web%20design");

    cy.contains("Web Design Professional Series").should("exist");
    cy.contains("Computer Software Applications Specialist").should("exist");
    cy.contains('32 results found for "web design"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').check();
    });

    cy.contains("Web Design Professional Series").should("exist");
    cy.contains("Computer Software Applications Specialist").should("not.exist");
    cy.contains('27 results found for "web design"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').uncheck();
    });

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="online"]').check();
    });

    cy.contains("Web Design Professional Series").should("not.exist");
    cy.contains("Computer Software Applications Specialist").should("exist");
    cy.contains('5 results found for "web design"').should("exist");
  });

  it("filters by location", () => {
    cy.visit("/search/baking");
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('5 results found for "baking"').should("exist");

    cy.get('input[aria-label="Miles"]').type("5");
    cy.get('input[aria-label="Miles"]').blur();

    cy.get('input[aria-label="Zip Code"]').type("08012");
    cy.get('input[aria-label="Zip Code"]').blur();

    cy.contains("Baking & Pastry Option, Culinary Arts").should("not.exist");
    cy.contains("Culinary Arts").should("exist");
    cy.contains('1 result found for "baking"').should("exist");

    cy.get('input[aria-label="Miles"]').clear();
    cy.get('input[aria-label="Miles"]').blur();

    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('5 results found for "baking"').should("exist");
  });

  it("filters by In-Demand Only", () => {
    cy.visit("/search/baking");
    cy.contains("Baking & Pastry , Culinary Arts").should("exist");
    cy.contains("Baking Technician").should("exist");
    cy.contains('5 results found for "baking"').should("exist");

    cy.get('input[name="inDemandOnly"]').check();

    cy.contains("Baking Technician").should("not.exist");
    cy.contains("Baking & Pastry , Culinary Arts").should("exist");
    cy.contains('3 results found for "baking"').should("exist");

    cy.get('input[name="inDemandOnly"]').uncheck();

    cy.contains("Baking & Pastry , Culinary Arts").should("exist");
    cy.contains("Baking Technician").should("exist");
    cy.contains('5 results found for "baking"').should("exist");
  });

  it("sorts by cost high to low", () => {
    cy.visit("/search/baking");
    cy.get("select").select("Cost: High to Low");

    const costsOrder = ["$33,553.00", "$20,839.00", "$7,400.00", "$4,438.00", "$1,475.00"];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(costsOrder[index]);
    });
  });

  it("sorts by cost low to high", () => {
    cy.visit("/search/baking");
    cy.get("select").select("Cost: Low to High");

    const costsOrder = ["$1,475.00", "$4,438.00", "$7,400.00", "$20,839.00", "$33,553.00"];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(costsOrder[index]);
    });
  });

  it("sorts by employment rate", () => {
    cy.visit("/search/painting");
    cy.get("select").select("Employment Rate");

    const ratesOrder = ["12.6% employed", "--", "--", "--", "--", "--", "--"];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(ratesOrder[index]);
    });
  });

  it("preserves sort order between pages", () => {
    cy.visit("/search/baking");

    cy.get(".card")
      .first()
      .within(() => {
        cy.contains("Baking & Pastry , Culinary Arts").should("exist");
      });

    cy.get("select").select("Cost: High to Low");

    cy.get(".card")
      .first()
      .within(() => {
        cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
      });

    // get card with unique text
    cy.get(".card .no-link-format").eq(3).click({ force: true });
    cy.location("pathname").should("eq", "/training/48472");
    cy.go("back");

    cy.get(".card")
      .first()
      .within(() => {
        cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
      });

    cy.contains("Cost: High to Low").should("exist");
  });

  it("preserves a filter between pages", () => {
    cy.visit("/search/baking");
    cy.contains("Culinary Arts").should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").type("5000");
      cy.get("input").blur();
    });

    cy.contains("Baking Technician").click({ force: true });
    cy.location("pathname").should("eq", "/training/48472");
    cy.go("back");

    cy.contains("Baking & Pastry , Culinary Arts").should("not.exist");
    cy.contains("Max Cost").within(() => {
      cy.get("input").should("have.value", "5000");
    });
  });
});
