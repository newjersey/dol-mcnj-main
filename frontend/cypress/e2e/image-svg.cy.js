import navigation_paths from "./navigation_paths";

describe("Images load and have Alt texts", () => {
  navigation_paths.forEach((item) => {
    it(item.label, () => {
      cy.visit(item.path);
      cy.get("img")
        .should("not.have.css", "display", "none")
        .each(($img) => {
            // Check alt value
            cy.wrap($img)
                .should("have.attr", "alt")
                .and("not.be.empty")
                .then(alt => {
                    if (!alt) {
                        throw new Error(`Image with src "${$img[0].src}" does not have an alt attribute or it's empty.`);
                    }
                });

            // Ensure the natural width and height is greater than 0.
            expect($img[0].naturalWidth, `Image with src "${$img[0].src}" does not have a valid width.`).to.be.greaterThan(0);
            expect($img[0].naturalHeight, `Image with src "${$img[0].src}" does not have a valid height.`).to.be.greaterThan(0);
            });
        });
    });
});
