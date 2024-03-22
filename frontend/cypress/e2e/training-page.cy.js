describe("Training Page", () => {
  it("displays training details", () => {
    cy.visit("/training/ce-ef0602b1-1f09-4fdc-a30b-e7f3bf7367bb");
    cy.injectAxe();

    // titles
    cy.contains("Forklift Operations").should("exist");
    cy.contains("h3", "E-Z Wheels Driving School, Inc. - Hopelawn_ETP_ETP").should("exist");

    // stat boxes
    cy.contains("In-Demand").should("exist");
    //cy.contains("35.2%").should("exist");
    //cy.contains("$27,556").should("exist");

    // description
    cy.contains(
        "This program consists of classroom instructions to prepare for the written tests, instruction videos and one-one-one training on state of the art equipment.",
    ).should("exist");

    // quick facts
    cy.contains(
      "Certifications: Certificate of Completion",
    ).should("exist");
    cy.contains(
        "Prerequisites: Candidate must be 18 years of age and have a basic driver's license",
    ).should("exist");
    cy.contains(
      "20 hours",
    ).should("exist");
    cy.contains(
      "490205",
    ).should("exist");
    //cy.contains("Completion time: 6-12 months").should("exist");

    // associated occupations
    cy.contains("Career/Technical Education Teachers, Postsecondary").should("exist");
    cy.contains("Heavy and Tractor-Trailer Truck Drivers").should("exist");

    // share trainings
    cy.contains(
        "This training leads to an occupation that is in-demand, which may qualify for " +
        "funding. Contact your NJ County One-Stop Career, who will help determine funding " +
        "eligibility, and share this training page with them.",
    ).should("exist");
    cy.contains("Copy a link to this training opportunity").should("exist");
    cy.contains("Save and print this training opportunity").should("exist");
    cy.contains("Learn more about funding options and One-Stop Centers").should("exist");

    // cost
    cy.contains("$800.00").should("exist");
/*    cy.contains("$13,500.00").should("exist");
    cy.contains("$0.00").should("exist");
    cy.contains("$1,810.00").should("exist");
    cy.contains("$2,320.00").should("exist");
    cy.contains("$225.00").should("exist");*/

    // provider details
    cy.contains("span", "E-Z Wheels Driving School, Inc. - Hopelawn_ETP_ETP").should("exist");
/*    cy.contains("2770 Red Lion Road").should("exist");
    cy.contains("Philadelphia, PA 19114").should("exist");
    cy.contains("Debbie Bello").should("exist");
    cy.contains("Director of Admissions").should("exist");
    cy.contains("(215) 728-4733").should("exist");*/
    cy.contains("ezwheels@hotmail.com").should("exist");
    cy.contains("http://ezwheelsdriving.com").should("exist");

    cy.checkA11y();
  });

  it("does not display share training description text for non in-demand training", () => {
    cy.visit("/training/37431");
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
