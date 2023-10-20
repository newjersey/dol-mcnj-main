describe("Training Page", () => {
  it("displays training details", () => {
    cy.visit("/training/33127");
    cy.injectAxe();

    // titles
    cy.contains("Building Maintenance").should("exist");
    cy.contains("h3", "Orleans Technical College").should("exist");

    // stat boxes
    cy.contains("In Demand").should("exist");
    cy.contains("35.2%").should("exist");
    cy.contains("$27,556").should("exist");

    // description
    cy.contains(
      "This program teaches diversified skills needed to maintain and renovate commercial and residential properties. Students are taught basic skills in electricity, carpentry, plumbing, heating and air conditioning maintenance. Training also includes painting, papering, and tiling. Students acquire skills in appliance repair.",
    ).should("exist");

    // quick stats
    cy.contains(
      "Prerequisites: High school Diploma or GED, valid driver's license, pass math/reading entrance test",
    ).should("exist");
    cy.contains("Completion time: 6-12 months").should("exist");

    // associated occupations
    cy.contains("Facilities Managers").should("exist");
    cy.contains("Maintenance and Repair Workers, General").should("exist");

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
    cy.contains("$17,855.00").should("exist");
    cy.contains("$13,500.00").should("exist");
    cy.contains("$0.00").should("exist");
    cy.contains("$1,810.00").should("exist");
    cy.contains("$2,320.00").should("exist");
    cy.contains("$225.00").should("exist");

    // provider details
    cy.contains("span", "Orleans Technical College").should("exist");
    cy.contains("2770 Red Lion Road").should("exist");
    cy.contains("Philadelphia, PA 19114").should("exist");
    cy.contains("Debbie Bello").should("exist");
    cy.contains("Director of Admissions").should("exist");
    cy.contains("(215) 728-4733").should("exist");
    cy.contains("www.orleanstech.edu").should("exist");

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
