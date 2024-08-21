import { formatPhoneNumber } from "./formatPhoneNumber";

describe("formatPhoneNumber", () => {
  it("formats a valid phone number string", () => {
    const phoneNumber = "1234567890";
    const result = formatPhoneNumber(phoneNumber);
    expect(result).toBe("(123) 456-7890");
  });

  it("formats a phone number string with non-digit characters", () => {
    const phoneNumber = "(123) 456-7890";
    const result = formatPhoneNumber(phoneNumber);
    expect(result).toBe("(123) 456-7890");
  });

  it("formats a phone number string with spaces", () => {
    const phoneNumber = "123 456 7890";
    const result = formatPhoneNumber(phoneNumber);
    expect(result).toBe("(123) 456-7890");
  });

  it("returns null for a phone number string with less than 10 digits", () => {
    const phoneNumber = "1234567";
    const result = formatPhoneNumber(phoneNumber);
    expect(result).toBeNull();
  });

  it("returns null for a phone number string with more than 10 digits", () => {
    const phoneNumber = "1234567890123";
    const result = formatPhoneNumber(phoneNumber);
    expect(result).toBeNull();
  });

  it("returns null for an empty string", () => {
    const phoneNumber = "";
    const result = formatPhoneNumber(phoneNumber);
    expect(result).toBeNull();
  });

  it("returns null for a string with no digits", () => {
    const phoneNumber = "abcdefg";
    const result = formatPhoneNumber(phoneNumber);
    expect(result).toBeNull();
  });

  it("formats a phone number string with mixed non-digit characters", () => {
    const phoneNumber = "123-456.7890";
    const result = formatPhoneNumber(phoneNumber);
    expect(result).toBe("(123) 456-7890");
  });
});
