describe("Filtering", () => {
  it("filters by max cost", () => {
    cy.visit("/search/baking");
    cy.contains("Pastry and Baking Arts").should("exist");
    cy.contains('22 results found for "baking"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").type("5000");
      cy.get("input").blur();
    });

    cy.contains("Pastry and Baking Arts").should("not.exist");
    cy.contains('13 results found for "baking"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").clear();
      cy.get("input").blur();
    });

    cy.contains("Pastry and Baking Arts").should("exist");
    cy.contains('22 results found for "baking"').should("exist");
  });

  it("filters by training length", () => {
    cy.visit("/search/digital%20marketing");

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("OMCA Conversion Optimization Associate").should("exist");
    cy.contains("OMCP Social and Mobile Marketing Professional").should("exist");
    cy.contains("Entrepreneurship/Office Equipment Repair Specialist").should("exist");
    cy.contains('59 results found for "digital marketing"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="days"]').check();
    });

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("OMCA Conversion Optimization Associate").should("not.exist");
    cy.contains("OMCP Social and Mobile Marketing Professional").should("not.exist");
    cy.contains("Entrepreneurship/Office Equipment Repair Specialist").should("not.exist");
    cy.contains('4 results found for "digital marketing"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="days"]').uncheck();
    });
    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="weeks"]').check();
    });

    cy.contains("OMCA Conversion Optimization Associate").should("exist");
    cy.contains("Rutgers Mini MBA: Digital Marketing").should("not.exist");
    cy.contains("OMCP Social and Mobile Marketing Professional").should("not.exist");
    cy.contains("Entrepreneurship/Office Equipment Repair Specialist").should("not.exist");
    cy.contains('21 results found for "digital marketing"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="weeks"]').uncheck();
    });
    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="months"]').check();
    });

    cy.contains("OMCP Social and Mobile Marketing Professional").should("exist");
    cy.contains("Rutgers Mini MBA: Digital Marketing").should("not.exist");
    cy.contains("OMCA Conversion Optimization Associate").should("not.exist");
    cy.contains("Entrepreneurship/Office Equipment Repair Specialist").should("not.exist");
    cy.contains('29 results found for "digital marketing"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="months"]').uncheck();
    });
    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="years"]').check();
    });

    cy.contains("Entrepreneurship/Office Equipment Repair Specialist").should("exist");
    cy.contains("Rutgers Mini MBA: Digital Marketing").should("not.exist");
    cy.contains("OMCA Conversion Optimization Associate").should("not.exist");
    cy.contains("OMCP Social and Mobile Marketing Professional").should("not.exist");
    cy.contains('5 results found for "digital marketing"').should("exist");
  });

  it("filters by class format", () => {
    cy.visit("/search/digital%20marketing");

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("OMCA Content Marketing Associate").should("exist");
    cy.contains('59 results found for "digital marketing"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').check();
    });

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("OMCA Content Marketing Associate").should("not.exist");
    cy.contains('48 results found for "digital marketing"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').uncheck();
    });

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="online"]').check();
    });

    cy.contains("OMCA Content Marketing Associate").should("exist");
    cy.contains("Rutgers Mini MBA: Digital Marketing").should("not.exist");
    cy.contains('11 results found for "digital marketing"').should("exist");
  });

  it("filters by location", () => {
    cy.visit("/search/digital%20marketing");
    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains('59 results found for "digital marketing"').should("exist");

    cy.get('input[aria-label="Miles"]').type("5");
    cy.get('input[aria-label="Miles"]').blur();

    cy.get('input[aria-label="Zip Code"]').type("07652");
    cy.get('input[aria-label="Zip Code"]').blur();

    // @FIX zip-api: "this feature is currently unavailable" in test
    // cy.contains("Rutgers Mini MBA: Digital Marketing").should("not.exist");
    // cy.contains("in Integrated Marketing Communications").should("exist");
    // cy.contains('16 results found for "digital marketing"').should("exist");

    cy.get('input[aria-label="Miles"]').clear();
    cy.get('input[aria-label="Miles"]').blur();

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains('59 results found for "digital marketing"').should("exist");
  });

  it("filters by In-Demand Only", () => {
    cy.visit("/search/digital%20marketing");
    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Visual and Digital Design").should("exist");
    cy.contains('59 results found for "digital marketing"').should("exist");

    cy.get('input[name="inDemandOnly"]').check();

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Visual and Digital Design").should("not.exist");
    cy.contains('36 results found for "digital marketing"').should("exist");

    cy.get('input[name="inDemandOnly"]').uncheck();

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Visual and Digital Design").should("exist");
    cy.contains('59 results found for "digital marketing"').should("exist");
  });

  it("sorts by cost high to low", () => {
    cy.visit("/search/baker");
    cy.get("select").select("Cost: High to Low");

    const costsOrder = [
      "$33,553.00",
      "$33,553.00",
      "$14,840.00",
      "$10,405.00",
      "$5,555.00",
      "$4,995.00",
      "$4,438.00",
      "$2,900.00",
      "$2,580.00",
      "$2,107.00",
    ];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(costsOrder[index]);
    });
  });

  it("sorts by cost low to high", () => {
    cy.visit("/search/baker");
    cy.get("select").select("Cost: Low to High");

    const costsOrder = [
      "$2,107.00",
      "$2,580.00",
      "$2,900.00",
      "$4,438.00",
      "$4,995.00",
      "$5,555.00",
      "$10,405.00",
      "$14,840.00",
      "$33,553.00",
      "$33,553.00",
    ];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(costsOrder[index]);
    });
  });

  it("sorts by employment rate", () => {
    cy.visit("/search/baker");
    cy.get("select").select("Employment Rate");

    const ratesOrder = ["71.4% employed", "--", "--", "--", "--", "--", "--", "--", "--", "--"];

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
    cy.get(".card .no-link-format").eq(0).click({ force: true });
    cy.location("pathname").should("eq", "/training/50307");
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
    cy.contains("Baking & Pastry , Culinary Arts").should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").type("5000");
      cy.get("input").blur();
    });

    cy.contains("Baking & Pastry , Culinary Arts").should("not.exist");

    cy.get(".card .no-link-format").eq(0).click({ force: true });
    cy.location("pathname").should("eq", "/training/48865");
    cy.go("back");

    cy.contains("Baking & Pastry , Culinary Arts").should("not.exist");
    cy.contains("Max Cost").within(() => {
      cy.get("input").should("have.value", "5000");
    });
  });
});
