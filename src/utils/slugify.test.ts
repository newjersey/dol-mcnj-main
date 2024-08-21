import { slugify } from "./slugify";

describe("slugify function", () => {
  it("should convert a string into a slug", () => {
    // Test case 1: Basic conversion
    expect(slugify("Hello World")).toBe("hello-world");

    // Test case 2: Special characters
    expect(slugify("Hello, World!")).toBe("hello-world");

    // Test case 3: Accented characters
    expect(slugify("Áccëntèd Strïng")).toBe("accented-string");

    // Test case 4: Extra spaces
    expect(slugify("  Testing    Spaces   ")).toBe("testing-spaces");

    // Test case 5: Hyphen not preservation
    expect(slugify("hyphens---not-preserved")).toBe("hyphens-not-preserved");

    // Test case 6: Numbers and mixed case
    expect(slugify("Testing 123 slugify")).toBe("testing-123-slugify");
  });
});
