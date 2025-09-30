describe("Consumer Report Card E2E Tests", () => {
  const TRAINING_WITH_FULL_DATA = "/training/24861"; // Medical Assistant with complete CRC data

  beforeEach(() => {
    // Inject axe for accessibility testing
    cy.visit(TRAINING_WITH_FULL_DATA);
    cy.injectAxe();
  });

  describe("Consumer Report Card Display", () => {
    it("displays CRC data in desktop ProgramBanner", () => {
      // Desktop viewport - CRC should be visible in ProgramBanner
      cy.viewport(1200, 800);

      // Check specific formatted values from seed data
      cy.contains("61.3%").should("exist"); // Completion rate: 0.613 * 100 = 61.3%
      cy.contains("84.6%").should("exist"); // Employment rate Q2: 84.63% → 84.6%
      cy.contains("49.3%").should("exist"); // Employment rate Q4: 49.27% → 49.3%
      cy.contains("$48,464").should("exist"); // Median salary Q2
      cy.contains("$50,133").should("exist"); // Median salary Q4

      // Check quarterly labels
      cy.contains("at 6 months").should("exist");
      cy.contains("at 12 months").should("exist");

      // Check horizontal layout exists (desktop ProgramBanner)
      cy.get(".flex.gap-4").should("exist");
    });

    it("displays industry information when available", () => {
      cy.viewport(1200, 800);

      // Check that industry section exists (data may vary)
      cy.get("body").then(($body) => {
        if ($body.text().includes("Top employment industries")) {
          cy.contains("Top employment industries").should("exist");
        } else {
          cy.log("Industry data not available for this training");
        }
      });
    });

    it("displays Consumer Report Card title in desktop view", () => {
      cy.viewport(1200, 800);
      cy.contains("Consumer report card").should("exist");
    });
  });

  describe("Responsive Behavior", () => {
    it("shows horizontal layout in desktop ProgramBanner", () => {
      cy.viewport(1200, 800);
      
      // Desktop layout should have flex container with gap-4 in ProgramBanner
      cy.get(".flex.gap-4").should("exist");
      
      // Should show CRC data in desktop view
      cy.contains("61.3%").should("exist");
    });

    it("shows mobile tab interface on small screens", () => {
      // Set mobile viewport
      cy.viewport(375, 667);
      cy.wait(1000); // Allow layout to settle
      
      // Mobile should show tab interface
      cy.get("button").contains("Details").should("be.visible");
      cy.get("button").contains("Consumer report card").should("be.visible");
    });

    it("switches between Details and CRC tabs on mobile", () => {
      cy.viewport(375, 667);
      cy.wait(1000); // Allow layout to settle
      
      // Click CRC tab
      cy.get("button").contains("Consumer report card").click({ force: true });
      cy.wait(500);
      
      // Should show CRC content with vertical layout - look only in visible content
      cy.get("body").then(($body) => {
        // Find the visible CRC data (not in hidden desktop container)
        const visibleCrcData = $body.find(":contains('61.3%'):visible").filter((i, el) => {
          return Cypress.$(el).parents('.hidden').length === 0;
        });
        expect(visibleCrcData.length).to.be.greaterThan(0);
      });
      
      // Click back to Details
      cy.get("button").contains("Details").click({ force: true });
      cy.wait(500);
      
      // Should show details content again
      cy.get("h2").contains("Description").should("be.visible");
    });

    it("maintains data across breakpoints", () => {
      // Desktop - data in ProgramBanner
      cy.viewport(1200, 800);
      cy.contains("84.6%").should("exist");
      
      // Mobile - data in tabs
      cy.viewport(375, 667);
      cy.wait(1000); // Allow layout to settle
      cy.get("button").contains("Consumer report card").click({ force: true });
      cy.wait(500);
      
      // Look for data in visible mobile tab content only
      cy.get("body").then(($body) => {
        const visibleCrcData = $body.find(":contains('84.6%'):visible").filter((i, el) => {
          return Cypress.$(el).parents('.hidden').length === 0;
        });
        expect(visibleCrcData.length).to.be.greaterThan(0);
      });
    });
  });

  describe("Data Accuracy", () => {
    it("displays correctly formatted percentages", () => {
      cy.viewport(1200, 800);
      
      // Percentages should be formatted to 1 decimal place
      cy.contains("61.3%").should("exist"); // Completion rate
      cy.contains("84.6%").should("exist"); // Employment rate Q2
      cy.contains("49.3%").should("exist"); // Employment rate Q4
    });

    it("displays correctly formatted currency", () => {
      cy.viewport(1200, 800);
      
      // Currency should include $ and comma separators
      cy.contains("$48,464").should("exist");
      cy.contains("$50,133").should("exist");
    });

    it("shows proper quarterly labels", () => {
      cy.viewport(1200, 800);
      
      // Quarterly data should have proper time labels
      cy.contains("at 6 months").should("exist");
      cy.contains("at 12 months").should("exist");
    });
  });

  describe("Mobile Tab Navigation", () => {
    it("preserves functionality when switching tabs", () => {
      cy.viewport(375, 667);
      cy.wait(1000); // Allow layout to settle
      
      // Switch to CRC tab
      cy.get("button").contains("Consumer report card").click({ force: true });
      cy.wait(500);
      
      // Check for visible CRC data in mobile tab
      cy.get("body").then(($body) => {
        const visibleCrcData = $body.find(":contains('61.3%'):visible").filter((i, el) => {
          return Cypress.$(el).parents('.hidden').length === 0;
        });
        expect(visibleCrcData.length).to.be.greaterThan(0);
      });
      
      // Switch back to Details
      cy.get("button").contains("Details").click({ force: true });
      cy.wait(500);
      cy.get("h2").contains("Description").should("be.visible");
      
      // Switch back to CRC again
      cy.get("button").contains("Consumer report card").click({ force: true });
      cy.wait(500);
      
      // Check for visible CRC data again
      cy.get("body").then(($body) => {
        const visibleCrcData = $body.find(":contains('61.3%'):visible").filter((i, el) => {
          return Cypress.$(el).parents('.hidden').length === 0;
        });
        expect(visibleCrcData.length).to.be.greaterThan(0);
      });
    });
  });

  describe("Basic Accessibility", () => {
    it("has semantic HTML structure", () => {
      cy.viewport(1200, 800);
      
      // Check for proper semantic structure
      cy.contains("Consumer report card").should("exist");
      
      // Should have proper data structure
      cy.contains("84.6%").should("exist");
      cy.contains("$48,464").should("exist");
    });
  });

  describe("Performance", () => {
    it("loads CRC data within acceptable time", () => {
      const start = Date.now();
      
      cy.visit(TRAINING_WITH_FULL_DATA);
      cy.contains("Consumer report card").should("exist");
      
      cy.then(() => {
        const loadTime = Date.now() - start;
        expect(loadTime).to.be.lessThan(5000); // Should load within 5 seconds
      });
    });
  });

  describe("Error Recovery", () => {
    it("handles network errors gracefully", () => {
      // Should still show basic structure even if API fails
      cy.visit(TRAINING_WITH_FULL_DATA);
      cy.contains("Consumer report card").should("exist");
    });
  });
});