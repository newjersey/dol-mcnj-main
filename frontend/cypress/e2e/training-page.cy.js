describe("Training Page", () => {
  it("displays training details", () => {
    cy.visit("/training/45957");
    cy.injectAxe();

    // titles
    cy.contains(".NET Developer").should("exist");
    cy.contains("h3", "IT America, Inc.").should("exist");

    // stat boxes
    cy.contains("In-Demand in all of New Jersey.").should("exist");
    cy.contains("42.8%").should("exist");

    // description
    cy.contains(
      ".Net Developer program focuses on providing development skills needed to successfully develop Web/Windows applications using both Visual Basic and C# languages. Taught by experienced/senior program developers, the program takes step-by-step from programming basics to application development; analyze and validate business requirements from development prospective; client/server communication and related performance standards. Upon completion of the program, student will gain knowledge on .NET development and have a substantial portfolio demonstrating all aspects of work performing a project",
    ).should("exist");

    // quick stats
    cy.contains(
      "Prerequisites: High school diploma; Working Knowledge of any Operating System and Internet Browser",
    ).should("exist");
    cy.contains("Completion time: 3-5 months").should("exist");

    // associated occupations
    cy.contains("Computer Network Support Specialists").should("exist");
    cy.contains("Computer Programmers").should("exist");

    // share trainings
    cy.contains(
      "This training leads to an occupation that is in-demand, which may qualify for funding. Contact your NJ County One-Stop Career, who will help determine funding eligibility, and share this training page with them.",
    ).should("exist");
    cy.contains("Copy a link to this training opportunity").should("exist");
    cy.contains("Save and print this training opportunity").should("exist");
    cy.contains("Learn more about funding options and One-Stop Centers").should("exist");

    // cost
    cy.contains("$4,000.00").should("exist");
    cy.contains("$3,800.00").should("exist");
    cy.contains("$100.00").should("exist");
    cy.contains("$0.00").should("exist");

    // provider details
    cy.contains("span", "IT America, Inc.").should("exist");
    cy.contains("100 Metroplex Drive").should("exist");
    cy.contains("Suite 207").should("exist");
    cy.contains("Edison, NJ 08817").should("exist");
    cy.contains("Praveen Kumar Thadakamalla").should("exist");
    cy.contains("Director").should("exist");
    cy.contains("(732) 497-9989").should("exist");
    cy.contains("www.itamericaschool.com").should("exist");

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
