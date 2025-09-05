import { convertToPascalCase } from "./convertToPascalCase";

describe("convertToPascalCase", () => {
  it("should convert a string to PascalCase", () => {
    const inputString = "hello world";
    const expectedOutput = "HelloWorld";
    const result = convertToPascalCase(inputString);

    expect(result).toEqual(expectedOutput);
  });

  it("should handle punctuation marks", () => {
    const inputString = "the quick brown fox, jumps over the lazy dog!";
    const expectedOutput = "TheQuickBrownFoxJumpsOverTheLazyDog";
    const result = convertToPascalCase(inputString);

    expect(result).toEqual(expectedOutput);
  });

  it("should handle leading/trailing whitespaces", () => {
    const inputString = "   example   ";
    const expectedOutput = "Example";
    const result = convertToPascalCase(inputString);

    expect(result).toEqual(expectedOutput);
  });

  it("should handle numbers in the string", () => {
    const inputString = "hello world 123";
    const expectedOutput = "HelloWorld123";
    const result = convertToPascalCase(inputString);

    expect(result).toEqual(expectedOutput);
  });

  it("should handle an empty string", () => {
    const inputString = "";
    const expectedOutput = "";
    const result = convertToPascalCase(inputString);

    expect(result).toEqual(expectedOutput);
  });
});
