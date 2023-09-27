import navigation_paths from "./navigation_paths";

describe("Images load and have Alt texts", () => {
  navigation_paths.forEach((item) => {
    it(item.label, () => {
      cy.visit(item.path).then(() => {
        cy.get("img")
          .should("be.visible", 'Expected image to be visible')
          .each(($img, index) => {
            // Check alt value
            cy.wrap($img)
              .should("have.attr", "alt", `Image at index ${index} should have an alt attribute`)
              .and("not.be.empty", `Alt attribute for image at index ${index} should not be empty`);

            // Ensure the natural width and height is greater than 0.
            if (!$img[0].naturalWidth || !$img[0].naturalHeight) {
              throw new Error(`Image at index ${index} failed to load or has zero dimensions`);
            }

            expect($img[0].naturalWidth, `Image at index ${index} should have width greater than 0`).to.be.greaterThan(0);
            expect($img[0].naturalHeight, `Image at index ${index} should have height greater than 0`).to.be.greaterThan(0);
          });
      }).catch((error) => {
        throw new Error(`Failed to navigate to ${item.path} due to: ${error.message}`);
      });
    });
  });
});
