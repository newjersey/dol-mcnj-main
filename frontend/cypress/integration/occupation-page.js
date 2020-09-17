describe("Occupation Page", () => {
  it("displays occupation details from ONET", () => {
    cy.visit("/occupation/17-2051");
    cy.injectAxe();

    cy.contains("Civil Engineers").should("exist");

    cy.contains("$97,820");

    cy.contains(
      "Perform engineering duties in planning, designing, and overseeing construction and maintenance of building structures, and facilities, such as roads, railroads, airports, bridges, harbors, channels, dams, irrigation projects, pipelines, power plants, and water and sewage systems."
    ).should("exist");

    cy.contains(
      "Inspect project sites to monitor progress and ensure conformance to design specifications and safety or sanitation standards."
    ).should("exist");
    cy.contains(
      "Compute load and grade requirements, water flow rates, or material stress factors to determine design specifications."
    ).should("exist");
    cy.contains(
      "Provide technical advice to industrial or managerial personnel regarding design, construction, program modifications, or structural repairs."
    ).should("exist");
    cy.contains(
      "Test soils or materials to determine the adequacy and strength of foundations, concrete, asphalt, or steel."
    ).should("exist");
    cy.contains(
      "Manage and direct the construction, operations, or maintenance activities at project site."
    ).should("exist");

    cy.contains("See More").click();

    cy.contains(
      "Direct or participate in surveying to lay out installations or establish reference points, grades, or elevations to guide construction."
    ).should("exist");
    cy.contains(
      "Estimate quantities and cost of materials, equipment, or labor to determine project feasibility."
    ).should("exist");
    cy.contains(
      "Plan and design transportation or hydraulic systems or structures, using computer-assisted design or drawing tools."
    ).should("exist");
    cy.contains(
      "Prepare or present public reports on topics such as bid proposals, deeds, environmental impact statements, or property and right-of-way descriptions."
    ).should("exist");
    cy.contains("Design energy-efficient or environmentally sound civil structures.").should(
      "exist"
    );
    cy.contains(
      "Identify environmental risks and develop risk management strategies for civil engineering projects."
    ).should("exist");
    cy.contains(
      "Direct engineering activities, ensuring compliance with environmental, safety, or other governmental regulations."
    ).should("exist");
    cy.contains(
      "Analyze survey reports, maps, drawings, blueprints, aerial photography, or other topographical or geologic data."
    ).should("exist");
    cy.contains(
      "Conduct studies of traffic patterns or environmental conditions to identify engineering problems and assess potential project impact."
    ).should("exist");
    cy.contains(
      "Design or engineer systems to efficiently dispose of chemical, biological, or other toxic wastes."
    ).should("exist");
    cy.contains(
      "Develop or implement engineering solutions to clean up industrial accidents or other contaminated sites."
    ).should("exist");
    cy.contains(
      "Analyze manufacturing processes or byproducts to identify engineering solutions to minimize the output of carbon or other pollutants."
    ).should("exist");

    cy.contains("See Less").should("exist");

    cy.contains(
      "Civil engineers need a bachelor’s degree in civil engineering, in one of its specialties, or in civil engineering technology. They typically need a graduate degree and licensure for promotion to senior positions. Although licensure requirements vary by state, civil engineers usually must be licensed if they provide services directly to the public."
    ).should("exist");

    cy.checkA11y();
  });

  it("displays occupation details from ONET for 2010 socs", () => {
    cy.visit("/occupation/15-1254");
    cy.contains("Web Developers").should("exist");

    cy.contains("--").should("exist");

    cy.contains(
      "Design, create, and modify Web sites. Analyze user needs to implement Web site content, graphics, performance, and capacity. May integrate Web sites with other computer applications. May convert written, graphic, audio, and video components to compatible Web formats by using software designed to facilitate the creation of Web and multimedia content."
    ).should("exist");

    cy.contains("Write supporting code for Web applications or Web sites.").should("exist");
    cy.contains(
      "Design, build, or maintain Web sites, using authoring or scripting languages, content creation tools, management tools, and digital media."
    ).should("exist");
    cy.contains(
      "Back up files from Web sites to local directories for instant recovery in case of problems."
    ).should("exist");
    cy.contains(
      "Write, design, or edit Web page content, or direct others producing content."
    ).should("exist");
    cy.contains("Select programming languages, design tools, or applications.").should("exist");

    cy.contains("This data is not yet available for this occupation.").should("exist");
  });

  it("displays occupation details from BLS descriptions for non-ONET socs", () => {
    cy.visit("/occupation/15-1255");
    cy.contains("Web and Digital Interface Designers").should("exist");

    cy.contains("--").should("exist");

    cy.contains(
      "Design digital user interfaces or websites. Develop and test layouts, interfaces, functionality, and navigation menus to ensure compatibility and usability across browsers or devices. May use web framework applications as well as client-side code and processes. May evaluate web design following web and accessibility standards, and may analyze web use metrics and optimize websites for marketability and search engine ranking. May design and test interfaces that facilitate the human-computer interaction and maximize the usability of digital devices, websites, and software with a focus on aesthetics and design. May create graphics used in websites and manage website content and links. Excludes “Special Effects Artists and Animators” (27-1014) and “Graphic Designers” (27-1024)."
    ).should("exist");

    cy.contains("This data is not yet available for this occupation.").should("exist");
  });
});
