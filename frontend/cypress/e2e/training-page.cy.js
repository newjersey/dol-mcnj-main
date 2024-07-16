describe("Training Page", () => {
  it("displays training details", () => {
    cy.visit("/training/ce-ef0602b1-1f09-4fdc-a30b-e7f3bf7367bb");
    cy.injectAxe();

    // titles
    cy.contains("Forklift Operations").should("exist");
    cy.contains("h3", "E-Z Wheels Driving School, Inc. - Hopelawn").should("exist");

    // stat boxes
    cy.contains("In-Demand").should("exist");
    //cy.contains("35.2%").should("exist");
    //cy.contains("$27,556").should("exist");

    // description
    cy.contains(
      "This program consists of classroom instructions to prepare for the written tests, instruction videos and one-one-one training on state of the art equipment.",
    ).should("exist");

    // quick facts
    cy.contains("Certifications: Certificate of Completion").should("exist");
    cy.contains(
      "Prerequisites: Candidate must be 18 years of age and have a basic driver's license",
    ).should("exist");
    //cy.contains("20 hours").should("exist");
    cy.contains("49.0205").should("exist");
    //cy.contains("Completion time: 6-12 months").should("exist");

    // associated occupations
    cy.contains("Vocational Education Teachers, Postsecondary").should("exist");
    // cy.contains("Heavy and Tractor-Trailer Truck Drivers").should("exist");

    // share trainings
    cy.contains("How to get funding").should("exist");
    cy.contains(
      "Trainings related to occupations on the In - Demand Occupations List may be eligible for funding. Contact your local One-Stop Career Center for more information regarding program and training availability.",
    ).should("exist");
    cy.contains("You can also check out other tuition assistance opportunities.").should("exist");

    // cost
    cy.contains("$3,995.00").should("exist");
    cy.contains("$2,088.00").should("exist");
    cy.contains("$154.00").should("exist");
    cy.contains("$0.00").should("exist");
    cy.contains("$1,753.00").should("exist");
    cy.contains("$0.00").should("exist");

    // provider details
    cy.contains("span", "Lincoln Technical Institute").should("exist");
    cy.contains("2299 Vauxhall Rd.").should("exist");
    cy.contains("Union, NJ 07083").should("exist");
    cy.contains("Kevin L. Kirkley").should("exist");
    cy.contains("Director").should("exist");
    cy.contains("(908) 964-7800 Ext: 40253").should("exist");
    cy.contains("www.lincolntech.com").should("exist");

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
