describe("Search", () => {
  it("is accessible", () => {
    cy.visit("/training");
    cy.injectAxe();
    cy.checkA11y();

    cy.contains("Search for training").should("exist");
  });

  it.skip("searches from the training explorer page", () => {
    // on homepage
    cy.visit("/training");

    cy.wait(1000);
    // input search
    cy.get('input[aria-label="search"]').type("baking");
    cy.wait(1000);
    cy.get("a#search-button").contains("Search").click({ force: true });

    // on search results page
    cy.url().should(
      "eq",
      `${Cypress.config().baseUrl}/training/search?q=baking`
    );

    cy.get('input[aria-label="search"]').should("have.value", "baking");

    // matches by title
    cy.contains(
      "Culinary Opportunity Program for Adults with Developmental Disabilities"
    ).should("exist");

    // matches by title but is suspended
    cy.contains("Art of International Bread Baking").should("not.exist");

    // matches by description
    cy.contains("baking skills").should("exist");

    cy.contains(
      "...individuals with developmental disabilities. Teaches basic culinary or baking skills for successful employment in a food production environment such..."
    ).should("exist");
  });

  it.skip("searches from the training explorer page with ampersands", () => {
    cy.visit("/training");

    // Use the custom command to type the search term into the input field.
    cy.typeSpecialCharacters('input[aria-label="search"]', "Python & Java");

    cy.get("a#search-button").contains("Search").click({ force: true });

    // Wait for the page to load results and assert the URL to ensure the search term was correctly processed.
    // This URL assertion checks that the encoded search term in the query parameters matches the expected format.
    cy.url().should("include", "q=Python+%26+Java");

    // Verify that the search input on the results page retains the original search term.
    // This step checks that the application correctly decodes the query parameter for display.
    cy.get('input[aria-label="search"]').should("have.value", "Python & Java");
  });

  it.skip("searches from the search results page", () => {
    // on results page
    cy.visit("/training/search?q=welding%20workshops");
    cy.injectAxe();

    // displays trainings
    cy.contains("Welding Workshops").should("exist");
    cy.contains("$559").should("exist");
    // cy.contains("77.5%").should("exist");
    cy.contains("Denville").should("exist");
    cy.contains("Morris County School of Technology, Adult Education").should(
      "exist"
    );
    cy.contains("3-5 months to complete").should("exist");

    // input search
    cy.get('input[aria-label="search"]').clear();
    cy.get('input[aria-label="search"]').type("baking");
    cy.get("button").contains("Update Results").click({ force: true });

    cy.url().should(
      "eq",
      `${Cypress.config().baseUrl}/training/search?q=baking&p=1`
    );

    // matches by title
    cy.contains(
      "Culinary Opportunity Program for Adults with Developmental Disabilities"
    ).should("exist");

    // matches by title but is suspended
    cy.contains("Art of International Bread Baking").should("not.exist");

    // matches by description
    cy.contains("Culinary Arts").should("exist");

    // removes others
    cy.contains("Welding Workshops").should("not.exist");

    // cy.checkA11y();
  });

  it.skip("shows getting started messaging when no search", () => {
    // on results page
    cy.visit("/training/search");
    cy.injectAxe();

    // displays zero state
    cy.contains("Find Training").should("exist");
  });

  it.skip("links back to home page", () => {
    cy.visit("/training");
    cy.contains("Training Explorer").click({ force: true });
    cy.location("pathname").should("eq", "/training");
  });

  it.skip("links to a training detail page", () => {
    cy.visit("/training/search?q=digital%20marketing");
    cy.contains("Technology Business Administrator").click({
      force: true,
    });
    cy.location("pathname").should("eq", "/training/22685");

    // removes search results
    cy.contains("Rutgers Virtual Live Mini MBA").should("not.exist");

    // shows program
    cy.contains("Technology Business Administrator").should("exist");
  });

  it.skip("tags trainings on in-demand", () => {
    cy.visit("/training/search?q=social%20work");

    // in-demand training
    cy.get(".resultCard")
      .eq(0)
      .within(() => {
        cy.contains("In Demand").should("exist");
      });

    // not in-demand training
    cy.contains("Human Services (HSR.AS)").within(() => {
      cy.contains("In-Demand").should("not.exist");
    });

    cy.contains("A.A.S.Degree: Business Mgmt/Finance").click({ force: true });
    cy.contains("In-Demand").should("exist");
  });

  it.skip("tags shows search training tips", () => {
    cy.visit("/training/search?q=braider");

    // search tips
    cy.contains("Are you not seeing the results you were looking for?").should(
      "exist"
    );
  });

  it.skip("shows comparison items when checked", () => {
    cy.intercept("/api/trainings/search?query=painting").as("getSearch");

    cy.visit("/training/search?q=painting");

    cy.get(".resultCard")
      .first()
      .within(() => {
        cy.get(".description").should("exist");
        cy.get("input.usa-checkbox__input").should("exist");
        cy.get("input.usa-checkbox__input").check({ force: true });
      });

    cy.get(".compareTable").within(() => {
      cy.get(".box").first().should("not.have.class", "empty");
    });
  });
});
