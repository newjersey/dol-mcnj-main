// formatPercentEmployed.test.ts
import { formatPercentEmployed } from "./formatPercentEmployed"; // Adjust the path accordingly

describe("formatPercentEmployed", () => {
  it('should format 0.0 to "0.0%"', () => {
    expect(formatPercentEmployed(0.0)).toBe("0.0%");
  });

  it('should format 0.123456 to "12.3%"', () => {
    expect(formatPercentEmployed(0.123456)).toBe("12.3%");
  });

  it('should format 0.9999 to "99.9%"', () => {
    expect(formatPercentEmployed(0.9999)).toBe("99.9%");
  });

  it('should format 1.0 to "100.0%"', () => {
    expect(formatPercentEmployed(1.0)).toBe("100.0%");
  });

  it('should format 0.456789 to "45.6%"', () => {
    expect(formatPercentEmployed(0.456789)).toBe("45.6%");
  });

  it('should format 0.5555 to "55.5%"', () => {
    expect(formatPercentEmployed(0.5555)).toBe("55.5%");
  });
});
