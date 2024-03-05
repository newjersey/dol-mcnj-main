describe("Contact Us Page", () => {
  beforeEach(() => {
    cy.visit("/contact");
  })

  it("is accessible", () => {
    cy.injectAxe();
    cy.checkA11y();
  })

  it("should show the contact form", () => {
    cy.contains("Contact Form").should("exist");
    cy.contains("Success!").should("not.exist");
    cy.contains("Submission Error").should("not.exist");
  })

  it("should not allow form submission with empty fields", () => {
    cy.get("button[type=submit]").click();
    cy.contains("Please enter an email").should("exist");
    cy.contains("Please select an option").should("exist");
    cy.contains("Please enter a message").should("exist");
  });

  it("should remove error messages when fields are filled correctly", () => {
    cy.get("button[type=submit]").click();

    cy.get("input[name=email]").type("notAnEmail");
    cy.contains("Please enter an email").should("not.exist");
    cy.contains("Please enter a valid email").should("exist");

    cy.get("input[name=email]").clear().type("thisIsAnEmail@gmail.com");
    cy.contains("Please enter a valid email").should("not.exist");
  });
})