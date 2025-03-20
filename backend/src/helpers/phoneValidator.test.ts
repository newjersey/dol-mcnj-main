import { isValidPhoneNumber } from "./phoneValidator";

describe("isValidPhoneNumber", () => {
    test("should return true for a valid 10-digit phone number", () => {
        expect(isValidPhoneNumber("1234567890")).toBe(true);
    });

    test("should return false for a number with less than 10 digits", () => {
        expect(isValidPhoneNumber("123456789")).toBe(false);
    });

    test("should return false for a number with more than 10 digits", () => {
        expect(isValidPhoneNumber("12345678901")).toBe(false);
    });

    test("should return true for a valid number with dashes", () => {
        expect(isValidPhoneNumber("123-456-7890")).toBe(true);
    });

    test("should return true for a valid number with spaces", () => {
        expect(isValidPhoneNumber("123 456 7890")).toBe(true);
    });

    test("should return true for a valid number with parentheses", () => {
        expect(isValidPhoneNumber("(123) 456-7890")).toBe(true);
    });

    test("should return false for a number containing letters", () => {
        expect(isValidPhoneNumber("12345678a0")).toBe(false);
    });

    test("should return false for a number containing special characters", () => {
        expect(isValidPhoneNumber("123-456-78@0")).toBe(false);
    });

    test("should return false for an empty string", () => {
        expect(isValidPhoneNumber("")).toBe(false);
    });

    test("should return false for null or undefined", () => {
        expect(isValidPhoneNumber(null as unknown as string)).toBe(false);
        expect(isValidPhoneNumber(undefined as unknown as string)).toBe(false);
    });

    test("should return false for non-string inputs", () => {
        expect(isValidPhoneNumber(1234567890 as unknown as string)).toBe(false);
        expect(isValidPhoneNumber({} as unknown as string)).toBe(false);
        expect(isValidPhoneNumber([] as unknown as string)).toBe(false);
    });
});
