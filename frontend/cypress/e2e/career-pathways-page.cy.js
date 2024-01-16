// Define at the top of the spec file or just import it
function terminalLog(violations) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`
  )
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length
    })
  )

  cy.task('table', violationData)
};

describe("Career Pathways Page", () => {
  it("is accessible", () => {
    cy.visit("/career-pathways");
    cy.injectAxe();

    cy.contains("Explore popular industries and careers in the state of New Jersey.").should(
      "exist",
    );
    cy.checkA11y(null, null, terminalLog);
  });

  it("pathway is accessible", () => {
    cy.visit("/career-pathways/healthcare");
    cy.injectAxe();

    cy.contains(
      "Select a field and explore different career pathways or click the tool tip to learn more about it.",
    ).should("exist");
    cy.checkA11y(null, null, terminalLog);
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

