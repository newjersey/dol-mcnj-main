let path = "https://d4ad-research2.uk.r.appspot.com/career-pathways";
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
    let path = "https://d4ad-research2.uk.r.appspot.com/career-pathways";
    cy.visit(path);
    cy.get("span").contains("Healthcare").click();
    cy.get(".explore-button").contains("Healthcare").click();
    cy.get(".panel .open");
    cy.get("button.close").first().click();
  });
});

describe("It visits each Navbar Tabs", () => {
  it("Main Navigation Test ", () => {
    let path = "https://d4ad-research2.uk.r.appspot.com";
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
    let path = "https://d4ad-research2.uk.r.appspot.com";
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
          // check alt fvalue
          cy.wrap($img).should("have.attr", "alt");

          // check if image is visible
          // cy.wrap($img).scrollIntoView().should("be.visible");

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
        "https://d4ad-research2.uk.r.appspot.com/career-pathways/manufacturing";
      cy.visit(path).get(".button-radio").contains(item.main_contains).click();
      cy.get(`[aria-label="occupation-selector"]`).click();
      cy.get(`[aria-label="occupation-item"]`).each(($button, index, list) => {
        let path =
          "https://d4ad-research2.uk.r.appspot.com/career-pathways/manufacturing";
        cy.visit(path).get(".button-radio").contains("Machining").click();
        cy.get(`[aria-label="occupation-selector"]`).click();
        cy.get(`[aria-label="occupation-item"]`).eq(index).click();
        cy.get(".path-stop").should("have.length.greaterThan", 1);
      });
    });
  });
});

describe("Link to login & sign up from CN LP", () => {
  const navigateToOathPage = () => {
    let path = "https://mycareer.nj.gov/#/";
    cy.visit(path).get("button").contains("Sign in or Sign Up").click();
    cy.get("button").contains("Continue with Career Central Account").click();
    return cy;
  };

  it("It should navigate to nj auth0", () => {
    cy = navigateToOathPage();
    cy.origin("https://prod-nj.us.auth0.com", () => {
      cy.get("input#username");
    });
  });
  it("It should failed on false credentials", () => {
    cy = navigateToOathPage();
    cy.origin("https://prod-nj.us.auth0.com", () => {
      cy.get("input#username").type("fakemeail@fakemail.com").wait(1000);
      cy.get("input#password")
        .type("fakepasswordfakepasswordfakepasswordfakepassword")
        .wait(1000);
      cy.get(`[name="action"]`).contains("Continue").click({ force: true });
      cy.get("span").contains("Wrong email or password").wait(5000);
    });
  });
});

describe("Contact Us opens Google Form", () => {
  it("Should not allow google form visit without login into google", () => {
    cy.visit(
      "https://d4ad-research2.uk.r.appspot.com/support-resources/tuition-assistance"
    );
    let google_doc =
      "https://docs.google.com/forms/d/e/1FAIpQLScAP50OMhuAgb9Q44TMefw7y5p4dGoE_czQuwGq2Z9mKmVvVQ/viewform";
    cy.get("section.footer-cta")
      .get(`[href="${google_doc}"]`)
      .contains("Contact Us")
      .click();
  });
});

