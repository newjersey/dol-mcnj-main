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

    cy.get("input[name=email]").clear()
    cy.get("input[name=email]").type("thisIsAnEmail@gmail.com");
    cy.contains("Please enter a valid email").should("not.exist");

    const randomOption = Math.floor(Math.random() * 6)+1;

    cy.get(`[data-testid="topic-${randomOption}"]`).click();
    cy.contains("Please select an option").should("not.exist");

    cy.get("textarea[name=message]").type("Hello, this is a message");
    cy.contains("Please enter a message").should("not.exist");
  });

  it("should show success message when form is submitted", () => {
    cy.intercept("POST", "/api/contact", {
      statusCode: 200,
      body: { message: "Success!" }
    });

    cy.get("input[name=email]").type("email@gmail.com");

    const randomOption = Math.floor(Math.random() * 6)+1;

    cy.get(`[data-testid="topic-${randomOption}"]`).click();

    cy.get("textarea[name=message]").type("Hello, this is a message");

    cy.get("button[type=submit]").click();

    cy.contains("Success!").should("exist");
    cy.contains("Submission Error").should("not.exist");
    cy.contains("Contact Form").should("not.exist");

    cy.get("[data-testid='reset-button']").click();

    cy.contains("Contact Form").should("exist");
    cy.contains("Success!").should("not.exist");
    cy.contains("Submission Error").should("not.exist");
  });

  it("should show error message when form submission fails", () => {
    cy.intercept("POST", "/api/contact", {
      statusCode: 500,
      body: { message: "Submission Error" }
    });

    cy.get("input[name=email]").type("email@gmail.com");

    const randomOption = Math.floor(Math.random() * 6)+1;

    cy.get(`[data-testid="topic-${randomOption}"]`).click();

    cy.get("textarea[name=message]").type("Hello, this is a message");

    cy.get("button[type=submit]").click();

    cy.contains("Success!").should("not.exist");
    cy.contains("Submission Error").should("exist");
    cy.contains("Contact Form").should("not.exist");

    cy.get("[data-testid='reset-button']").click();

    cy.contains("Contact Form").should("exist");
    cy.contains("Success!").should("not.exist");
    cy.contains("Submission Error").should("not.exist");
  });
})