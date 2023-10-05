import { njauth_email, njauth_password} from "./credentials";


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
      cy.get("span").contains("Wrong email or password").wait(1000);
    });
  });

  it("It should log user in and log user out", () => {
    cy = navigateToOathPage();
    cy.origin("https://prod-nj.us.auth0.com", () => {
      cy.get("input#username").type("devop4640@gmail.com").wait(1000);
      cy.get("input#password")
        .type("G4BqGvTPVdPnePY")
        .wait(1000);
      cy.get(`[name="action"]`).contains("Continue").click({ force: true }).wait(2000)

    });
    cy.get("span").contains("Sign Out").wait(5000).click({ force: true }).wait(2000)
  });

 
});



