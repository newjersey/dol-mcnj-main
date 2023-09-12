describe("Training Explorer Page", () => {
  it("is accessible", () => {
    cy.visit("/");
    cy.injectAxe();

    cy.contains("Certifications, Professional Development, Apprenticeships & More!").should(
      "exist",
    );
    cy.checkA11y();
  });
});

describe("Main Page Navigation", () => {
  it("is accessible", () => {
    cy.visit("/");
    cy.injectAxe();

    cy.contains("Certifications, Professional Development, Apprenticeships & More!").should(
      "exist",
    );
    cy.checkA11y();
  });
});


// describe("Home Page", () => {
//   it("is accessible", () => {
//     cy.visit("/");
//     cy.injectAxe();

//     cy.contains(
//       "Your home for career exploration, job training, and workforce support tools and resources."
//     ).should("exist");
//     cy.checkA11y();
//   });

//   it("displays all cards", () => {
//     const testData = [
//       {title: 'Find a Job', link: '#jobs'},
//       {title: 'Get Training', link: '#training'},
//       {title: 'Explore Careers', link: '#explore'},
//       {title: 'Support and Assistance', link: '#support'},
//       {title: 'Career One-Stop Job Board', link: 'https://www.careeronestop.org'},
//       {title: 'Career Navigator', link: '/career-navigator'},
//       {title: 'In-demand Occupations List', link: '/in-demand-occupations'},
//       {title: 'Labor Market Insights', link: '/market-insights'},
//       {title: 'Apprenticeship Programs', link: 'https://google.com'},
//       {title: 'Training Explorer', link: '/training-explorer'},
//       {title: 'Tuition assistance resources', link: '/tuition-assistance'},
//       {title: 'SkillUp', link: 'https://explore.skillup.org/'},
//       {title: 'Training Provider Resources', link: '/training-provider-resources'},
//       {title: 'Career Pathways', link: '/career-pathways'},
//       {title: 'Career Navigator', link: '/career-navigator'},
//       {title: 'Browse support by category', link: '/support-resources'},
//       {title: 'Career Support', link: '/support-resources/career-support'},
//       {title: 'Tuition Assistance', link: '/support-resources/tuition-assistance'},
//       {title: 'Other Assistance', link: '/support-resources/other'},
//       {title: 'Frequently Asked Questions', link: '/faq'},
//     ];

//     cy.visit("/");
//     testData.forEach((testItem) => {
//       cy.get('.iconCard').contains(testItem.title)
//           .closest('a')
//           .should('have.attr', 'href', testItem.link);
//     });
//   })
// });
