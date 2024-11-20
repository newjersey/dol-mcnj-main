describe("Training Page", () => {
  it("displays training details", () => {
    cy.visit("/training/ce-58ea4f49-08ab-493d-b88d-cf36d507e536");
    cy.injectAxe();

    // titles
    cy.contains("ELDT Training").should("exist");
    cy.contains("h3", "BH Test Organization").should("exist");

    // stat boxes
    cy.contains("In-Demand").should("exist");
    //cy.contains("35.2%").should("exist");
    //cy.contains("$27,556").should("exist");

    // description
    cy.contains(
      "If you do not yet hold a CLP, or if your CLP was issued on or after February 7th, 2022, you must complete entry-level driver training before you will be permitted to take your CDL skills test.",
    ).should("exist");

    // quick facts
    cy.contains("Certifications: Drivers License, Truck Driver License, Truck Driver Credentialing Agency").should("exist");
    cy.contains(
      "Prerequisites: Must be 18 years of age and possess a driver's license.",
    ).should("exist");
    //cy.contains("20 hours").should("exist");
    cy.contains("49.0205").should("exist");
    cy.contains("Completion time: 4-11 weeks").should("exist");

    // associated occupations
    cy.contains("Agricultural Engineers").should("exist");
    // cy.contains("Heavy and Tractor-Trailer Truck Drivers").should("exist");

    // share trainings
    cy.contains("How to get funding").should("exist");
    cy.contains(
      "Trainings related to occupations on the In - Demand Occupations List may be eligible for funding. Contact your local One-Stop Career Center for more information regarding program and training availability.",
    ).should("exist");
    cy.contains("You can also check out other tuition assistance opportunities.").should("exist");

    // cost
    cy.contains("$4,409.00").should("exist");
    cy.contains("$3,600.00").should("exist");
    cy.contains("$450.00").should("exist");
    cy.contains("$150.00").should("exist");
    cy.contains("$110.00").should("exist");
    cy.contains("$99.00").should("exist");

    // location details
    cy.contains("span", "BH Test Organization").should("exist");
    cy.contains("1339 Broad St").should("exist");
    cy.contains("Bloomfield, New Jersey 07003").should("exist");
    //cy.contains("Debbie Bello").should("exist");
    //cy.contains("Director of Admissions").should("exist");
    //cy.contains("(215) 728-4733").should("exist");
    cy.contains("bhauss@agatesoftware.com").should("exist");
    cy.contains("https://agatesoftware.com/").should("exist");

    cy.checkA11y();
  });

  it.skip("does not display share training description text for non in-demand training", () => {
    cy.visit("/training/ce-a7f0356a-2ac2-4c36-aa18-a72a1b7f1e23");
    cy.injectAxe();

    cy.contains("Copy a link to this training opportunity").should("exist");
    cy.contains("Save and print this training opportunity").should("exist");
    cy.contains("Learn more about funding options and One-Stop Centers").should("exist");
    cy.contains(
      "This training leads to an occupation that is in-demand, which may qualify for " +
        "funding. Contact your NJ County One-Stop Career, who will help determine funding " +
        "eligibility, and share this training page with them.",
    ).should("not.exist");
  });
});
