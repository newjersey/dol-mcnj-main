describe("Search", () => {
  it("searches from the homepage", () => {
    // on homepage
    cy.visit("/");
    cy.injectAxe();
    cy.checkA11y();

    cy.get("[placeholder='Enter occupation, certification, or provider']").should("exist");

    // input search
    cy.get('input[aria-label="search"]').type("baking");
    cy.get("button").contains("Search").click();

    // on search results page
    cy.location("pathname").should("eq", "/search/baking");
    cy.get('input[aria-label="search"]').should("have.value", "baking");

    // matches by title
    cy.contains("Baking & Pastry , Culinary Arts").should("exist");

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
    cy.visit("/search/mig%20welding");
    cy.injectAxe();

    // displays trainings
    cy.contains("Introduction to Welding Technology").should("exist");
    cy.contains("$4,000.00").should("exist");
    cy.contains("77.5%").should("exist");
    cy.contains("Blackwood").should("exist");
    cy.contains("Camden County College").should("exist");
    cy.contains("3-5 months to complete").should("exist");

    // input search
    cy.get('input[aria-label="search"]').clear();
    cy.get('input[aria-label="search"]').type("baking");
    cy.get("button").contains("Update Results").click();

    cy.location("pathname").should("eq", "/search/baking");

    // matches by title
    cy.contains("Baking and Pastry").should("exist");

    // matches by title but is suspended
    cy.contains("Art of International Bread Baking").should("not.exist");

    // matches by description
    cy.contains("Culinary Arts").should("exist");

    // removes others
    cy.contains("Introduction to Welding Technology").should("not.exist");

    cy.checkA11y();
  });

  it("links back to home page", () => {
    cy.visit("/search");
    cy.contains("Training Explorer").click();
    cy.location("pathname").should("eq", "/");
  });

  it("links to a training detail page", () => {
    cy.visit("/search/baking");
    cy.contains(
      "Culinary & Baking Opportunity Program for Adults with Developmental Disabilities"
    ).click({ force: true });
    cy.location("pathname").should("eq", "/training/48865");

    // removes search results
    cy.contains("Baking and Pastry").should("not.exist");

    // shows program
    cy.contains(
      "Culinary & Baking Opportunity Program for Adults with Developmental Disabilities"
    ).should("exist");
  });

  it("tags trainings on in-demand", () => {
    cy.visit("/search/baking");

    // in-demand training
    cy.contains("Culinary Arts").within(() => {
      cy.contains("In Demand").should("exist");
    });

    // not in-demand training
    cy.contains("Baking & Pastry Option, Culinary Arts").within(() => {
      cy.contains("In Demand").should("not.exist");
    });

    cy.contains("Culinary Arts").click({ force: true });
    cy.contains("In Demand").should("exist");
  });
});
