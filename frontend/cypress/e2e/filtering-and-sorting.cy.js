describe.skip("Filtering", () => {
  it("filters by max cost", () => {
    cy.intercept("api/trainings/search?query=baking", { fixture: "baking-search-results.json" })

    cy.visit("/training/search?q=baking");
    cy.contains("Baking and Pastry").should("exist");
    cy.contains('8 results found for "baking"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get('input[id="maxCost"]').type("2000");
      cy.get('input[id="maxCost"]').blur();
    });

    cy.contains("Baking and Pastry").should("not.exist");
    cy.contains('3 results found for "baking"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get('input[id="maxCost"]').clear();
      cy.get('input[id="maxCost"]').blur();
    });

    cy.contains("Baking and Pastry").should("exist");
    cy.contains('8 results found for "baking"').should("exist");
  });

  it("filters by training length", () => {
    cy.intercept("api/trainings/search?query=digital%20marketing", { fixture: "digital-marketing-search-results.json" });

    cy.visit("/training/search?q=digital%20marketing");

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Certified Digital Marketing Professional (Voucher Included)").should("exist");
    cy.contains("Rutgers Virtual Live Mini-MBA: Digital Marketing (5)").should("exist");
    cy.contains("Entrepreneurship/Office Equipment Repair Specialist").should("exist");
    cy.contains('49 results found for "digital marketing"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="days"]').check();
    });

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Certified Digital Marketing Professional (Voucher Included)").should("not.exist");
    cy.contains("Rutgers Virtual Live Mini-MBA: Digital Marketing (5)").should("not.exist");
    cy.contains("Entrepreneurship/Office Equipment Repair Specialist").should("not.exist");
    cy.contains('4 results found for "digital marketing"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="days"]').uncheck();
    });
    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="weeks"]').check();
    });

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("not.exist");
    cy.contains("Certified Digital Marketing Professional (Voucher Included)").should("not.exist");
    cy.contains("Rutgers Virtual Live Mini-MBA: Digital Marketing (5)").should("exist");
    cy.contains("Entrepreneurship/Office Equipment Repair Specialist").should("not.exist");
    cy.contains('20 results found for "digital marketing"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="weeks"]').uncheck();
    });
    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="months"]').check();
    });

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("not.exist");
    cy.contains("Certified Digital Marketing Professional (Voucher Included)").should("exist");
    cy.contains("Rutgers Virtual Live Mini-MBA: Digital Marketing (5)").should("not.exist");
    cy.contains("Entrepreneurship/Office Equipment Repair Specialist").should("not.exist");
    cy.contains('18 results found for "digital marketing"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="months"]').uncheck();
    });
    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="years"]').check();
    });

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("not.exist");
    cy.contains("Certified Digital Marketing Professional (Voucher Included)").should("not.exist");
    cy.contains("Rutgers Virtual Live Mini-MBA: Digital Marketing (5)").should("not.exist");
    cy.contains("Entrepreneurship/Office Equipment Repair Specialist").should("exist");
    cy.contains('7 results found for "digital marketing"').should("exist");
  });

  it("filters by class format", () => {
    cy.intercept("api/trainings/search?query=digital%20marketing", { fixture: "digital-marketing-search-results.json" });

    cy.visit("/training/search?q=digital%20marketing");

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Social Media Marketing with Digital Marketing and Digital Graphics Design Online").should("exist");
    cy.contains('49 results found for "digital marketing"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').check();
    });

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Social Media Marketing with Digital Marketing and Digital Graphics Design Online").should("not.exist");
    cy.contains('42 results found for "digital marketing"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').uncheck();
    });

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="online"]').check();
    });

    cy.contains("Social Media Marketing with Digital Marketing and Digital Graphics Design Online").should("exist");
    cy.contains("Rutgers Mini MBA: Digital Marketing").should("not.exist");
    cy.contains('7 results found for "digital marketing"').should("exist");
  });

  it("filters by location", () => {
    cy.intercept("api/trainings/search?query=digital%20marketing", { fixture: "digital-marketing-search-results.json" });

    cy.visit("/training/search?q=digital%20marketing");
    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains('49 results found for "digital marketing"').should("exist");

    cy.get('input[aria-label="Search by ZIP code"]').type("07652");
    cy.get('input[aria-label="Search by ZIP code"]').blur();

    cy.get('select[id="miles"]').select('5');
    cy.get('select[id="miles"]').blur();

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("not.exist");
    cy.contains("Certificate in Digital Marketing").should("exist");
    cy.contains('9 results found for "digital marketing"').should("exist");

    cy.get('input[aria-label="Search by ZIP code"]').clear();
    cy.get('input[aria-label="Search by ZIP code"]').blur();

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains('49 results found for "digital marketing"').should("exist");
  });

  it("filters by In-Demand Only", () => {
    cy.intercept("api/trainings/search?query=digital%20marketing", { fixture: "digital-marketing-search-results.json" });

    cy.visit("/training/search?q=digital%20marketing");
    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Visual and Digital Design").should("exist");
    cy.contains('49 results found for "digital marketing"').should("exist");

    cy.get('input[name="inDemandOnly"]').check();

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Visual and Digital Design").should("not.exist");
    cy.contains('43 results found for "digital marketing"').should("exist");

    cy.get('input[name="inDemandOnly"]').uncheck();

    cy.contains("Rutgers Mini MBA: Digital Marketing").should("exist");
    cy.contains("Visual and Digital Design").should("exist");
    cy.contains('49 results found for "digital marketing"').should("exist");
  });

  // TODO: Find a longer-term solution for this test more resistant to ETPL data changes
  it.skip("sorts by cost high to low", () => {
    cy.intercept("api/trainings/search?query=baking", { fixture: "baking-search-results.json" })

    cy.visit("/training/search?q=baker");
    cy.get("#sortby").select("COST_HIGH_TO_LOW");

    const costsOrder = [
      "$8,085.00",
      "$4,600.00",
      "$3,217.00",
      "$2,900.00",
      "$2,107.00",
      "$999.00",
      "$400.00",
      "$200.00",
    ];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(costsOrder[index]);
    });
  });

  // TODO: Find a longer-term solution for this test more resistant to ETPL data changes
  it.skip("sorts by cost low to high", () => {
    cy.intercept("api/trainings/search?query=digital%20marketing", { fixture: "digital-marketing-search-results.json" });

    cy.visit("/training/search?q=baker");
    cy.get("#sortby").select("COST_LOW_TO_HIGH");

    const costsOrder = [
      "$200.00",
      "$400.00",
      "$999.00",
      "$2,107.00",
      "$2,900.00",
      "$3,217.00",
      "$4,600.00",
      "$8,085.00",
    ];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(costsOrder[index]);
    });
  });

  it("sorts by employment rate", () => {
    cy.visit("/training/search?q=baker");
    cy.get("#sortby").select("EMPLOYMENT_RATE");

    const ratesOrder = [
      "71.4% employed",
      "33.3% employed",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--"];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(ratesOrder[index]);
    });
  });

  // TODO: Find a longer-term solution for this test more resistant to ETPL data changes
  it.skip("preserves sort order between pages", () => {
    cy.visit("/training/search?q=baking");

    cy.get(".card")
        .first()
        .within(() => {
          cy.contains(
              "Culinary Opportunity Program for Adults with Developmental Disabilities",
          ).should("exist");
        });

    cy.get("#sortby").select("EMPLOYMENT_RATE");

    cy.get(".card")
        .first()
        .within(() => {
          cy.contains("Baking and Pastry").should("exist");
        });

    // get card with unique text
    cy.get(".card .link-format-blue").eq(0).click({ force: true });
    cy.location("pathname").should("eq", "/training/46328");
    cy.go("back");

    cy.get(".card")
        .first()
        .within(() => {
          cy.contains("Baking and Pastry").should("exist");
        });

    cy.contains("Employment Rate").should("exist");
  });

  it("preserves a filter between pages", () => {
    cy.visit("/training/search?q=baking");
    cy.contains("Baking and Pastry").should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").type("2000");
      cy.get("input").blur();
    });

    cy.contains("Baking and Pastry").should("not.exist");
    cy.contains("Baking & Pastry Arts").should("exist");

    cy.get(".card .link-format-blue").eq(0).click({ force: true });
    cy.location("pathname").should("eq", "/training/37354");
    cy.go("back");

    cy.contains("Baking & Pastry , Culinary Arts").should("not.exist");
    cy.contains("Max Cost").within(() => {
      cy.get("input").should("have.value", "2000");
    });
  });
});
