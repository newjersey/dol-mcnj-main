describe("FAQ Page", () => {
  it("is accessible", () => {
    cy.visit("/faq");
    cy.injectAxe();

    cy.contains("Get answers to all of your").should("exist");
    cy.checkA11y();
  });

  describe("default page", () => {
    beforeEach(() => {
      cy.visit("/faq");
    });
    it("should include default link in url", () => {
      cy.url().should("include", "/faq");
    });
    it("should have only default navigation group open", () => {
      cy.get("[data-testid=accordion]").should("have.length", 3);
    });

    it("should have only the default link active", () => {
      cy.get("[data-testid=topic-selector] .dropGroup")
        .first()
        .should("have.class", "active");

      cy.get("[data-testid=topic-selector] .dropGroup.active li")
        .first()
        .should("have.class", "active");
    });
    it("should show default accordion content", () => {
      cy.contains(
        "The types of training you will find on this website range from private career schools, non-profit schools, community colleges, vocational schools, literacy programs, short-term occupational and skills training programs, and registered apprenticeships. There are also a select number of higher education programs on this list.",
      ).should("exist");
    });
  });

  describe("visiting faq page with specific #link in url", () => {
    beforeEach(() => {
      cy.visit("/faq#etpl-information-for-students");
    });

    it("should have correct navigation group visible", () => {
      cy.get("[data-testid=accordion]").should("have.length", 6);
    });
    it("should show correct link as active", () => {
      cy.get("[data-testid=topic-selector] .dropGroup")
        .eq(1)
        .should("have.class", "active");

      cy.get("[data-testid=topic-selector] .dropGroup.active li")
        .eq(1)
        .should("have.class", "active");
    });
    it("should show correct accordion content", () => {
      cy.contains(
        "New Jersey Training Explorer is also part of My Career NJ digital portal. You can also access NJ Career Navigator, an AI-powered recommendation engine to help career seekers identify jobs, career changes, and training programs that maximize their economic mobility. This is an authenticated experience that requires users to log in and provide information about their education and work experience.",
      ).should("exist");
    });
  });

  describe("active links", () => {
    beforeEach(() => {
      cy.visit("/faq");
    });

    it("should change the active link when clicked", () => {
      cy.get("[data-testid=topic-selector] .dropGroup").eq(1).click();
      cy.get(
        "[data-testid=topic-selector] .dropGroup.active:nth-child(2) li:first-of-type > button",
      ).click();

      cy.get(
        "[data-testid=topic-selector] .dropGroup.active:nth-child(2) li:first-of-type",
      ).should("have.class", "active");
    });
    it("should change the url when clicked", () => {
      cy.get("[data-testid=topic-selector] .dropGroup").eq(1).click();
      cy.get(
        "[data-testid=topic-selector] .dropGroup.active:nth-child(2) li:first-of-type > button",
      ).click();

      //new url should include the #link
      cy.url().should("include", "/faq#etpl-program-general-information");
    });
  });
});
