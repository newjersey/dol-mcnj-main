describe("Training Page", () => {
  it("displays training details", () => {
    cy.visit("/training/36803");
    cy.injectAxe();

    // titles
    cy.contains("Massage Therapy Certification").should("exist");
    cy.contains("h3", "Therapeutic Massage & Training Center").should("exist");

    // stat boxes
    cy.contains("In Demand").should("exist");
    cy.contains("69.6%").should("exist");
    cy.contains("$23,224").should("exist");

    // description
    cy.contains(
      "Program teaches massage techniques with related studies in Anatomy, Physiology " +
        "and Pathology, Neuromuscular techniques and professional ethics. Includes " +
        "instruction in business law, practice and marketing, student clinic and CPR. " +
        "Includes basic Shiatsu points, stretching, hydrotherapy, body mechanics, deep " +
        "tissue massage, chair massage, introduction to Thai massage, hands-on energy, " +
        "hot stone massage, aromatherapy, reflexology, oriental theory, and tuning fork " +
        "sound therapy. All studies lead to a New Jersey State License in Massage Therapy."
    ).should("exist");

    // quick stats
    cy.contains("Prerequisites: HS Diploma/GED").should("exist");
    cy.contains("Completion time: 6-12 months").should("exist");

    // associated occupations
    cy.contains("Health Specialties Teachers, Postsecondary").should("exist");
    cy.contains("Massage Therapists").should("exist");

    // share trainings
    cy.contains(
      "This training leads to an occupation that is in-demand, which may qualify for " +
        "funding. Contact your NJ County One-Stop Career, who will help determine funding " +
        "eligibility, and share this training page with them."
    ).should("exist");
    cy.contains("Copy a link to this training opportunity").should("exist");
    cy.contains("Save and print this training opportunity").should("exist");
    cy.contains("Learn more about funding options and One-Stop Centers").should("exist");

    // cost
    cy.contains("$8,790.00").should("exist");
    cy.contains("$8,400.00").should("exist");
    cy.contains("$125.00").should("exist");
    cy.contains("$200.00").should("exist");
    cy.contains("$65.00").should("exist");
    cy.contains("$0.00").should("exist");

    // provider details
    cy.contains("span", "Therapeutic Massage & Training Center").should("exist");
    cy.contains("560 Springfield Avenue - Suite F & H").should("exist");
    cy.contains("Westfield, NJ 07090").should("exist");
    cy.contains("Arlene Reardon").should("exist");
    cy.contains("President").should("exist");
    cy.contains("(908) 789-2288").should("exist");
    cy.contains("www.massagetrainingcenter.com").should("exist");

    cy.checkA11y();
  });

  it("does not display share training description text for non in-demand training", () => {
    cy.visit("/training/50649");
    cy.injectAxe();

    // cy.contains("Copy a link to this training opportunity").should("exist");
    cy.contains("Save and print this training opportunity").should("exist");
    cy.contains("Learn more about funding options and One-Stop Centers").should("exist");
    cy.contains(
      "This training leads to an occupation that is in-demand, which may qualify for " +
        "funding. Contact your NJ County One-Stop Career, who will help determine funding " +
        "eligibility, and share this training page with them."
    ).should("not.exist");
  });
});
