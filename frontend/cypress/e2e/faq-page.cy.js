const faq_data = {
  "training-explorer": [
    "training",
    "tuition-assistance-for-training",
    "data-sources"
  ],
  "eligible-training-provider-list": [
    "etpl-program-general-information",
    "etpl-information-for-students",
    "etpl-information-for-providers",
  ],
  "indemand-occupations": [
    "indemand-occupations-list",
  ],
  "private-career-schools": []
}

const faq_groups = Object.keys(faq_data);


describe("FAQ Page", () => {
  it("is accessible", () => {
    cy.visit("/faq");
    cy.injectAxe();

    cy.contains("Get answers to all of your NJ Career Central questions").should("exist");
    cy.checkA11y();
  });

  it("opens the Training Explorer group and Training section on the FAQ page", () => {
    cy.visit("/faq");
    cy.url().should("include", "#training");
  });
});
