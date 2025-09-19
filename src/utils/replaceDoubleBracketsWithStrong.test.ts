import { replaceDoubleBracketsWithStrong } from "./replaceDoubleBracketsWithStrong";

describe("replaceDoubleBracketsWithStrong", () => {
  it("replaces double brackets with strong tags for single word", () => {
    const input = "This is a [[test]] string.";
    const output = "This is a <strong>test</strong> string.";
    expect(replaceDoubleBracketsWithStrong(input)).toBe(output);
  });

  it("replaces double brackets with strong tags for multiple words", () => {
    const input = "This is a [[test string]] with multiple words.";
    const output =
      "This is a <strong>test string</strong> with multiple words.";
    expect(replaceDoubleBracketsWithStrong(input)).toBe(output);
  });

  it("replaces multiple occurrences of double brackets", () => {
    const input = "This is a [[test]] and another [[example]] string.";
    const output =
      "This is a <strong>test</strong> and another <strong>example</strong> string.";
    expect(replaceDoubleBracketsWithStrong(input)).toBe(output);
  });

  it("returns the same string if no double brackets are found", () => {
    const input = "This is a test string with no brackets.";
    const output = "This is a test string with no brackets.";
    expect(replaceDoubleBracketsWithStrong(input)).toBe(output);
  });

  it("handles empty string", () => {
    const input = "";
    const output = "";
    expect(replaceDoubleBracketsWithStrong(input)).toBe(output);
  });

  it("does not replace incorrectly formatted brackets", () => {
    const input = "This is a [test] and another [[example] string.";
    const output = "This is a [test] and another [[example] string.";
    expect(replaceDoubleBracketsWithStrong(input)).toBe(output);
  });
});
