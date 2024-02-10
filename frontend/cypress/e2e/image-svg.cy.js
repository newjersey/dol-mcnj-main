import navigation_paths from "./navigation_paths";

function checkImageDimensions($img) {
    // Using cy.wrap() to ensure Cypress commands can be used
    cy.wrap($img).should(($img) => {
        expect($img[0].naturalWidth, `Image with src "${$img[0].src}" does not have a valid width.`).to.be.greaterThan(0);
        expect($img[0].naturalHeight, `Image with src "${$img[0].src}" does not have a valid height.`).to.be.greaterThan(0);
    });
}

describe("Images load and have Alt texts", () => {
    navigation_paths.forEach((item) => {
        it(item.label, () => {
            cy.visit(item.path);
            cy.get("img").should("be.visible").each(($img) => {
                // Breaking up the chain to handle async updates
                cy.wrap($img).should("have.attr", "alt").and("not.be.empty");
                // Check if the alt attribute is not empty
                cy.wrap($img).invoke('attr', 'alt').then(alt => {
                    expect(alt, `Image with src "${$img[0].src}" should have a non-empty alt attribute.`).to.not.be.empty;
                });
                // Checking image dimensions
                checkImageDimensions($img);
            });
        });
    });
});