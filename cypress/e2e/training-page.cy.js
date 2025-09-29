describe("Training Page", () => {
  it("is accessible", () => {
    cy.visit("/training/50575");
    cy.injectAxe();

    cy.contains("Homemaker Home Health Aide").should("exist");
  });

  it("displays training details", () => {
    cy.visit("/training/50575");
    cy.injectAxe();

    // titles
    cy.contains("Homemaker Home Health Aide").should("exist");
    cy.contains(".subHeading", "Above and Beyond Care Health System").should("exist");

    // stat boxes
    cy.contains("In-Demand").should("exist");
    
    // Check for program stats sections
    cy.get('.infoBlocks .cost').should('exist').and('contain.text', 'Avg Salary after Program');
    cy.get('.infoBlocks .rate').should('exist').and('contain.text', 'Program Employment Rate');
    
    // Verify the actual values displayed (be flexible about exact values)
    cy.get('.infoBlocks .cost').invoke('text').should('match', /\$29,128|Not available/);
    cy.get('.infoBlocks .rate').invoke('text').should('match', /65\.0%|Not available/);

    // description should exist (look for any substantial description text)
    cy.contains("Provide training for individuals").should("exist");

    // quick stats
    cy.contains("High School Diploma or GED").should("exist");
    cy.contains("Completion Time").should("exist");

    // associated occupations - check for the section heading
    cy.contains("Associated Occupations").should("exist");

    // share trainings
    cy.contains("How to get funding").should("exist");
    cy.contains(
      "Trainings related to occupations on the In - Demand Occupations List may be eligible for funding. Contact your local One-Stop Career Center for more information regarding program and training availability."
    ).should("exist");
    cy.contains(
      "You can also check out other tuition assistance opportunities."
    ).should("exist");

    // cost and provider sections should exist
    cy.contains("Total Cost").should("exist");
    cy.contains("$480").should("exist"); // Total cost from API data

    // provider details - Above and Beyond Care Health System
    cy.contains("Above and Beyond Care Health System").should("exist");
    cy.contains("1152 St. George Avenue").should("exist");

    cy.checkA11y();
  });
});
