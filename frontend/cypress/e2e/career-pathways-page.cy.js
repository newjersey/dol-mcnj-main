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
      let path = "https://d4ad-research2.uk.r.appspot.com/career-pathways/manufacturing";
      cy.visit(path).get(".button-radio").contains(item.main_contains).click();
      cy.get(`[aria-label="occupation-selector"]`).click();
      cy.get(`[aria-label="occupation-item"]`).each(($, index) => {
        let path = "https://d4ad-research2.uk.r.appspot.com/career-pathways/manufacturing";
        cy.visit(path).get(".button-radio").contains("Machining").click();
        cy.get(`[aria-label="occupation-selector"]`).click();
        cy.get(`[aria-label="occupation-item"]`).eq(index).click();
        cy.get(".path-stop").should("have.length.greaterThan", 1);
      });
    });
  });
});

describe("It visits each Navbar Tabs", () => {
  it("Main Navigation Test ", () => {
    let path = "https://training.njcareers.org";
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
    let path = "https://training.njcareers.org";
    cy.visit(path);
    cy.get("li.has-sub").each((sub_menu) => {
      cy.wrap(sub_menu)
        .children("a")
        .invoke("attr", "href")
        .then((url) => {
          if (url.includes(path)) {
            cy.log("Visits: ", url);
            cy.visit(url);
          }
        });
    });
  });
});

describe("career Pathways Page", () => {
  let path = "https://mycareer.nj.gov/#/";

  it("It should log user in", () => {
    cy.visit(path).get("button").contains("Sign in or Sign Up").click();
    cy.get("button").contains("Continue with Career Central Account").click();
    cy.origin("https://prod-nj.us.auth0.com", async () => {
      const CYPRESS_GOOGLE_AUTH_EMAIL = Cypress.env("CYPRESS_GOOGLE_AUTH_EMAIL");
      const CYPRESS_GOOGLE_AUTH_PASSWORD = Cypress.env("CYPRESS_GOOGLE_AUTH_PASSWORD");
      cy.get("input#username").type(CYPRESS_GOOGLE_AUTH_EMAIL);
      cy.get("input#password").type(CYPRESS_GOOGLE_AUTH_PASSWORD);
      cy.get(`[name="action"]`).contains("Continue").click({ force: true });
    });
  });
});
