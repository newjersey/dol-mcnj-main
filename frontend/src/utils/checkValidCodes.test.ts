import { checkValidSocCode } from "./checkValidCodes";

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