import { checkValidSocCode, checkValidCipCode } from "./checkValidCodes";

describe("checkValidSocCode", () => {
  it("returns the value if it does not have six digits", () => {
    const value = "12345";
    const result = checkValidSocCode(value);
    expect(result).toEqual(value);
  });

  it("returns the formatted value if it has six digits and the prefix is valid", () => {
    const value = "135791";
    const result = checkValidSocCode(value);
    expect(result).toEqual("13-5791");
  });

  it("returns the value if it has six digits but the prefix is invalid", () => {
    const value = "999999";
    const result = checkValidSocCode(value);
    expect(result).toEqual(value);
  });
});

describe("checkValidCipCode", () => {
  it("returns the value if it is not a CIP code pattern", () => {
    const value = "hello world";
    const result = checkValidCipCode(value);
    expect(result).toEqual(value);
  });

  it("returns the value if it has six digits but invalid CIP prefix", () => {
    const value = "999999";
    const result = checkValidCipCode(value);
    expect(result).toEqual(value);
  });

  it("returns unformatted CIP code when given a formatted CIP code", () => {
    const value = "12.0501";
    const result = checkValidCipCode(value);
    expect(result).toEqual("120501");
  });

  it("returns the same value when given an unformatted valid CIP code", () => {
    const value = "120501";
    const result = checkValidCipCode(value);
    expect(result).toEqual("120501");
  });

  it("handles other valid CIP prefixes", () => {
    expect(checkValidCipCode("11.0101")).toEqual("110101");
    expect(checkValidCipCode("22.0304")).toEqual("220304");
    expect(checkValidCipCode("270101")).toEqual("270101");
  });

  it("rejects invalid lengths", () => {
    expect(checkValidCipCode("12345")).toEqual("12345");
    expect(checkValidCipCode("1234567")).toEqual("1234567");
    expect(checkValidCipCode("12.05")).toEqual("12.05");
    expect(checkValidCipCode("12.05012")).toEqual("12.05012");
  });
});