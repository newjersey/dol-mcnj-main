xdescribe("Career Pathways Page", () => {
  it("is accessible", () => {
    cy.visit("/career-pathways");
    cy.injectAxe();

    cy.contains("Explore popular industries and careers in the state of New Jersey.").should(
      "exist",
    );
    cy.checkA11y();
  });

  it("pathway is accessible", () => {
    cy.visit("/career-pathways/healthcare");
    cy.injectAxe();

    cy.contains(
      "Select a field and explore different career pathways or click the tool tip to learn more about it.",
    ).should("exist");
    cy.checkA11y();
  });

  it("toggle open close industry detail tray", () => {
    let path = "/career-pathways";
    cy.visit(path);
    cy.get("span").contains("Healthcare").click();
    cy.get(".explore-button").contains("Healthcare").click();
    cy.get(".panel .open");
    cy.get("button.close").first().click();
  });
});
