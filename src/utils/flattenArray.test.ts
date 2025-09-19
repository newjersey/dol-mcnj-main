import { flattenArray } from "./flattenArray";

describe("flattenArray", () => {
  it("should flatten a nested array", () => {
    const nestedArray = [1, [2, [3, 4]], 5, [6, 7, [8, 9]]];
    const expectedFlattenedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const flattenedArray = flattenArray(nestedArray);

    expect(flattenedArray).toEqual(expectedFlattenedArray);
  });

  it("should handle an empty array", () => {
    const emptyArray: any[] = [];
    const flattenedArray = flattenArray(emptyArray);

    expect(flattenedArray).toEqual([]);
  });

  it("should handle a flat array", () => {
    const flatArray = [1, 2, 3, 4, 5];
    const flattenedArray = flattenArray(flatArray);

    expect(flattenedArray).toEqual(flatArray);
  });

  it("should handle an array with nested empty arrays", () => {
    const nestedEmptyArrays = [1, [], [2, []], []];
    const flattenedArray = flattenArray(nestedEmptyArrays);

    expect(flattenedArray).toEqual([1, 2]);
  });

  it("should handle an array with non-array elements", () => {
    const mixedArray = [1, [2, 3], "hello", [4, [5, "world"]]];
    const expectedFlattenedArray = [1, 2, 3, "hello", 4, 5, "world"];
    const flattenedArray = flattenArray(mixedArray);

    expect(flattenedArray).toEqual(expectedFlattenedArray);
  });
});
