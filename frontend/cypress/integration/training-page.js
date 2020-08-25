describe("Training Page", () => {
  it("displays training details", () => {
    cy.visit("/training/48216");
    cy.injectAxe();

    cy.contains("Welding (w/ Trade Math Lab and Pro. Dev.)").should("exist");

    cy.contains("In Demand").should("exist");
    cy.contains("77.5%").should("exist");
    cy.contains("$27,284").should("exist");

    cy.contains(
      "Welding students are taught state-of-the-art techniques in gas welding, " +
        "electric (ARC) welding, Tungsten Inert Gas (TIG) welding, and Metallic Inert Gas (MIG) " +
        "welding. These disciplines require the use of steel, stainless steel, everdure, aluminum " +
        "and pipe. Students proceed through each project at their own rate of speed and " +
        "receive individualized instruction regarding safety, quality and general welding " +
        "techniques. This class also includes 1 hour per day of a trade mathematics lab and/or " +
        "professional development prior to the start of the regularly scheduled Welding program " +
        "(141 hours total)."
    ).should("exist");

    cy.contains("6-12 months to complete").should("exist");
    cy.contains("Welders, Cutters, Solderers, and Brazers").should("exist");
    cy.contains("Welding, Soldering, and Brazing Machine Setters, Operators, and Tenders").should(
      "exist"
    );

    cy.contains("$5,100.00").should("exist");

    cy.contains("Camden County College - Continuing Education").should("exist");
    cy.contains("Continuing Education").should("exist");
    cy.contains("200 College Drive").should("exist");
    cy.contains("Blackwood, NJ 08012").should("exist");
    cy.contains("Kaina Hanna").should("exist");
    cy.contains("Project Coordinator").should("exist");
    cy.contains("(856) 874-6004").should("exist");
    cy.contains("www.camdencc.edu").should("exist");

    cy.checkA11y();
  });
});
