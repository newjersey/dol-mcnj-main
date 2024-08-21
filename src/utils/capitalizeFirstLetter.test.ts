import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

describe("capitalizeFirstLetter", () => {
  it("should capitalize the first letter of a word", () => {
    const inputString = "hello";
    const expectedOutput = "Hello";
    const result = capitalizeFirstLetter(inputString);

    expect(result).toEqual(expectedOutput);
  });

  it("should return an empty string if input is an empty string", () => {
    const inputString = "";
    const expectedOutput = "";
    const result = capitalizeFirstLetter(inputString);

    expect(result).toEqual(expectedOutput);
  });

  it("should handle a single letter input", () => {
    const inputString = "a";
    const expectedOutput = "A";
    const result = capitalizeFirstLetter(inputString);

    expect(result).toEqual(expectedOutput);
  });

  it("should handle a string with digits", () => {
    const inputString = "hello123";
    const expectedOutput = "Hello123";
    const result = capitalizeFirstLetter(inputString);

    expect(result).toEqual(expectedOutput);
  });
});
