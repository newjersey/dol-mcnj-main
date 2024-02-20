const faq_data = {
  "training-explorer": [
    "training",
    "tuition-assistance-for-training",
    "data-sources"
  ],
  "eligible-training-provider-list": [
    "etpl-program-general-information",
    "etpl-information-for-students",
    "etpl-information-for-providers",
  ],
  "indemand-occupations": [
    "indemand-occupation-list",
  ],
  "private-career-schools": [
    "private-career-schools"
  ]
}

const faq_groups = Object.keys(faq_data);


describe("FAQ Page", () => {
  it("is accessible", () => {
    cy.visit("/faq");
    cy.injectAxe();

    cy.contains("Get answers to all of your NJ Career Central questions").should("exist");
    cy.checkA11y();
  });

  describe("default page", () => {
    beforeEach(() => {
      cy.visit("/faq");
    })

    it("should include default link in url", () => {
      cy.url().should("include", "#training");
    })

    it("should have only default navigation group open", () => {
      faq_groups.forEach((group, index) => {
        if (index > 0) {
          cy.shouldBeActive(`[data-testid="topic-${group}"]`,false);
          faq_data[group].forEach((topic) => {
            cy.shouldBeVisible(`[data-testid="link-${topic}"]:visible`, false);
          });
        } else {
          cy.shouldBeActive(`[data-testid="topic-${group}"]`, true);
          faq_data[group].forEach((topic) => {
            cy.shouldBeVisible(`[data-testid="link-${topic}"]`, true);
          });
        }
      });
    });

    it("should have only the default link active", () => {
      faq_data[faq_groups[0]].forEach((topic, index) => {
        if (index > 0) {
          cy.shouldBeActive(`[data-testid="link-${topic}"]:visible`, false);
        } else {
          cy.shouldBeActive(`[data-testid="link-${topic}"]:visible`, true);
        }
      });
    });

    it("should show default accordion content", () => {
      faq_data[faq_groups[0]].forEach((value, index) => {
        if (index > 0) {
          cy.get(`[data-testid="accordion-${index}"]`)
            .should("not.have.class", "open")
            .within(() => {
              cy.get(`[data-testid="accordion-content-${index}"]:visible`).should("not.exist");
            });
        } else {
          cy.get(`[data-testid="accordion-${index}"]`)
            .should("have.class", "open")
            .within(() => {
              cy.get(`[data-testid="accordion-content-${index}"]`).should("exist");
              cy.contains("The types of training you will find on this website range from private career schools, non-profit schools, community colleges, vocational schools, literacy programs, short-term occupational and skills training programs, and registered apprenticeships. There are also a select number of higher education programs on this list.").should("exist");
            });
        }
      })
    });
  })

  describe("visiting faq page with specific #link in url", () => {
    beforeEach(() => {
      cy.visit("/faq#etpl-information-for-students");
    })

    it("should have correct navigation group visible", () => {
      faq_groups.forEach((group) => {
        cy.get(`[data-testid="topic-${group}"]`).should("exist");
  
        if (group === "eligible-training-provider-list") {
          cy.shouldBeActive(`[data-testid="topic-${group}"]`, true);
        } else {
          cy.shouldBeActive(`[data-testid="topic-${group}"]`, false);
          faq_data[group].forEach((topic) => {
            cy.shouldBeVisible(`[data-testid="link-${topic}"]:visible`, false);
          });
        }
      });
    });

    it("should show correct link as active", () => {
      faq_data["eligible-training-provider-list"].forEach((topic) => {
        if (topic === "etpl-information-for-students") {
          cy.shouldBeActive(`[data-testid="link-${topic}"]:visible`, true);
        } else {
          cy.shouldBeActive(`[data-testid="link-${topic}"]:visible`, false);
        }
      });
    });

    it("should show correct accordion content", () => {
      faq_data["eligible-training-provider-list"].forEach((value, index) => {
        if (index > 0) {
          cy.get(`[data-testid="accordion-${index}"]`)
            .should("not.have.class", "open")
            .within(() => {
              cy.get(`[data-testid="accordion-content-${index}"]:visible`).should("not.exist");
            });;
        } else {
          cy.get(`[data-testid="accordion-${index}"]`)
            .should("have.class", "open")
            .within(() => {
              cy.get(`[data-testid="accordion-content-${index}"]`)
                .should("exist")
                .invoke('text').should('have.length.gt', 0); // Due to the nature of the content, we can't predict the exact text
            });
        }
      })
    });
  });

  describe("active links", () => {
    beforeEach(() => {
      cy.visit("/faq");
    });

    it("should change the active link when clicked", () => {
      cy.navHasOneActiveLink("#faqNav");

      faq_groups.forEach((group, index) => {
        if (index > 0) {
          cy.get(`[data-testid="topic-${group}"]`).click();
          faq_data[group].forEach((topic) => {
            cy.get(`[data-testid="link-${topic}"]`).click();
            cy.navHasOneActiveLink("#faqNav");
          });
        } else {
          faq_data[group].forEach((topic) => {
            cy.get(`[data-testid="link-${topic}"]`).click();
            cy.navHasOneActiveLink("#faqNav");
          });
        }
      });
    });

    it("should change the url when clicked", () => {
      cy.visit("/faq");
      cy.url().should("include", "#training");
      
      faq_groups.forEach((group, index) => {
        if (index > 0) {
          cy.get(`[data-testid="topic-${group}"]`).click();
          faq_data[group].forEach((topic) => {
            cy.shouldBeVisible(`[data-testid="link-${topic}"]:visible`, true).click();
            cy.url().should("include", `#${topic}`);
          });
        } else {
          faq_data[group].forEach((topic) => {
            cy.shouldBeVisible(`[data-testid="link-${topic}"]:visible`, true).click();
            cy.url().should("include", `#${topic}`);
          });
        }
      })
    });

    it("changes active link when url is changed", () => {
      faq_groups.forEach((group, index) => {
        if (index > 0) {
          faq_data[group].forEach((topic) => {
            cy.visit(`/faq#${topic}`);
            cy.shouldBeVisible(`[data-testid="link-${topic}"]:visible`, true);
            cy.shouldBeActive(`[data-testid="link-${topic}"]:visible`, true);
            cy.navHasOneActiveLink("#faqNav");
          })
        } else {
          faq_data[group].forEach((topic) => {
            cy.visit(`/faq#${topic}`);
            cy.shouldBeVisible(`[data-testid="link-${topic}"]:visible`, true);
            cy.shouldBeActive(`[data-testid="link-${topic}"]:visible`, true);
            cy.navHasOneActiveLink("#faqNav");
          });
        }
      })
    });
  })

});
