
describe("Map expands", () => {
  let paths = [
    {
      label: "Machining Career Pathways",
      main_contains: "Machining",
    },

    {
      label: "Quality Assurance Career Pathways",
      main_contains: "Quality Assurance",
    },
    {
      label: "Production Pathways",
      main_contains: "Production",
    },
  ];

  paths.forEach((item) => {
    it(item.label, () => {
      let path =
        "https://d4ad-research2.uk.r.appspot.com/career-pathways/manufacturing";
      cy.visit(path).get(".button-radio").contains(item.main_contains).click();
      cy.get(`[aria-label="occupation-selector"]`).click();
      cy.get(`[aria-label="occupation-item"]`).each(($button, index, list) => {
        let path =
          "https://d4ad-research2.uk.r.appspot.com/career-pathways/manufacturing";
        cy.visit(path).get(".button-radio").contains("Machining").click();
        cy.get(`[aria-label="occupation-selector"]`).click();
        cy.get(`[aria-label="occupation-item"]`).eq(index).click();
        cy.get(".path-stop").should("have.length.greaterThan", 1);
      });
    });
  });
});