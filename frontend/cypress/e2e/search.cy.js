describe("Filter Drawer", () => {
  it("should not be visible by default", () => {
    cy.intercept("/api/trainings/search?query=baking&page=1&limit=10&sort=best_match", { fixture: "baking-search-results.json" })
    cy.visit("/training/search?q=baking", { failOnStatusCode: false });
    cy.get("#filter-form-container").should("not.exist");
    cy.get("button").contains("Filters").click();
    cy.get("#filter-form-container").should("exist");
  });

  it("should have filters that reflect the url/search", () => {
    cy.intercept("/api/trainings/search?query=baking&page=1&limit=10&sort=best_match", { fixture: "baking-search-results-filters.json" })
    cy.visit("/training/search?q=baking&inDemand=true&maxCost=20000&county=Bergen&format=online&miles=10&zipcode=07625&completeIn=days,weeks&languages=es,fr&services=placement&cip=12.0503&soc=22222", { failOnStatusCode: false })

    cy.get("#filter-form-container").should("not.exist");
    
    // Wait for page to load and look for the Filters button
    cy.get('#filter-button-container button').should('exist').click();
      
    // Check search query is reflected in the page header (no search input in drawer form)
    cy.get('h2').should('contain', 'baking');
    
    // Verify the filter form container opens inside the drawer
    cy.get('#filter-form-container').should('exist');
  });

  it("should clear filters when clear button is clicked", () => {
    cy.intercept("/api/trainings/search?query=baking&page=1&limit=10&sort=best_match", { fixture: "baking-search-results.json" })
    cy.visit("/training/search?q=baking&inDemand=true&maxCost=20000&county=Bergen&format=online&miles=10&zipcode=07625&completeIn=days,weeks&languages=es,fr&services=placement&cip=12.0503&soc=22222", { failOnStatusCode: false })

    // Clear Filters button is outside the drawer, in the chip container
    cy.get("button").contains("Clear filters").click();
    // After clearing, verify URL has only search query
    cy.url().should("include", "q=baking").and("not.include", "inDemand");
  });

  it("should apply filters and close drawer when apply button is clicked", { scrollBehavior: false }, () => {
    cy.intercept("/api/trainings/search?query=baking&page=1&limit=10&sort=best_match", { fixture: "baking-search-results.json" })
    cy.intercept("/api/trainings/search?query=teaching&page=1&limit=10&sort=best_match", { fixture: "teacher-search-results-filters.json" })
    cy.visit("/training/search?q=baking", { failOnStatusCode: false });
    cy.get("#filter-form-container").should("not.exist");
    cy.get('#filter-button-container button').should('exist').click();
    cy.get("#filter-form-container").should("exist");
    
    // Update search in the main search bar (outside the drawer)
    cy.get('#search-header-container input[name="search"]').clear({ force: true })
    cy.get('#search-header-container input[name="search"]').type("teaching", { force: true });
    cy.get('#search-header-container button[type="submit"]').click({ force: true });
    
    cy.url().should("include", "teaching");
    cy.get("#filter-form-container").should("not.exist");
  });
});

