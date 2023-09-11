describe("Career Pathway Page", () => {
  it("Toggle open close industry detail tray - ", () => {
    let path = "/career-pathways";
    cy.visit(path);
    cy.get("span").contains("Healthcare").click();
    cy.get(".explore-button").contains("Healthcare").click();
    cy.get(".panel .open");
    cy.get("button.close").first().click();
  });
});
