import { themeConverter } from "./themeConverter";

describe("themeConverter function", () => {
  it('should return "primary" for "blue" theme', () => {
    const theme = "blue";
    const result = themeConverter(theme);
    expect(result).toBe("primary");
  });

  it('should return "secondary" for "green" theme', () => {
    const theme = "green";
    const result = themeConverter(theme);
    expect(result).toBe("secondary");
  });

  it('should return "tertiary" for "purple" theme', () => {
    const theme = "purple";
    const result = themeConverter(theme);
    expect(result).toBe("tertiary");
  });

  it('should return "quaternary" for "navy" theme', () => {
    const theme = "navy";
    const result = themeConverter(theme);
    expect(result).toBe("quaternary");
  });

  it('should return "quinary" for unknown theme', () => {
    const theme = "unknown-theme";
    const result = themeConverter(theme);
    expect(result).toBe("quinary");
  });
});
