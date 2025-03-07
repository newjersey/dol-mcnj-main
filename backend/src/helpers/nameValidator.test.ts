import { isValidName } from "./nameValidator";

describe("isValidName", () => {
    test("should return true for a valid name", () => {
        expect(isValidName("John")).toBe(true);
        expect(isValidName("Alice Smith")).toBe(true);
        expect(isValidName("O'Connor")).toBe(true);
        expect(isValidName("Jean-Luc")).toBe(true);
    });

    test("should return false for names exceeding 50 characters", () => {
        expect(isValidName("A".repeat(51))).toBe(false);
    });

    test("should return false for names with numbers", () => {
        expect(isValidName("John123")).toBe(false);
    });

    test("should return false for names with special characters", () => {
        expect(isValidName("John@Doe")).toBe(false);
        expect(isValidName("Jane#Doe")).toBe(false);
        expect(isValidName("John$Doe")).toBe(false);
    });

    test("should return false for names with underscores", () => {
        expect(isValidName("John_Doe")).toBe(false);
    });

    test("should return false for empty string", () => {
        expect(isValidName("")).toBe(false);
    });

    test("should return false for null or undefined", () => {
        expect(isValidName(null as unknown as string)).toBe(false);
        expect(isValidName(undefined as unknown as string)).toBe(false);
    });

    test("should return false for non-string inputs", () => {
        expect(isValidName(123 as unknown as string)).toBe(false);
        expect(isValidName({} as unknown as string)).toBe(false);
        expect(isValidName([] as unknown as string)).toBe(false);
    });

    test("should allow valid names with spaces, hyphens, and apostrophes", () => {
        expect(isValidName("Anne-Marie")).toBe(true);
        expect(isValidName("D'Angelo")).toBe(true);
        expect(isValidName("Mary Jane")).toBe(true);
    });
});