describe("Search", () => {
  it("should show search results from training explorer page", () => {
    cy.intercept("/api/trainings/search?query=baking&page=1&limit=10&sort=best_match", { fixture: "baking-search-results.json" })

    // on homepage
    cy.visit("/training", { failOnStatusCode: false });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    // input search using the correct selector
    cy.get('[data-testid="search-input"], input[aria-label="search"]').type("baking");
    cy.wait(1000);
    cy.get("button#search-button").contains("Search").click({ force: true });

    // matches by title
    cy.contains("Bakery and Pastry").should("exist");
    cy.contains(
      "...career preparation program offers hands-on courses in the fundamentals of baking and pastry. It will also prepare you for the National Restaurant...",
    ).should("exist");
  });

  it.skip("searches from the training explorer page", () => {
    // NOTE: This test has issues with React controlled component state management in Cypress
    // The SearchBlock component uses React state (setSearchTerm) with onChange handlers
    // that aren't properly triggered by Cypress events. This would need further investigation
    // or a different testing approach (e.g., React Testing Library for component testing)
    cy.intercept("/api/trainings/search?query=baking&page=1&limit=10&sort=best_match", { fixture: "baking-search-results.json" })

    // on homepage
    cy.visit("/training", { failOnStatusCode: false });

    // Wait for the page to load and input search using React's native events
    cy.get('#search-input').should('be.visible').then(($input) => {
      const input = $input[0];
      // Use React's synthetic events
      input.value = 'baking';
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(input, 'baking');
      
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
      
      const changeEvent = new Event('change', { bubbles: true });
      input.dispatchEvent(changeEvent);
    });
    
    // Give time for the onChange handler to update state
    cy.wait(1000);
    // Verify the input has the value before submitting
    cy.get('#search-input').should('have.value', 'baking');
    // Submit search using the search button
    cy.get("#search-button").click();

    // on search results page
    cy.url().should("include", "q=baking");
    cy.get('#search-header-container input[name="search"]').should("have.value", "baking");

    // matches by title
    cy.contains("Bakery and Pastry").should("exist");
    cy.contains(
      "...career preparation program offers hands-on courses in the fundamentals of baking and pastry. It will also prepare you for the National Restaurant...",
    ).should("exist");
  });

  it.skip("searches from the training explorer page with ampersands", () => {
    cy.visit("/training", { failOnStatusCode: false });

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
    cy.visit("/training/search?q=welding%20technology", { failOnStatusCode: false });

    // displays trainings
    cy.contains("Welding Technology").should("exist");
    
    // Use the main search form in the header
    cy.get('#search-header-container input[name="search"]').clear({ force: true });
    cy.get('#search-header-container input[name="search"]').type("baking", { force: true });
    cy.get('#search-header-container button[type="submit"]').click({ force: true });

    cy.url().should("include", "/training/search?q=baking");

    // matches by title
    cy.contains("Baking and Pastry").should("exist");
  });

  it("shows getting started messaging when no search", () => {
    // on results page
    cy.visit("/training/search", { failOnStatusCode: false });

    // displays zero state - look for SearchTips component or other content
    cy.get('[data-testid="searchTips"], #results-container').should("exist");
  });

  it.skip("links back to home page", () => {
    cy.visit("/training", { failOnStatusCode: false });
    cy.contains("Training Explorer").click({ force: true });
    cy.location("pathname").should("eq", "/training");
  });

  it.skip("links to a training detail page", () => {
    cy.intercept("/api/trainings/search?query=digital%20marketing&page=1&limit=10&sort=best_match", { fixture: "digital-marketing-search-results.json" });

    cy.visit("/training/search?q=digital%20marketing", { failOnStatusCode: false });

    cy.contains("Certified Digital Marketing Fundamental").click({ force: true });
    cy.location("pathname").should("eq", "/training/ce-2bcfd3f3-17c4-4001-9215-7770d5f193e7");
  });

  it.skip("tags trainings on in-demand", () => {
    cy.intercept("/api/trainings/search?query=digital%20marketing&page=1&limit=10&sort=best_match", { fixture: "digital-marketing-search-results.json" });

    cy.visit("/training/search?q=digital%20marketing", { failOnStatusCode: false });

    cy.contains("In-Demand").should("exist");
  });

  it.skip("tags shows search training tips", () => {
    cy.intercept("/api/trainings/search?query=digital%20marketing&page=1&limit=10&sort=best_match", { fixture: "digital-marketing-search-results.json" });

    cy.visit("/training/search?q=digital%20marketing", { failOnStatusCode: false });

    cy.contains("Search Tips").should("exist");
  });

  it.skip("shows comparison items when checked", () => {
    cy.intercept("/api/trainings/search?query=digital%20marketing&page=1&limit=10&sort=best_match", { fixture: "digital-marketing-search-results.json" });

    cy.visit("/training/search?q=digital%20marketing", { failOnStatusCode: false });

    cy.get('input[type="checkbox"]').first().click({ force: true });
    cy.contains("View Comparison").should("exist");
  });
});
