
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

/*
describe("Pending", () => {
  it("Map expands ", () => {});
  it("Link to login & sign up from CN LP", () => {});
  it("Tuition Assistance link goes to the right page ", () => {});
  it("Link to more related trainings on TE takes you to the right search ", () => {});
  it("Local in demand training county tags ", () => {});

  it("Contact Us opens Google Form", () => {});
  it("Links out to Tuition Assistance, and one stop job board from in demand careers details with in Healthcare and TDL ", () => {});
});
*/
