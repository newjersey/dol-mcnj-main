import { groupObjectsByLevel } from "./groupObjectsByLevel";
import { OccupationNodeProps } from "./types";

describe("groupObjectsByLevel", () => {
  const sampleData: OccupationNodeProps[] = [
    {
      sys: { id: "1" },
      level: 1,
      title: "Job A",
      description: "Description A",
      salaryRangeStart: 50000,
      salaryRangeEnd: 60000,
      educationLevel: "Bachelor's",
    },
    {
      sys: { id: "2" },
      level: 2,
      title: "Job B",
      description: "Description B",
      salaryRangeStart: 60000,
      salaryRangeEnd: 70000,
      educationLevel: "Master's",
    },
    {
      sys: { id: "3" },
      level: 1,
      title: "Job C",
      description: "Description C",
      salaryRangeStart: 55000,
      salaryRangeEnd: 65000,
      educationLevel: "Bachelor's",
    },
    {
      sys: { id: "4" },
      level: 3,
      title: "Job D",
      description: "Description D",
      salaryRangeStart: 70000,
      salaryRangeEnd: 80000,
      educationLevel: "PhD",
    },
  ];

  it("groups objects by their level", () => {
    const expectedOutput: OccupationNodeProps[][] = [
      [sampleData[0], sampleData[2]],
      [sampleData[1]],
      [sampleData[3]],
    ];

    expect(groupObjectsByLevel(sampleData)).toEqual(expectedOutput);
  });

  it("handles an empty array", () => {
    const input: OccupationNodeProps[] = [];
    const expectedOutput: OccupationNodeProps[][] = [];

    expect(groupObjectsByLevel(input)).toEqual(expectedOutput);
  });

  it("handles an array with objects of the same level", () => {
    const input: OccupationNodeProps[] = [
      {
        sys: { id: "1" },
        level: 1,
        title: "Job A",
        description: "Description A",
        salaryRangeStart: 50000,
        salaryRangeEnd: 60000,
        educationLevel: "Bachelor's",
      },
      {
        sys: { id: "2" },
        level: 1,
        title: "Job B",
        description: "Description B",
        salaryRangeStart: 60000,
        salaryRangeEnd: 70000,
        educationLevel: "Master's",
      },
    ];

    const expectedOutput: OccupationNodeProps[][] = [[input[0], input[1]]];

    expect(groupObjectsByLevel(input)).toEqual(expectedOutput);
  });

  it("handles an array with only one object", () => {
    const input: OccupationNodeProps[] = [
      {
        sys: { id: "1" },
        level: 1,
        title: "Job A",
        description: "Description A",
        salaryRangeStart: 50000,
        salaryRangeEnd: 60000,
        educationLevel: "Bachelor's",
      },
    ];

    const expectedOutput: OccupationNodeProps[][] = [[input[0]]];

    expect(groupObjectsByLevel(input)).toEqual(expectedOutput);
  });

  it("handles an array with objects having non-sequential levels", () => {
    const input: OccupationNodeProps[] = [
      {
        sys: { id: "1" },
        level: 1,
        title: "Job A",
        description: "Description A",
        salaryRangeStart: 50000,
        salaryRangeEnd: 60000,
        educationLevel: "Bachelor's",
      },
      {
        sys: { id: "2" },
        level: 3,
        title: "Job B",
        description: "Description B",
        salaryRangeStart: 60000,
        salaryRangeEnd: 70000,
        educationLevel: "Master's",
      },
      {
        sys: { id: "3" },
        level: 2,
        title: "Job C",
        description: "Description C",
        salaryRangeStart: 55000,
        salaryRangeEnd: 65000,
        educationLevel: "Bachelor's",
      },
      {
        sys: { id: "4" },
        level: 5,
        title: "Job D",
        description: "Description D",
        salaryRangeStart: 70000,
        salaryRangeEnd: 80000,
        educationLevel: "PhD",
      },
    ];

    const expectedOutput: OccupationNodeProps[][] = [
      [input[0]],
      [input[1]],
      [input[2]],
      [input[3]],
    ];

    expect(groupObjectsByLevel(input)).toEqual(expectedOutput);
  });
});
