describe("Search", () => {
  it("searches from the training explorer page", () => {
    cy.intercept("/api/trainings/search?query=baking&page=1&limit=10&sort=best_match", { fixture: "baking-search-results.json" })

    // on homepage
    cy.visit("/training");
    cy.injectAxe();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.checkA11y();

    cy.contains("Search by training, provider, certification, SOC code, CIP code, or keyword").should(
      "exist",
    );

    cy.wait(1000);
    // input search
    cy.get('input[aria-label="search"]').type("baking");
    cy.wait(1000);
    cy.get("a#search-button").contains("Search").click({ force: true });

    // on search results page
    cy.url().should("eq", `${Cypress.config().baseUrl}/training/search?q=baking`);
    cy.get('input[aria-label="search"]').should("have.value", "baking");

    // matches by title
    cy.contains("Bakery and Pastry").should(
      "exist",
    );

    cy.contains(
      "...career preparation program offers hands-on courses in the fundamentals of baking and pastry. It will also prepare you for the National Restaurant...",
    ).should("exist");
  });

  it("searches from the training explorer page with ampersands", () => {
    cy.visit("/training");

    // Use the custom command to type the search term into the input field.
    cy.typeSpecialCharacters('input[aria-label="search"]', "Python & Java");

    cy.get("form").submit();

    // Wait for the page to load results and assert the URL to ensure the search term was correctly processed.
    // This URL assertion checks that the encoded search term in the query parameters matches the expected format.
    cy.url().should("include", "q=Python+%26+Java");

    // Verify that the search input on the results page retains the original search term.
    // This step checks that the application correctly decodes the query parameter for display.
    cy.get('input[aria-label="search"]').should("have.value", "Python & Java");
  });

  it("searches from the search results page", () => {
    cy.intercept("/api/trainings/search?query=welding%20technology&page=1&limit=10&sort=best_match", {
      fixture: "welding-technology-search-results.json",
    })
    cy.intercept("/api/trainings/search?query=baking&page=1&limit=10&sort=best_match", { fixture: "baking-search-results.json" })
  
    // on results page
    cy.visit("/training/search?q=welding%20technology");
    cy.injectAxe();

    // displays trainings
    cy.contains("Welding Technology").should("exist");
    cy.contains("$32,407.00").should("exist");
    // cy.contains("77.5%").should("exist");
    cy.contains("Mahwah").should("exist");
    cy.contains("Lincoln Technical Institute - Mahwah").should("exist");
    cy.contains("Completion time: No data available").should("exist");
    cy.contains("48.0508").should("exist");

    // input search
    cy.get('input[aria-label="search"]').clear();
    cy.get('input[aria-label="search"]').type("baking");
    cy.get("button").contains("Update Results").click({ force: true });

    cy.url().should("eq", `${Cypress.config().baseUrl}/training/search?q=baking`);

    // matches by title
    cy.contains("Culinary Opportunity Program for Adults with Developmental Disabilities").should(
      "exist",
    );

    // matches by title but is suspended
    cy.contains("Art of International Bread Baking").should("not.exist");

    // matches by description
    cy.contains("Culinary Arts").should("exist");

    // removes others
    cy.contains("Welding Workshops").should("not.exist");

    // cy.checkA11y();
  });

  it("shows getting started messaging when no search", () => {
    // on results page
    cy.visit("/training/search");
    cy.injectAxe();

    // displays zero state
    cy.contains("What Can I Search for?").should("exist");
  });

  it("links back to home page", () => {
    cy.visit("/training");
    cy.contains("Training Explorer").click({ force: true });
    cy.location("pathname").should("eq", "/training");
  });

  it("links to a training detail page", () => {
    cy.intercept("/api/trainings/search?query=digital%20marketing&page=1&limit=10&sort=best_match", { fixture: "digital-marketing-search-results.json" });

    cy.visit("/training/search?q=digital%20marketing");

    cy.contains("Certified Digital Marketing Fundamental").click({ force: true });
    cy.location("pathname").should("eq", "/training/ce-2bcfd3f3-17c4-4001-9215-7770d5f193e7");

    // removes search results
    cy.contains("Rutgers Virtual Live Mini MBA").should("not.exist");

    // shows program
    cy.contains("Certified Digital Marketing Fundamental").should("exist");
  });

  it("tags trainings on in-demand", () => {
    cy.intercept("api/trainings/search?query=social%20work", { fixture: "social-work-search-results.json" });

    cy.visit("/training/search?q=social%20work");

    // in-demand training
    cy.get(".card")
      .eq(0)
      .within(() => {
        cy.contains("In Demand").should("exist");
      });

    // not in-demand training
    cy.contains("Work Retention and Readiness").within(() => {
      cy.contains("In-Demand").should("not.exist");
    });

    cy.contains("Masters in Social Work").click({ force: true });
    cy.contains("In-Demand").should("exist");
  });

  it("tags shows search training tips", () => {
    cy.visit("/training/search?q=braider");

    // search tips
    cy.get("[data-testid='searchTips']").should(
      "contain",
      "Are you not seeing the results you were looking for?",
    );
  });

  it("shows comparison items when checked", () => {
    cy.intercept("/api/trainings/search?query=painting&page=1&limit=10&sort=best_match", { fixture: "painting-search-results.json" });

    cy.visit("/training/search?q=painting");
    cy.get("[data-testid='card']")
      .first()
      .within(() => {
        cy.get('[data-testid="result-highlight"]').should("exist");
        cy.get('[type="checkbox"][name="compare"]').should("exist");
        cy.get('[type="checkbox"][name="compare"]').check({ force: true });
      });

    cy.get(".training-comparison").within(() => {
      cy.get(".comparison-item").should("exist");
    });
  });
});
