describe("Filtering", () => {
  it("filters by max cost", () => {
    cy.visit("/search/baking");
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('7 results found for "baking"').should("exist");

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
    cy.contains('7 results found for "baking"').should("exist");
  });

  it("filters by training length", () => {
    cy.visit("/search/baking");
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('7 results found for "baking"').should("exist");

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
    cy.visit("/search/digital%20marketing");
    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Rutgers Virtual Mini MBA: Digital Marketing").should("exist");
    cy.contains('23 results found for "digital marketing"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').check();
    });

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Rutgers Virtual Mini MBA: Digital Marketing").should("not.exist");
    cy.contains('18 results found for "digital marketing"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').uncheck();
    });

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="online"]').check();
    });

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("not.exist");
    cy.contains("Rutgers Virtual Mini MBA: Digital Marketing").should("exist");
    cy.contains('5 results found for "digital marketing"').should("exist");
  });

  it("filters by location", () => {
    cy.visit("/search/baking");
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('7 results found for "baking"').should("exist");

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
    cy.contains('7 results found for "baking"').should("exist");
  });

  it("filters by In-Demand Only", () => {
    cy.visit("/search/catering");
    cy.contains("Food Service Skills Training").should("exist");
    cy.contains("Catering Management").should("exist");
    cy.contains('11 results found for "catering"').should("exist");

    cy.get('input[name="inDemandOnly"]').check();

    cy.contains("Food Service Skills Training").should("not.exist");
    cy.contains("Catering Management").should("exist");
    cy.contains('8 results found for "catering"').should("exist");

    cy.get('input[name="inDemandOnly"]').uncheck();

    cy.contains("Food Service Skills Training").should("exist");
    cy.contains("Catering Management").should("exist");
    cy.contains('11 results found for "catering"').should("exist");
  });

  it("sorts by cost high to low", () => {
    cy.visit("/search/baking");
    cy.get("select").select("Cost: High to Low");

    const costsOrder = [
      "$33,553.00",
      "$33,553.00",
      "20,839.00",
      "20,839.00",
      "7,400.00",
      "$3,004.00",
      "$1,475.00",
    ];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(costsOrder[index]);
    });
  });

  it("sorts by cost low to high", () => {
    cy.visit("/search/baking");
    cy.get("select").select("Cost: Low to High");

    const costsOrder = [
      "$1,475.00",
      "$3,004.00",
      "7,400.00",
      "20,839.00",
      "20,839.00",
      "$33,553.00",
      "$33,553.00",
    ];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(costsOrder[index]);
    });
  });

  it("sorts by employment rate", () => {
    cy.visit("/search/catering");
    cy.get("select").select("Employment Rate");

    const ratesOrder = [
      "30.0% employed",
      "30.0% employed",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
    ];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(ratesOrder[index]);
    });
  });

  it("preserves sort order between pages", () => {
    cy.visit("/search/baking");

    cy.get(".card")
      .first()
      .within(() => {
        cy.contains(
          "Culinary & Baking Opportunity Program for Adults with Developmental Disabilities"
        ).should("exist");
      });

    cy.get("select").select("Cost: High to Low");

    cy.get(".card")
      .first()
      .within(() => {
        cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
      });

    // get card with unique text
    cy.get(".card .no-link-format").eq(4).click({ force: true });
    cy.location("pathname").should("eq", "/training/43970");
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
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").type("5000");
      cy.get("input").blur();
    });

    cy.contains("Culinary & Baking Opportunity").click({ force: true });
    cy.location("pathname").should("eq", "/training/48865");
    cy.go("back");

    cy.contains("Baking & Pastry Option, Culinary Arts").should("not.exist");
    cy.contains("Max Cost").within(() => {
      cy.get("input").should("have.value", "5000");
    });
  });
});
