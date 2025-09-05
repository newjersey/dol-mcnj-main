import { noOrphans } from "./noOrphans";

describe("noOrphans", () => {
  it("replaces the last space with a non-breaking space", () => {
    const input = "This is a test string";
    const expected = "This is a test\u00A0string";
    expect(noOrphans(input)).toBe(expected);
  });

  it("handles strings with only one word", () => {
    const input = "Word";
    const expected = "Word";
    expect(noOrphans(input)).toBe(expected);
  });

  it("handles strings with multiple spaces at the end", () => {
    const input = "This is a test string   ";
    const expected = "This is a test\u00A0string";
    expect(noOrphans(input)).toBe(expected);
  });

  it("handles strings with HTML tags", () => {
    const input = "This is a <strong>test</strong> string";
    const expected = "This is a <strong>test</strong>\u00A0string";
    expect(noOrphans(input)).toBe(expected);
  });

  it("handles empty strings", () => {
    const input = "";
    const expected = "";
    expect(noOrphans(input)).toBe(expected);
  });

  it("does not modify strings with no spaces", () => {
    const input = "This_is_a_test_string";
    const expected = "This_is_a_test_string";
    expect(noOrphans(input)).toBe(expected);
  });

  it("handles strings with special characters", () => {
    const input = "This is a test!@#$%^&*()_+ string";
    const expected = "This is a test!@#$%^&*()_+\u00A0string";
    expect(noOrphans(input)).toBe(expected);
  });
});
