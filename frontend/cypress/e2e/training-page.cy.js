describe("Training Page", () => {
  it("displays training details", () => {
    cy.visit("/training/47148");
    cy.injectAxe();

    // titles
    cy.contains("Building Maintenance Technician").should("exist");
    cy.contains("h3", "Lincoln Technical Institute").should("exist");

    // stat boxes
    cy.contains("In-Demand").should("exist");
    cy.contains("60.4%").should("exist");
    cy.contains("$29,890").should("exist");

    // description
    cy.contains(
      "This four unit course of study is designed to introduce students to preventive maintenance concepts as they apply to Heating, Ventilation and Air Conditioning systems.",
    ).should("exist");

    // quick stats
    cy.contains("High School Diploma or GED").should("exist");
    cy.contains("Completion time: 3-5 months").should("exist");

    // associated occupations
    cy.contains("Engineering Technologists and Technicians, Except Drafters, All Other").should(
      "exist",
    );
    cy.contains("Heating, Air Conditioning, and Refrigeration Mechanics and Installers").should(
      "exist",
    );

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
});
