describe("Training Explorer Page", () => {
  // it("is accessible", () => {
  //   cy.visit("/");
  //   cy.injectAxe();

  //   cy.contains("Certifications, Professional Development, Apprenticeships & More!").should(
  //     "exist",
  //   );
  //   cy.checkA11y();
  // });

  it("Local in demand training county tags", () => {
    cy.visit("https://d4ad-research.uk.r.appspot.com/in-demand-occupations");
    cy.get(".pas").each(($sub_menu) => {
      cy.wrap($sub_menu).click()
      cy.get("span").each($indemand => {
        cy.wrap($indemand)
      });
    })
  });
});
