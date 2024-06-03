describe("Filtering", () => {
  it("filters by max cost", () => {
    cy.intercept("/api/trainings/search?query=baking&page=1&limit=10&sort=best_match", { fixture: "baking-search-results.json" })

    cy.visit("/training/search?q=baking");
    cy.contains("Culinary Arts / Baking & Pastry").should("exist");
    cy.contains('20 results found for "baking"').should("exist");

    cy.contains("Max Cost").within(() => {
      cy.get('input[id="maxCost"]').type("4000");
      cy.get('input[id="maxCost"]').blur();
    });

    cy.contains("Culinary Arts / Baking & Pastry").should("not.exist");
    cy.get('.card').should('have.length', 2);

    cy.contains("Max Cost").within(() => {
      cy.get('input[id="maxCost"]').clear();
      cy.get('input[id="maxCost"]').blur();
    });

    cy.contains("Culinary Arts / Baking & Pastry").should("exist");
    cy.get('.card').should('have.length', 10);
  });

  it("filters by training length", () => {
    cy.intercept("/api/trainings/search?query=accountant&page=1&limit=10&sort=best_match", { fixture: "accounting-search-results.json" });
    cy.intercept("/api/trainings/search?query=teacher&page=1&limit=10&sort=best_match", { fixture: "teacher-search-results.json" });
    cy.intercept("/api/trainings/search?query=electric&page=1&limit=10&sort=best_match", { fixture: "electric-search-results.json" });

    cy.visit("/training/search?q=accountant");

    cy.contains("Accounts Payable Specialist Certification (Exam Cost Included)").should("exist");
    cy.contains("Accounting & Bookkeeping").should("exist");
    cy.contains('10 results found for "accountant"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="days"]').check();
    });

    cy.contains("Accounts Payable Specialist Certification (Exam Cost Included)").should("exist");
    cy.contains("Accounting & Bookkeeping").should("not.exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="days"]').uncheck();
    });
    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="weeks"]').check();
    });

    cy.contains("Accounts Payable Specialist Certification (Exam Cost Included)").should("not.exist");
    cy.contains("Accounting & Bookkeeping").should("exist");

    cy.visit("/training/search?q=teacher");

    cy.contains("Classroom Technology Specialist: Teachers").should("exist");
    cy.contains("Yoga Teacher Training Certification Program (300 Hours)").should("exist");
    cy.contains('10 results found for "teacher"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="weeks"]').uncheck();
    });
    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="months"]').check();
    });

    cy.contains("Classroom Technology Specialist: Teachers").should("not.exist");
    cy.contains("Yoga Teacher Training Certification Program (300 Hours)").should("exist");

    cy.visit("/training/search?q=electric");

    cy.contains("EKG Technician").should("exist");
    cy.contains("Electrical and Electronic Systems Technology").should("exist");
    cy.contains('10 results found for "electric"').should("exist");

    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="months"]').uncheck();
    });
    cy.contains("Time to Complete").within(() => {
      cy.get('[type="checkbox"][name="years"]').check();
    });

    cy.contains("EKG Technician").should("not.exist");
    cy.contains("Electrical and Electronic Systems Technology").should("exist");

  });

  it("filters by class format", () => {
    cy.intercept("/api/trainings/search?query=accountant&page=1&limit=10&sort=best_match", { fixture: "accounting-search-results.json" });

    cy.visit("/training/search?q=accountant");

    cy.contains("Computerized Accounting Specialist").should("exist");
    cy.contains("Computerized Financial Accounting").should("exist");
    cy.contains('10 results found for "accountant"').should("exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').check();
    });

    cy.contains("Computerized Accounting Specialist").should("exist");
    cy.contains("Computerized Financial Accounting").should("not.exist");

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="inPerson"]').uncheck();
    });

    cy.contains("Class Format").within(() => {
      cy.get('[type="checkbox"][name="online"]').check();
    });

    cy.contains("Computerized Accounting Specialist").should("not.exist");
    cy.contains("Computerized Financial Accounting").should("exist");
  });

  it.skip("filters by location", () => {
    cy.intercept("/api/trainings/search?query=welding&page=1&limit=10&sort=best_match", {
      fixture: "welding-technology-search-results.json",
    })
    // on results page
    cy.visit("/training/search?q=welding");
    cy.contains("Welding Technology").should("exist");
    cy.contains('10 results found for "welding"').should("exist");

    cy.get('input[aria-label="Search by ZIP code"]').type("07728");
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
    cy.intercept("/api/trainings/search?query=digital%20marketing&page=1&limit=10&sort=best_match", { fixture: "digital-marketing-search-results.json" });

    cy.visit("/training/search?q=digital%20marketing");
    cy.contains("Digital Marketing Strategist").should("exist");
    cy.contains("Rutgers Virtual Live Mini MBA: Digital Marketing (35)").should("exist");
    cy.contains('10 results found for "digital marketing"').should("exist");

    cy.get('input[name="inDemandOnly"]').check();

    cy.contains("Digital Marketing Strategist").should("exist");
    cy.contains("Rutgers Virtual Live Mini MBA: Digital Marketing (35)").should("not.exist");

    cy.get('input[name="inDemandOnly"]').uncheck();

    cy.contains("Digital Marketing Strategist").should("exist");
    cy.contains("Rutgers Virtual Live Mini MBA: Digital Marketing (35)").should("exist");
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
    cy.intercept("/api/trainings/search?query=baking&page=1&limit=10&sort=best_match", { fixture: "baking-search-results.json" })
    cy.intercept("/api/trainings/search?query=baking&page=2&limit=10&sort=best_match", { fixture: "baking-search-results-p2.json" })

    cy.visit("/training/search?q=baking");
    cy.contains("Bakery and Pastry").should("exist");
    cy.contains("Certificate in Baking").should("exist");
    cy.contains("Certificate in Professional Cooking").should("not.exist");

    cy.contains("Max Cost").within(() => {
      cy.get("input").type("4000");
      cy.get("input").blur();
    });

    cy.contains("Bakery and Pastry").should("not.exist");
    cy.contains("Certificate in Baking").should("exist");

    cy.get('[aria-label="Go to page 2"]').click();

    cy.contains("Max Cost").within(() => {
      cy.get("input").should("have.value", "4000");
    });

    cy.contains("Certificate in Baking").should("not.exist");
    cy.contains("Certificate in Professional Cooking").should("exist");
  });
});
