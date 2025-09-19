import { checkValidEmail } from "./checkValidEmail";

describe("checkValidEmail Function", () => {
  it("returns true for a valid email", () => {
    const validEmail = "test@example.com";
    expect(checkValidEmail(validEmail)).toBe(true);
  });

  it("returns false for an email without @ symbol", () => {
    const invalidEmail = "testexample.com";
    expect(checkValidEmail(invalidEmail)).toBe(false);
  });

  it("returns false for an email without domain", () => {
    const invalidEmail = "test@.com";
    expect(checkValidEmail(invalidEmail)).toBe(false);
  });

  it("returns false for an email without a top-level domain", () => {
    const invalidEmail = "test@example";
    expect(checkValidEmail(invalidEmail)).toBe(false);
  });

  it("returns false for an empty string", () => {
    const invalidEmail = "";
    expect(checkValidEmail(invalidEmail)).toBe(false);
  });

  it("returns false for a string without email structure", () => {
    const invalidEmail = "justastring";
    expect(checkValidEmail(invalidEmail)).toBe(false);
  });

  it("returns true for an email with subdomains", () => {
    const validEmail = "test@mail.example.com";
    expect(checkValidEmail(validEmail)).toBe(true);
  });

  it("returns true for an email with a different top-level domain", () => {
    const validEmail = "test@example.co.uk";
    expect(checkValidEmail(validEmail)).toBe(true);
  });
});
