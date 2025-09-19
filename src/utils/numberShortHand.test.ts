import { numberShorthand } from "./numberShorthand";

describe("numberShorthand function", () => {
  it("should convert a number into shorthand format", () => {
    // Thousands
    expect(numberShorthand(1234)).toBe("1.2k");

    // Millions
    expect(numberShorthand(5678901)).toBe("5.7M");

    // Zero
    expect(numberShorthand(0)).toBe("0");

    // Decimals
    expect(numberShorthand(12345.6789)).toBe("12.3k");
  });
});
