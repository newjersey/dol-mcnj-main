describe("Filtering", () => {
  it("filters by max cost", () => {
    cy.visit("/search/baking");
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('23 results found for "baking"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").type("5000");
      cy.get("input").blur();
    });

    cy.contains("Baking & Pastry Option, Culinary Arts").should("not.exist");
    cy.contains('14 results found for "baking"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").clear();
      cy.get("input").blur();
    });

    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('23 results found for "baking"').should("exist");
  });

  it("filters by training length", () => {
    cy.visit("/search/baking");
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('23 results found for "baking"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="days"]').check();
    });

    cy.contains("Culinary Arts").should("not.exist");
    cy.contains('0 results found for "baking"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="weeks"]').check();
    });

    cy.contains("Culinary Arts").should("exist");
    cy.contains('5 results found for "baking"').should("exist");
  });

  it("filters by class format", () => {
    cy.visit("/search/digital%20marketing");
    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Rutgers Virtual Mini MBA: Digital Marketing").should("exist");
    cy.contains('63 results found for "digital marketing"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').check();
    });

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Rutgers Virtual Mini MBA: Digital Marketing").should("not.exist");
    cy.contains('51 results found for "digital marketing"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').uncheck();
    });

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="online"]').check();
    });

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("not.exist");
    cy.contains("Rutgers Virtual Mini MBA: Digital Marketing").should("exist");
    cy.contains('12 results found for "digital marketing"').should("exist");
  });

  it("filters by location", () => {
    cy.visit("/search/baking");
    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('23 results found for "baking"').should("exist");

    cy.get('input[aria-label="Miles"]').type("5");
    cy.get('input[aria-label="Miles"]').blur();

    cy.get('input[aria-label="Zip Code"]').type("08012");
    cy.get('input[aria-label="Zip Code"]').blur();

    cy.contains("Baking & Pastry Option, Culinary Arts").should("not.exist");
    cy.contains("Culinary Arts").should("exist");
    cy.contains('6 results found for "baking"').should("exist");

    cy.get('input[aria-label="Miles"]').clear();
    cy.get('input[aria-label="Miles"]').blur();

    cy.contains("Baking & Pastry Option, Culinary Arts").should("exist");
    cy.contains('23 results found for "baking"').should("exist");
  });

  it("filters by In-Demand Only", () => {
    cy.visit("/search/baking");
    cy.contains("Baking & Pastry , Culinary Arts").should("exist");
    cy.contains(
      "Culinary & Baking Opportunity Program for Adults with Developmental Disabilities"
    ).should("exist");
    cy.contains('23 results found for "baking"').should("exist");

    cy.get('input[name="inDemandOnly"]').check();

    cy.contains(
      "Culinary & Baking Opportunity Program for Adults with Developmental Disabilities"
    ).should("not.exist");
    cy.contains("Baking & Pastry , Culinary Arts").should("exist");
    cy.contains('13 results found for "baking"').should("exist");

    cy.get('input[name="inDemandOnly"]').uncheck();

    cy.contains("Baking & Pastry , Culinary Arts").should("exist");
    cy.contains(
      "Culinary & Baking Opportunity Program for Adults with Developmental Disabilities"
    ).should("exist");
    cy.contains('23 results found for "baking"').should("exist");
  });

  it("sorts by cost high to low", () => {
    cy.visit("/search/bakery");
    cy.get("select").select("Cost: High to Low");

    const costsOrder = [
      "$14,840.00",
      "$10,405.00",
      "$4,995.00",
      "$4,450.00",
      "$4,438.00",
      "$3,004.00",
    ];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(costsOrder[index]);
    });
  });

  it("sorts by cost low to high", () => {
    cy.visit("/search/bakery");
    cy.get("select").select("Cost: Low to High");

    const costsOrder = [
      "$3,004.00",
      "$4,438.00",
      "$4,450.00",
      "$4,995.00",
      "$10,405.00",
      "$14,840.00",
    ];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(costsOrder[index]);
    });
  });

  it("sorts by employment rate", () => {
    cy.visit("/search/yoga");
    cy.get("select").select("Employment Rate");

    const ratesOrder = ["83.3% employed", "--", "--", "--", "--", "--", "--", "--"];

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
    cy.location("pathname").should("eq", "/training/50649");
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
