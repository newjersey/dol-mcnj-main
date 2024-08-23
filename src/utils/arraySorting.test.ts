import { arraySorting } from "./arraySorting";
import { ResultProps } from "./types";

describe("arraySorting Function", () => {
  const array: ResultProps[] = [
    {
      id: "1",
      name: "test1",
      zipCode: "08330",
      totalCost: 1000,
      percentEmployed: 80,
    },
    {
      id: "2",
      name: "test2",
      zipCode: "08330",
      totalCost: 500,
      percentEmployed: 60,
    },
    {
      id: "3",
      name: "test3",
      zipCode: "08330",
      totalCost: 1500,
      percentEmployed: 90,
    },
    {
      id: "4",
      name: "test4",
      zipCode: "08330",
      totalCost: 750,
      percentEmployed: 70,
    },
  ];

  it("returns the original array for 'match' sorting", () => {
    const sortedArray = arraySorting({ array, sortBy: "match" });
    expect(sortedArray).toEqual(array);
  });

  it("sorts the array by 'low' totalCost", () => {
    const sortedArray = arraySorting({ array, sortBy: "low" });
    expect(sortedArray).toEqual([
      {
        id: "2",
        name: "test2",
        percentEmployed: 60,
        totalCost: 500,
        zipCode: "08330",
      },
      {
        id: "4",
        name: "test4",
        percentEmployed: 70,
        totalCost: 750,
        zipCode: "08330",
      },
      {
        id: "1",
        name: "test1",
        percentEmployed: 80,
        totalCost: 1000,
        zipCode: "08330",
      },
      {
        id: "3",
        name: "test3",
        percentEmployed: 90,
        totalCost: 1500,
        zipCode: "08330",
      },
    ]);
  });

  it("sorts the array by 'high' totalCost", () => {
    const sortedArray = arraySorting({ array, sortBy: "high" });
    expect(sortedArray).toEqual([
      {
        id: "3",
        name: "test3",
        percentEmployed: 90,
        totalCost: 1500,
        zipCode: "08330",
      },
      {
        id: "1",
        name: "test1",
        percentEmployed: 80,
        totalCost: 1000,
        zipCode: "08330",
      },
      {
        id: "4",
        name: "test4",
        percentEmployed: 70,
        totalCost: 750,
        zipCode: "08330",
      },
      {
        id: "2",
        name: "test2",
        percentEmployed: 60,
        totalCost: 500,
        zipCode: "08330",
      },
    ]);
  });

  it("sorts the array by 'rate' percentEmployed", () => {
    const sortedArray = arraySorting({ array, sortBy: "rate" });
    expect(sortedArray).toEqual([
      {
        id: "3",
        name: "test3",
        percentEmployed: 90,
        totalCost: 1500,
        zipCode: "08330",
      },
      {
        id: "1",
        name: "test1",
        percentEmployed: 80,
        totalCost: 1000,
        zipCode: "08330",
      },
      {
        id: "4",
        name: "test4",
        percentEmployed: 70,
        totalCost: 750,
        zipCode: "08330",
      },
      {
        id: "2",
        name: "test2",
        percentEmployed: 60,
        totalCost: 500,
        zipCode: "08330",
      },
    ]);
  });

  it("returns the original array if no valid sortBy value is provided", () => {
    const sortedArray = arraySorting({ array, sortBy: "invalid" as any });
    expect(sortedArray).toEqual(array);
  });

  it("does not modify the original array", () => {
    const originalArray = [...array];
    arraySorting({ array, sortBy: "low" });
    expect(array).toEqual(originalArray);
  });
});
