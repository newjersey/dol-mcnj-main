
let path = "/"
const navigation_paths = [
  { path: path + "/", label: "Home Page" },
  { path: path + "/search", label: "Search Page" },
  {
    path: path + "/in-demand-occupations",
    label: "Indemand Occupations Page",
  },
  { path: path + "/support-resources", label: "Support Resource Page" },
  {
    path: path + "/support-resources/career-support",
    label: "Career Support Page",
  },
  {
    path: path + "/support-resources/tuition-assistance",
    label: "Tuition Assistance Page",
  },
  { path: path + "/support-resources/other", label: "Other Assistant Page" },
  { path: path + "/faq", label: "FAQ Page" },
  {
    path: path + "/training-provider-resources",
    label: "Training Provider Resources Page",
  },
];

describe("Career Pathway Page", () => {
  it("Toggle open close industry detail tray - ", () => {
    let path = "/career-pathways";
    cy.visit(path);
    cy.get("span").contains("Healthcare").click();
    cy.get(".explore-button").contains("Healthcare").click();
    cy.get(".panel .open");
    cy.get("button.close").first().click();
  });
});

describe("It visits each Navbar Tabs", () => {
  it("Main Navigation Test ", () => {
    cy.visit(path);
    cy.get("ul > li.no-sub").each((items) => {
      cy.wrap(items)
        .children("a")
        .invoke("attr", "href")
        .then((url) => {
          if (url.includes(path)) {
            cy.log("Visits: ", url);
            cy.visit(url);
          } else {
            cy.log("CORS: ", url);
          }
        });
    });
  });

  it("Sub Navigation Test ", () => {
    cy.visit(path);
    cy.get("li.has-sub").each((sub_menu) => {
      cy.wrap(sub_menu)
        .children("a")
        .invoke("attr", "href")
        .then((url) => {
          if (url.includes(path)) {
            cy.log("Visits: ", url);
            cy.visit(url);
          } else {
            cy.log("CORS: ", url);
          }
        });
    });
  });
});



describe("Images load and have Alt texts", () => {
  navigation_paths.forEach((item) => {
    it(item.label, () => {
      cy.visit(item.path);
      cy.get("img")
        .should("not.have.css", "display", "none")
        .each(($img) => {
          describe("Images load and have Alt texts", () => {
            it("Home Page", () => {
             cy.visit(path)
             cy.get('img').each(($img) => {
                cy.wrap($img).should("have.attr", "alt")
                // Scroll the image into view and check if it's visible.
                // cy.wrap($img).scrollIntoView().should('be.visible');
                
                // Ensure the natural width and height is greater than 0.
                expect($img[0].naturalWidth).to.be.greaterThan(0);
                expect($img[0].naturalHeight).to.be.greaterThan(0);
              });
            })
          });
          //Ensure the natural width and height is greater than 0.
          expect($img[0].naturalWidth).to.be.greaterThan(0);
          expect($img[0].naturalHeight).to.be.greaterThan(0);
        });
    });
  });
});

describe("Map expands", () => {
  navigation_paths.forEach((item) => {
    it(item.label, () => {
      cy.visit(item.path);
      cy.get("img")
        .should("not.have.css", "display", "none")
        .each(($img) => {
          describe("Images load and have Alt texts", () => {
            it("Home Page", () => {
             cy.visit(path)
             cy.get('img').each(($img) => {
                cy.wrap($img).should("have.attr", "alt")
                // Scroll the image into view and check if it's visible.
                // cy.wrap($img).scrollIntoView().should('be.visible');
                
                // Ensure the natural width and height is greater than 0.
                expect($img[0].naturalWidth).to.be.greaterThan(0);
                expect($img[0].naturalHeight).to.be.greaterThan(0);
              });
            })
          });
          //Ensure the natural width and height is greater than 0.
          expect($img[0].naturalWidth).to.be.greaterThan(0);
          expect($img[0].naturalHeight).to.be.greaterThan(0);
        });
    });
  });
});

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
        "/career-pathways/manufacturing";
      cy.visit(path).get(".button-radio").contains(item.main_contains).click();
      cy.get(`[aria-label="occupation-selector"]`).click();
      cy.get(`[aria-label="occupation-item"]`).each(($button, index, list) => {
        let path =
          "/career-pathways/manufacturing";
        cy.visit(path).get(".button-radio").contains("Machining").click();
        cy.get(`[aria-label="occupation-selector"]`).click();
        cy.get(`[aria-label="occupation-item"]`).eq(index).click();
        cy.get(".path-stop").should("have.length.greaterThan", 1);
      });
    });
  });
});


describe("Pending", () => {
  it("Link to login & sign up from CN LP", () => {});
  it("Tuition Assistance link goes to the right page ", () => {});
  it("Link to more related trainings on TE takes you to the right search ", () => {});
  it("Local in demand training county tags ", () => {});

  it("Contact Us opens Google Form", () => {});
  it("Links out to Tuition Assistance, and one stop job board from in demand careers details with in Healthcare and TDL ", () => {});
});
