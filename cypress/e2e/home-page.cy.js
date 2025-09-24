describe("Home Page", () => {
  it("is accessible", () => {
    cy.visit("/");
    cy.injectAxe();

    cy.contains("Top Tools:").should("exist");
    cy.checkA11y();
  });

  it("displays all cards", () => {
    const testData = [
      { title: "NJ Career Navigator", link: "/navigator" },
      { title: "NJ Training Explorer", link: "/training" },
      { title: "NJ Career Pathways", link: "/career-pathways" },
      { title: "I want to find a job", link: "/tools#jobs" },
      { title: "I want to search for training", link: "/tools#training" },
      {
        title: "I want to explore career opportunities",
        link: "/tools#career",
      },
      { title: "I need additional resources", link: "/tools#support" },
    ];

    cy.visit("/");
    testData.forEach((testItem) => {
      cy.get(".cardItem")
        .contains(testItem.title)
        .closest("a")
        .should("have.attr", "href", testItem.link);
    });
  });

  it.skip("Displays the Update Notifier", () => {
    cy.visit("/");
    cy.contains(
      "Want updates on new tools and features from My Career NJ?"
    ).should("exist");
  });

  it.skip("Displays the error message when email is not valid, and then go away when valid email is typed", () => {
    cy.visit("/");
    cy.get("input[name='input-email']").type("test");
    cy.get("input[name='input-email']").blur();
    cy.contains("Please enter a valid email address").should("exist");
    cy.get("input[name='input-email']").type("@test.com");
    cy.contains("Please enter a valid email address").should("not.exist");
  });

  it.skip("Displays the success message when valid email is submitted", () => {
    cy.visit("/");
    cy.get("input[name='input-email']").type("test@test.com");
    cy.get("input[name='input-email']").blur();
    cy.get("button[type='submit']").click();
    cy.wait(1000);
    cy.contains("Success!").should("exist");
  });
});
