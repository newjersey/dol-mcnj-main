describe("Search", () => {
  it("searches from the homepage", () => {
    // on homepage
    cy.visit("/");
    cy.injectAxe();
    cy.checkA11y();

    cy.get("[placeholder='Enter occupation, certification, or provider']").should("exist");

    // input search
    cy.get('input[aria-label="search"]').type("baking");
    cy.get("button").contains("Search").click({ force: true });

    // on search results page
    cy.location("pathname").should("eq", "/search/baking");
    cy.get('input[aria-label="search"]').should("have.value", "baking");

    // matches by title
    cy.contains("Baking and Pastry Arts").should("exist");

    // matches by title but is suspended
    cy.contains("Art of International Bread Baking").should("not.exist");

    // matches by description
    cy.contains("Culinary Arts").should("exist");

    cy.contains(
      "...This two-semester certificate in Baking and Pastry is designed " +
        "to provide students with career training for entry-level positions..."
    ).should("exist");
  });

  it("searches from the search results page", () => {
    // on results page
    cy.visit("/search/welding%20workshops");
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

    cy.location("pathname").should("eq", "/search/baking");

    // matches by title
    cy.contains("Baking and Pastry Arts").should("exist");

    // matches by title but is suspended
    cy.contains("Art of International Bread Baking").should("not.exist");

    // matches by description
    cy.contains("Culinary Arts").should("exist");

    // removes others
    cy.contains("Welding Workshops").should("not.exist");

    cy.checkA11y();
  });

  it("shows getting started messaging when no search", () => {
    // on results page
    cy.visit("/search");
    cy.injectAxe();

    // displays zero state
    cy.contains("Find Training").should("exist");
  });

  it("links back to home page", () => {
    cy.visit("/search");
    cy.contains("Training Explorer").click({ force: true });
    cy.location("pathname").should("eq", "/");
  });

  it("links to a training detail page", () => {
    cy.visit("/search/digital%20marketing");
    cy.contains("Certified Digital Marketing Fundamental").click({ force: true });
    cy.location("pathname").should("eq", "/training/51388");

    // removes search results
    cy.contains("Rutgers Virtual Live Mini MBA").should("not.exist");

    // shows program
    cy.contains("Certified Digital Marketing Fundamental").should("exist");
  });

  it("tags trainings on in-demand", () => {
    cy.visit("/search/digital%20marketing");

    // in-demand training
    cy.get(".card")
      .eq(0)
      .within(() => {
        cy.contains("In Demand").should("exist");
      });

    // not in-demand training
    cy.contains("Smartphone Programmer").within(() => {
      cy.contains("In Demand").should("not.exist");
    });

    cy.contains("Certified Digital Marketing Fundamental").click({ force: true });
    cy.contains("In Demand").should("exist");
  });

  it("tags shows search training tips", () => {
    cy.visit("/search/braider");

    // search tips
    cy.get("[data-testid='searchTips']").should(
      "contain",
      "Are you not seeing the results you were looking for?"
    );
  });

  it("shows comparison items when checked", () => {
    cy.intercept("/api/trainings/search?query=painting").as("getSearch");

    cy.visit("/search/painting");

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
