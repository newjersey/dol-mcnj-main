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
    cy.contains("6-12 months to complete").should("exist");

    // associated occupations
    cy.contains("Health Specialties Teachers, Postsecondary").should("exist");
    cy.contains("Massage Therapists").should("exist");

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
});
