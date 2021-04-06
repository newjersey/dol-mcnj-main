describe("Filtering", () => {
  it("filters by max cost", () => {
    cy.visit("/search/baking");
    cy.contains("Baking & Pastry , Culinary Arts").should("exist");
    cy.contains('2 results found for "baking"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").type("5000");
      cy.get("input").blur();
    });

    cy.contains("Baking & Pastry , Culinary Arts").should("not.exist");
    cy.contains('1 result found for "baking"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").clear();
      cy.get("input").blur();
    });

    cy.contains("Baking & Pastry , Culinary Arts").should("exist");
    cy.contains('2 results found for "baking"').should("exist");
  });

  it("filters by training length", () => {
    cy.visit("/search/marketing");
    cy.contains("Business Marketing Certification").should("exist");
    cy.contains("Business Master Executive Certification").should("exist");
    cy.contains('24 results found for "marketing"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="days"]').check();
    });

    cy.contains("Business Marketing Certification").should("not.exist");
    cy.contains("Business Master Executive Certification").should("not.exist");
    cy.contains('1 result found for "marketing"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="weeks"]').check();
    });

    cy.contains("Business Marketing Certification").should("not.exist");
    cy.contains("Business Master Executive Certification").should("exist");
    cy.contains('4 results found for "marketing"').should("exist");
  });

  it("filters by class format", () => {
    cy.visit("/search/web%20design");

    cy.contains("Web Designer Certification").should("exist");
    cy.contains(
      "Microsoft Project, Visio and Access with Digital Graphics and CompTIA A+ Online"
    ).should("exist");
    cy.contains('38 results found for "web design"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').check();
    });

    cy.contains("Web Designer Certification").should("exist");
    cy.contains(
      "Microsoft Project, Visio and Access with Digital Graphics and CompTIA A+ Online"
    ).should("not.exist");
    cy.contains('34 results found for "web design"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').uncheck();
    });

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="online"]').check();
    });

    cy.contains("Web Designer Certification").should("not.exist");
    cy.contains(
      "Microsoft Project, Visio and Access with Digital Graphics and CompTIA A+ Online"
    ).should("exist");
    cy.contains('4 results found for "web design"').should("exist");
  });

  it("filters by location", () => {
    cy.visit("/search/digital%20marketing");
    cy.contains("Digital Marketing").should("exist");
    cy.contains('4 results found for "digital marketing"').should("exist");

    cy.get('input[aria-label="Miles"]').type("5");
    cy.get('input[aria-label="Miles"]').blur();

    cy.get('input[aria-label="Zip Code"]').type("07652");
    cy.get('input[aria-label="Zip Code"]').blur();

    // @FIX zip-api: "this feature is currently unavailable" in test
    // cy.contains("Digital Marketing").should("not.exist");
    // cy.contains("in Integrated Marketing Communications").should("exist");
    // cy.contains('1 result found for "digital marketing"').should("exist");

    cy.get('input[aria-label="Miles"]').clear();
    cy.get('input[aria-label="Miles"]').blur();

    cy.contains("Digital Marketing").should("exist");
    cy.contains('4 results found for "digital marketing"').should("exist");
  });

  it("filters by In-Demand Only", () => {
    cy.visit("/search/digital%20marketing");
    cy.contains("in Integrated Marketing Communications").should("exist");
    cy.contains("Digital Marketing").should("exist");
    cy.contains('4 results found for "digital marketing"').should("exist");

    cy.get('input[name="inDemandOnly"]').check();

    cy.contains("in Integrated Marketing Communications").should("exist");
    cy.contains("Digital Marketing").should("not.exist");
    cy.contains('1 result found for "digital marketing"').should("exist");

    cy.get('input[name="inDemandOnly"]').uncheck();

    cy.contains("in Integrated Marketing Communications").should("exist");
    cy.contains("Digital Marketing").should("exist");
    cy.contains('4 results found for "digital marketing"').should("exist");
  });

  it("sorts by cost high to low", () => {
    cy.visit("/search/baking");
    cy.get("select").select("Cost: High to Low");

    const costsOrder = ["$20,839.00", "$4,805.00"];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(costsOrder[index]);
    });
  });

  it("sorts by cost low to high", () => {
    cy.visit("/search/baking");
    cy.get("select").select("Cost: Low to High");

    const costsOrder = ["$4,805.00", "$20,839.00"];

    cy.get(".card").each(($value, index) => {
      expect($value.text()).contains(costsOrder[index]);
    });
  });

  it("sorts by employment rate", () => {
    cy.visit("/search/painting");
    cy.get("select").select("Employment Rate");

    const ratesOrder = ["71.7% employed", "--", "--", "--", "--", "--", "--"];

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
        cy.contains("Baking & Pastry , Culinary Arts").should("exist");
      });

    // get card with unique text
    cy.get(".card .no-link-format").eq(1).click({ force: true });
    cy.location("pathname").should("eq", "/training/50647");
    cy.go("back");

    cy.get(".card")
      .first()
      .within(() => {
        cy.contains("Baking & Pastry , Culinary Arts").should("exist");
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

    cy.get(".card .no-link-format").eq(1).click({ force: true });
    cy.location("pathname").should("eq", "/training/50647");
    cy.go("back");

    cy.contains("Baking & Pastry , Culinary Arts").should("not.exist");
    cy.contains("Max Cost").within(() => {
      cy.get("input").should("have.value", "5000");
    });
  });
});
