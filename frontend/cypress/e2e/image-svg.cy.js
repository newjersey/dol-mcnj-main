import navigation_paths from "./navigation_paths";

function checkImageDimensions($img, retries = 3) {
  if ($img[0].naturalWidth > 0 && $img[0].naturalHeight > 0) {
    return; // dimensions are valid, exit the function
  }
  if (retries === 0) {
    // no retries left, throw an error
    expect($img[0].naturalWidth, `Image with src "${$img[0].src}" does not have a valid width.`).to.be.greaterThan(0);
    expect($img[0].naturalHeight, `Image with src "${$img[0].src}" does not have a valid height.`).to.be.greaterThan(0);
  } else {
    cy.wait(1000); // wait for 1 second before retrying
    checkImageDimensions($img, retries - 1);
  }
}


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

          // Use the custom retry function for width and height checks
          checkImageDimensions($img);
        });
    });
  });
});
