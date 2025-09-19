import { toUsCurrency } from "./toUsCurrency";

describe("toUsCurrency function", () => {
  it("should format a number to USD currency", () => {
    // Test case 1: Integer input
    expect(toUsCurrency(1000)).toBe("$1,000");

    // Test case 2: Float input
    expect(toUsCurrency(1234.56)).toBe("$1,234.56");

    // Test case 3: Zero input
    expect(toUsCurrency(0)).toBe("$0");
  });

  it("should remove decimal part if it is .00", () => {
    // Test case 1: Integer input
    expect(toUsCurrency(2000)).toBe("$2,000");

    // Test case 2: Float input
    expect(toUsCurrency(4567.0)).toBe("$4,567");
  });
});
