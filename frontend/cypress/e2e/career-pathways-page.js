
let path = "/"
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

describe("Pending", () => {
  it("Images load and have Alt texts ", () => {});
  it("Map expands ", () => {});
  it("Link to login & sign up from CN LP", () => {});
  it("Tuition Assistance link goes to the right page ", () => {});
  it("Link to more related trainings on TE takes you to the right search ", () => {});
  it("Local in demand training county tags ", () => {});

  it("Contact Us opens Google Form", () => {});
  it("Links out to Tuition Assistance, and one stop job board from in demand careers details with in Healthcare and TDL ", () => {});
});
