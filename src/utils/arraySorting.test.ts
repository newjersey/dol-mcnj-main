import { arraySorting } from "./arraySorting";
import { ResultProps } from "./types";

describe("arraySorting Function", () => {
  const array: ResultProps[] = [
    {
      id: "1",
      name: "test1",
      zipCode: "08330",
      totalCost: 1000,
      outcomes: {
        employment: [{ quarter: 2, employmentRate: 0.8 }]
      },
      cipDefinition: {
        cipCode: "12345",
        cipTitle: "CIP Title", 
        cipDefinition: "definition1",
      } as any,
    },
    {
      id: "2",
      name: "test2",
      zipCode: "08330",
      totalCost: 500,
      outcomes: {
        employment: [{ quarter: 2, employmentRate: 0.6 }]
      },
      cipDefinition: {
        cipCode: "12345",
        cipTitle: "CIP Title",
        cipDefinition: "definition2",
      } as any,
    },
    {
      id: "3",
      name: "test3",
      zipCode: "08330",
      totalCost: 1500,
      outcomes: {
        employment: [{ quarter: 2, employmentRate: 0.9 }]
      },
      cipDefinition: {
        cipCode: "12345",
        cipTitle: "CIP Title",
        cipDefinition: "definition3",
      } as any,
    },
    {
      id: "4",
      name: "test4",
      zipCode: "08330",
      totalCost: 750,
      outcomes: {
        employment: [{ quarter: 2, employmentRate: 0.7 }]
      },
      cipDefinition: "definition4",
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
        outcomes: {
          employment: [{ quarter: 2, employmentRate: 0.6 }]
        },
        totalCost: 500,
        zipCode: "08330",
        cipDefinition: {
          cipCode: "12345",
          cipTitle: "CIP Title",
          cipDefinition: "definition2",
        },
      },
      {
        id: "4",
        name: "test4",
        outcomes: {
          employment: [{ quarter: 2, employmentRate: 0.7 }]
        },
        totalCost: 750,
        zipCode: "08330",
        cipDefinition: "definition4",
      },
      {
        id: "1",
        name: "test1",
        outcomes: {
          employment: [{ quarter: 2, employmentRate: 0.8 }]
        },
        totalCost: 1000,
        zipCode: "08330",
        cipDefinition: {
          cipCode: "12345",
          cipTitle: "CIP Title",
          cipDefinition: "definition1",
        },
      },
      {
        id: "3",
        name: "test3",
        outcomes: {
          employment: [{ quarter: 2, employmentRate: 0.9 }]
        },
        totalCost: 1500,
        zipCode: "08330",
        cipDefinition: {
          cipCode: "12345",
          cipTitle: "CIP Title",
          cipDefinition: "definition3",
        },
      },
    ]);
  });

  it("sorts the array by 'high' totalCost", () => {
    const sortedArray = arraySorting({ array, sortBy: "high" });
    expect(sortedArray).toEqual([
      {
        id: "3",
        name: "test3",
        outcomes: {
          employment: [{ quarter: 2, employmentRate: 0.9 }]
        },
        totalCost: 1500,
        zipCode: "08330",
        cipDefinition: {
          cipCode: "12345",
          cipTitle: "CIP Title",
          cipDefinition: "definition3",
        },
      },
      {
        id: "1",
        name: "test1",
        outcomes: {
          employment: [{ quarter: 2, employmentRate: 0.8 }]
        },
        totalCost: 1000,
        zipCode: "08330",
        cipDefinition: {
          cipCode: "12345",
          cipTitle: "CIP Title",
          cipDefinition: "definition1",
        },
      },
      {
        id: "4",
        name: "test4",
        outcomes: {
          employment: [{ quarter: 2, employmentRate: 0.7 }]
        },
        totalCost: 750,
        zipCode: "08330",
        cipDefinition: "definition4",
      },
      {
        id: "2",
        name: "test2",
        outcomes: {
          employment: [{ quarter: 2, employmentRate: 0.6 }]
        },
        totalCost: 500,
        zipCode: "08330",
        cipDefinition: {
          cipCode: "12345",
          cipTitle: "CIP Title",
          cipDefinition: "definition2",
        },
      },
    ]);
  });

  it("sorts the array by 'rate' employmentRate", () => {
    const sortedArray = arraySorting({ array, sortBy: "rate" });
    expect(sortedArray).toEqual([
      {
        id: "3",
        name: "test3",
        outcomes: {
          employment: [{ quarter: 2, employmentRate: 0.9 }]
        },
        totalCost: 1500,
        zipCode: "08330",
        cipDefinition: {
          cipCode: "12345",
          cipTitle: "CIP Title",
          cipDefinition: "definition3",
        },
      },
      {
        id: "1",
        name: "test1",
        outcomes: {
          employment: [{ quarter: 2, employmentRate: 0.8 }]
        },
        totalCost: 1000,
        zipCode: "08330",
        cipDefinition: {
          cipCode: "12345",
          cipTitle: "CIP Title",
          cipDefinition: "definition1",
        },
      },
      {
        id: "4",
        name: "test4",
        outcomes: {
          employment: [{ quarter: 2, employmentRate: 0.7 }]
        },
        totalCost: 750,
        zipCode: "08330",
        cipDefinition: "definition4",
      },
      {
        id: "2",
        name: "test2",
        outcomes: {
          employment: [{ quarter: 2, employmentRate: 0.6 }]
        },
        totalCost: 500,
        zipCode: "08330",
        cipDefinition: {
          cipCode: "12345",
          cipTitle: "CIP Title",
          cipDefinition: "definition2",
        },
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
