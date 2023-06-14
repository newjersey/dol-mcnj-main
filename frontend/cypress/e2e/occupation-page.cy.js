// fix leak
xdescribe("Occupation Page", () => {
  it("displays occupation details from ONET", () => {
    cy.server();
    cy.route("api/occupations/17-2051").as("getOccupation");

    cy.visit("/occupation/17-2051");

    cy.wait("@getOccupation").then(() => {
      cy.injectAxe();

      cy.get("[data-testid=title]").should("contain", "Civil Engineers");

      // median salary
      cy.contains("$97,820");

      // open jobs
      // cy.contains("1,302").should("exist");

      // open jobs links
      // cy.contains("Search current job openings posted for this occupation").should("exist");

      // description
      cy.contains(
        "Perform engineering duties in planning, designing, and overseeing construction and maintenance of building structures and facilities, such as roads, railroads, airports, bridges, harbors, channels, dams, irrigation projects, pipelines, power plants, and water and sewage systems."
      ).should("exist");

      // tasks
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

      // more tasks
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

      // education
      cy.contains(
        "Civil engineers need a bachelor’s degree in civil engineering, in one of its specialties, or in civil engineering technology. They typically need a graduate degree and licensure for promotion to senior positions. Although licensure requirements vary by state, civil engineers usually must be licensed if they provide services directly to the public."
      ).should("exist");

      // related occupations
      cy.contains("Construction Managers").should("exist");
      cy.contains("Architectural and Engineering Managers").should("exist");
      cy.contains("Agricultural Engineers").should("exist");
      cy.contains("Environmental Engineers").should("exist");
      cy.contains("Mining and Geological Engineers, Including Mining Safety Engineers").should(
        "exist"
      );

      // related trainings
      cy.contains("Architectural Design and Drafting").should("exist");
      cy.contains("See More Results").should("exist");

      cy.checkA11y();
    });
  });

  it("displays locally in-demand occupation details from ONET", () => {
    cy.server();
    cy.route("api/occupations/47-2031").as("getOccupation");
    cy.visit("/occupation/47-2031");

    cy.wait("@getOccupation").then(() => {
      cy.get("[data-testid=title]").should("contain", "Carpenters");

      cy.contains("In-Demand in Cape May, Cumberland, and Salem Counties.").should("exist");
      cy.contains("Learn about Local and Regional Waivers.").should("exist");
    });
  });

  it("displays occupation details from ONET for previous 2010 socs", () => {
    cy.server();
    cy.route("api/occupations/15-1254").as("getOccupation");

    cy.visit("/occupation/15-1254");

    cy.wait("@getOccupation").then(() => {
      cy.get("[data-testid=title]").should("contain", "Web Developers");

      // median salary
      cy.contains("$79,810").should("exist");

      // open jobs
      // cy.contains("6,898").should("exist");

      // open jobs links
      // cy.contains("Search current job openings posted for this occupation").should("exist");

      // description
      cy.contains(
        "Develop and implement websites, web applications, application databases, and interactive web interfaces. Evaluate code to ensure that it is properly structured, meets industry standards, and is compatible with browsers and devices. Optimize website performance, scalability, and server-side code and processes. May develop website infrastructure and integrate websites with other computer applications."
      ).should("exist");

      // tasks
      cy.contains("Write supporting code for Web applications or Web sites.").should("exist");
      cy.contains(
        "Design, build, or maintain Web sites, using authoring or scripting languages, content creation tools, management tools, and digital media."
      ).should("exist");
      cy.contains(
        "Back up files from Web sites to local directories for instant recovery in case of problems."
      ).should("exist");
      cy.contains("Select programming languages, design tools, or applications.").should("exist");
      cy.contains(
        "Evaluate code to ensure that it is valid, is properly structured, meets industry standards, and is compatible with browsers, devices, or operating systems."
      ).should("exist");

      // education
      cy.contains(
        "Educational requirements for web developers vary with the setting they work in and the type of work they do. Requirements range from a high school diploma to a bachelor’s degree. Web developers need knowledge of both programming and graphic design."
      ).should("exist");

      // related occupations
      cy.contains("Desktop Publishers").should("exist");

      // related trainings
      // cy.get(".card")
      //   .eq(0)
      //   .within(() => {
      //     cy.contains("CNC/CAM Programming Project").should("exist");
      //   });
      //
      // cy.get(".card")
      //   .eq(1)
      //   .within(() => {
      //     cy.contains("MSCD: Web Applications Certification").should("exist");
      //   });
      //
      // cy.get(".card")
      //   .eq(2)
      //   .within(() => {
      //     cy.contains("Computer Programmer's Package").should("exist");
      //   });
    });
  });

  it("displays occupation details for previous non-ONET socs", () => {
    cy.server();
    cy.route("api/occupations/15-1255").as("getOccupation");

    cy.visit("/occupation/15-1255");

    cy.wait("@getOccupation").then(() => {
      cy.get("[data-testid=title]").should("contain", "Web and Digital Interface Designers");

      // open jobs
      // cy.contains("255").should("exist");

      // open jobs links
      // cy.contains("Search current job openings posted for this occupation").should("exist");

      // median salary
      cy.contains("$79,810").should("exist");

      // description
      cy.contains(
        "Design digital user interfaces or websites. Develop and test layouts, interfaces, functionality, and navigation menus to ensure compatibility and usability across browsers or devices. May use web framework applications as well as client-side code and processes. May evaluate web design following web and accessibility standards, and may analyze web use metrics and optimize websites for marketability and search engine ranking. May design and test interfaces that facilitate the human-computer interaction and maximize the usability of digital devices, websites, and software with a focus on aesthetics and design. May create graphics used in websites and manage website content and links."
      ).should("exist");

      // education & tasks
      cy.contains(
        "Educational requirements for web developers vary with the setting they work in and the type of work they do. Requirements range from a high school diploma to a bachelor’s degree. Web developers need knowledge of both programming and graphic design."
      ).should("exist");

      // related occupations
      // This data is not yet available for this occupation.

      // related trainings
      // cy.get(".card")
      //   .eq(0)
      //   .within(() => {
      //     cy.contains("Python Programming").should("exist");
      //   });
      //
      // cy.get(".card")
      //   .eq(1)
      //   .within(() => {
      //     cy.contains("HSEAP and Networking and Security").should("exist");
      //   });
      //
      // cy.get(".card")
      //   .eq(2)
      //   .within(() => {
      //     cy.contains("Computer Programmer's Package").should("exist");
      //   });
    });
  });
});
