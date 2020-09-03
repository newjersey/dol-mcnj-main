describe("Occupation Page", () => {
  it("displays occupation details from ONET", () => {
    cy.visit("/occupation/17-2051");
    cy.injectAxe();

    cy.contains("Civil Engineers").should("exist");
    cy.contains(
      "Perform engineering duties in planning, designing, and overseeing construction and maintenance of building structures, and facilities, such as roads, railroads, airports, bridges, harbors, channels, dams, irrigation projects, pipelines, power plants, and water and sewage systems."
    ).should("exist");

    cy.checkA11y();
  });

  it("displays occupation details from ONET for 2010 socs", () => {
    cy.visit("/occupation/15-1254");
    cy.contains("Web Developers").should("exist");
    cy.contains(
      "Design, create, and modify Web sites. Analyze user needs to implement Web site content, graphics, performance, and capacity. May integrate Web sites with other computer applications. May convert written, graphic, audio, and video components to compatible Web formats by using software designed to facilitate the creation of Web and multimedia content."
    ).should("exist");
  });

  it("displays occupation details from BLS descriptions for non-ONET socs", () => {
    cy.visit("/occupation/15-1255");
    cy.contains("Web and Digital Interface Designers").should("exist");
    cy.contains(
      "Design digital user interfaces or websites. Develop and test layouts, interfaces, functionality, and navigation menus to ensure compatibility and usability across browsers or devices. May use web framework applications as well as client-side code and processes. May evaluate web design following web and accessibility standards, and may analyze web use metrics and optimize websites for marketability and search engine ranking. May design and test interfaces that facilitate the human-computer interaction and maximize the usability of digital devices, websites, and software with a focus on aesthetics and design. May create graphics used in websites and manage website content and links. Excludes “Special Effects Artists and Animators” (27-1014) and “Graphic Designers” (27-1024)."
    ).should("exist");
  });
});
