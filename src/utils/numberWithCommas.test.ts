import { numberWithCommas } from "./numberWithCommas";

describe("numberWithCommas function", () => {
  it("should format a number with commas", () => {
    // Positive integer
    expect(numberWithCommas(1000)).toBe("1,000");

    // Negative integer
    expect(numberWithCommas(-123456789)).toBe("-123,456,789");

    // Positive float
    expect(numberWithCommas(12345.67)).toBe("12,345.67");

    // Large number
    expect(numberWithCommas(1234567890)).toBe("1,234,567,890");

    // Zero
    expect(numberWithCommas(0)).toBe("0");

    // Undefined number
    expect(numberWithCommas()).toBe("N/A");
  });
});
