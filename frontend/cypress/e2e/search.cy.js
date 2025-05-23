describe("Search", () => {
  it("searches from the training explorer page", () => {
    // on homepage
    cy.visit("/training");
    cy.injectAxe();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.checkA11y();

    cy.contains("Search for training").should("exist");

    cy.wait(1000);
    // input search
    cy.get('input[aria-label="search"]').type("baking");
    cy.wait(1000);
    cy.get("button#search-button").contains("Search").click({ force: true });

    // on search results page
    cy.url().should("eq", `${Cypress.config().baseUrl}/training/search?q=baking`);
    cy.get('input[aria-label="search"]').should("have.value", "baking");

    // matches by title
    cy.contains("Baking and Pastry").should(
      "exist",
    );

    // matches by title but is suspended
    cy.contains("Art of International Bread Baking").should("not.exist");

    // matches by description
    cy.contains(
      "...program offers hands-on courses in the fundamentals of baking and pastry. It will also prepare you for the National...",
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
    // on results page
    cy.visit("/training/search?q=welding%20workshops");
    cy.injectAxe();

    // displays trainings
    cy.contains("Welding Workshops").should("exist");
    cy.contains("$559.00").should("exist");
    // cy.contains("77.5%").should("exist");
    cy.contains("Denville").should("exist");
    cy.contains("Morris County School of Technology, Adult Education").should("exist");
    cy.contains("3-5 months to complete").should("exist");

    // input search
    cy.get('input[aria-label="search"]').clear();
    cy.get('input[aria-label="search"]').type("baking");
    cy.get("button").contains("Update Results").click({ force: true });

    cy.url().should("eq", `${Cypress.config().baseUrl}/training/search?q=baking`);

    // matches by title
    cy.contains("Baking and Pastry").should(
      "exist",
    );

    // matches by title but is suspended
    cy.contains("Art of International Bread Baking").should("not.exist");

    // matches by description
    cy.contains("Baking and Pastry").should("exist");

    // removes others
    cy.contains("Welding Workshops").should("not.exist");

    // cy.checkA11y();
  });

  it("shows getting started messaging when no search", () => {
    // on results page
    cy.visit("/training/search");
    cy.injectAxe();

    // displays zero state
    cy.contains("Find Training").should("exist");
  });

  it("links back to home page", () => {
    cy.visit("/training");
    cy.contains("Training Explorer").click({ force: true });
    cy.location("pathname").should("eq", "/training");
  });

  it("links to a training detail page", () => {
    cy.visit("/training/search?q=digital%20marketing");
    cy.contains("Web Mobile and Digital Marketing").click({ force: true });
    cy.location("pathname").should("eq", "/training/52224");

    // removes search results
    cy.contains("Rutgers Virtual Live Mini MBA").should("not.exist");

    // shows program
    cy.contains("Web Mobile and Digital Marketing").should("exist");
  });

  it("tags trainings on in-demand", () => {
    cy.visit("/training/search?q=social%20work");

    cy.contains("In Demand").should("exist");

    // not in-demand training
    cy.contains("Bachelor of Arts in Criminology and Criminal Justice- WP Online").within(() => {
      cy.contains("In-Demand").should("not.exist");
    });

    cy.contains("Chemical Dependency Certificate").click({ force: true });
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
    cy.intercept("/api/trainings/search?query=painting").as("getSearch");

    cy.visit("/training/search?q=painting");

    cy.wait("@getSearch").then(() => {
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
});
