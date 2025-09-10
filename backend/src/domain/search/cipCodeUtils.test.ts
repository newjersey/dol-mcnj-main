import { isCipCodeQuery, normalizeCipCode } from "./cipCodeUtils";

describe("isCipCodeQuery", () => {
  it("returns false for non-CIP code patterns", () => {
    expect(isCipCodeQuery("hello world")).toBe(false);
    expect(isCipCodeQuery("12345")).toBe(false);
    expect(isCipCodeQuery("1234567")).toBe(false);
    expect(isCipCodeQuery("")).toBe(false);
    expect(isCipCodeQuery("programming")).toBe(false);
  });

  it("returns false for 6-digit numbers with invalid CIP prefixes", () => {
    expect(isCipCodeQuery("999999")).toBe(false);
    expect(isCipCodeQuery("808080")).toBe(false);
    expect(isCipCodeQuery("021234")).toBe(false); // 02 is not a valid CIP prefix
  });

  it("returns true for valid 6-digit CIP codes", () => {
    expect(isCipCodeQuery("120501")).toBe(true);
    expect(isCipCodeQuery("110101")).toBe(true);
    expect(isCipCodeQuery("220304")).toBe(true);
    expect(isCipCodeQuery("270101")).toBe(true);
  });

  it("returns true for valid formatted CIP codes", () => {
    expect(isCipCodeQuery("12.0501")).toBe(true);
    expect(isCipCodeQuery("11.0101")).toBe(true);
    expect(isCipCodeQuery("22.0304")).toBe(true);
    expect(isCipCodeQuery("27.0101")).toBe(true);
  });

  it("returns false for formatted codes with invalid prefixes", () => {
    expect(isCipCodeQuery("99.9999")).toBe(false);
    expect(isCipCodeQuery("02.1234")).toBe(false);
  });

  it("handles null and undefined inputs", () => {
    expect(isCipCodeQuery(null as unknown as string)).toBe(false);
    expect(isCipCodeQuery(undefined as unknown as string)).toBe(false);
  });

  it("handles whitespace", () => {
    expect(isCipCodeQuery("  120501  ")).toBe(true);
    expect(isCipCodeQuery("  12.0501  ")).toBe(true);
    expect(isCipCodeQuery("   ")).toBe(false);
  });
});

describe("normalizeCipCode", () => {
  it("converts formatted CIP codes to unformatted", () => {
    expect(normalizeCipCode("12.0501")).toBe("120501");
    expect(normalizeCipCode("11.0101")).toBe("110101");
    expect(normalizeCipCode("22.0304")).toBe("220304");
  });

  it("returns unformatted CIP codes as-is", () => {
    expect(normalizeCipCode("120501")).toBe("120501");
    expect(normalizeCipCode("110101")).toBe("110101");
    expect(normalizeCipCode("220304")).toBe("220304");
  });

  it("returns non-CIP code patterns as-is", () => {
    expect(normalizeCipCode("hello world")).toBe("hello world");
    expect(normalizeCipCode("12345")).toBe("12345");
    expect(normalizeCipCode("1234567")).toBe("1234567");
  });

  it("handles null and undefined inputs", () => {
    expect(normalizeCipCode(null as unknown as string)).toBe(null);
    expect(normalizeCipCode(undefined as unknown as string)).toBe(undefined);
  });

  it("handles whitespace", () => {
    expect(normalizeCipCode("  12.0501  ")).toBe("120501");
    expect(normalizeCipCode("  120501  ")).toBe("120501");
  });
});
