describe("Training Page", () => {
  it("is accessible", () => {
    cy.visit("/training/24861");
    cy.injectAxe();

    cy.contains("Medical Assistant").should("exist");
  });

  it("displays training details", () => {
    cy.visit("/training/24861");
    cy.injectAxe();

    // titles
    cy.contains("Medical Assistant").should("exist");
    cy.contains(".subHeading", "Lincoln Technical Institute").should("exist");

    // Consumer Report Card data - formatted values from seed data
    cy.contains("61%").should("exist"); // completion rate: 0.6125 * 100 = 61.25% → rounded to 61%
    cy.contains("85%").should("exist"); // employment rate Q2: 84.63% → rounded to 85%
    cy.contains("$48,464").should("exist"); // median salary Q2: $48,463.92 → rounded to $48,464

    // check for practical nursing content
    cy.contains("Medical Assistant").should("exist");
 
    // quick stats
    cy.contains("HS diploma or GED").should("exist");
    cy.contains("Completion Time").should("exist");

    // associated occupations for nursing
    cy.contains("Medical Assistants").should("exist");

    // share trainings
    cy.contains("How to get funding").should("exist");
    cy.contains(
      "Trainings related to occupations on the In - Demand Occupations List may be eligible for funding. Contact your local One-Stop Career Center for more information regarding program and training availability."
    ).should("exist");
    cy.contains(
      "You can also check out other tuition assistance opportunities."
    ).should("exist");

    // provider details - Lincoln Technical Institute
    cy.contains("span", "Lincoln Technical Institute").should("exist");
    cy.contains("240 Bergen Town Center").should("exist");
    cy.contains("Paramus, NJ 07652").should("exist");
    cy.contains("Laurie Pringle").should("exist");
    cy.contains("(201) 845-6868").should("exist");
    cy.contains("www.lincolntech.com").should("exist");

    cy.checkA11y();
  });
});
