describe("Home Page", () => {
  it("is accessible", () => {
    cy.visit("/");
    cy.injectAxe();

    cy.contains("Explore Tools").should("exist");
    cy.checkA11y();
  });

  it("displays all cards", () => {
    const testData = [
      { title: "Find a Job", link: "#jobs" },
      { title: "Get Training", link: "#training" },
      // { title: "Explore Careers", link: "#explore" },
      { title: "Support and Assistance", link: "#support" },
      { title: "Career One-Stop Job Board", link: "https://www.careeronestop.org" },
      // { title: "Career Navigator", link: "/career-navigator" },
      { title: "In-demand Occupations List", link: "/in-demand-occupations" },
      {
        title: "Apprenticeship Programs",
        link: "https://www.nj.gov/labor/career-services/apprenticeship/",
      },
      { title: "Training Explorer", link: "/training" },
      { title: "Tuition assistance resources", link: "/support-resources/tuition-assistance" },
      { title: "SkillUp", link: "https://explore.skillup.org/" },
      { title: "Training Provider Resources", link: "/training-provider-resources" },
      // { title: "Career Pathways", link: "/career-pathways" },
      { title: "Career Navigator", link: "/career-navigator" },
      { title: "Browse support by category", link: "/support-resources" },
      { title: "Career Support", link: "/support-resources/career-support" },
      { title: "Tuition Assistance", link: "/support-resources/tuition-assistance" },
      { title: "Other Assistance", link: "/support-resources/other" },
      { title: "Frequently Asked Questions", link: "/faq" },
    ];

    cy.visit("/");
    testData.forEach((testItem) => {
      cy.get(".iconCard")
        .contains(testItem.title)
        .closest("a")
        .should("have.attr", "href", testItem.link);
    });
  });
});
