import { FilterProps } from "../app/training/search/components/Results";
import { handleFiltering } from "./handleFiltering";
import { ResultProps } from "./types";

describe("handleFiltering", () => {
  const items: ResultProps[] = [
    {
      id: "1",
      name: "Course 1",
      cipDefinition: { cip: "123", cipcode: "123", ciptitle: "CIP 123" },
      zipCode: "12345",
      county: "County1",
      inDemand: true,
      totalCost: 500,
      calendarLength: 12,
      online: true,
      isWheelchairAccessible: true,
      hasJobPlacementAssistance: true,
      hasChildcareAssistance: true,
      hasEveningCourses: true,
      languages: ["English", "Spanish"],
      socCodes: ["SOC1"],
    },
    {
      id: "2",
      name: "Course 2",
      cipDefinition: { cip: "124", cipcode: "124", ciptitle: "CIP 124" },
      zipCode: "67890",
      county: "County2",
      inDemand: false,
      totalCost: 1000,
      calendarLength: 24,
      online: false,
      isWheelchairAccessible: false,
      hasJobPlacementAssistance: false,
      hasChildcareAssistance: false,
      hasEveningCourses: false,
      languages: ["French"],
      socCodes: ["SOC2"],
    },
  ];

  it("should return all items when no filterObject is provided", () => {
    const result = handleFiltering(items);
    expect(result).toEqual(items);
  });

  it("should filter by zipCode", () => {
    const filterObject: FilterProps = { zipCode: ["12345"] };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([items[0]]);
  });

  it("should filter by county", () => {
    const filterObject: FilterProps = { county: "County1" };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([items[0]]);
  });

  it("should filter by inDemand", () => {
    const filterObject: FilterProps = { inDemand: true };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([items[0]]);
  });

  it("should filter by totalCost", () => {
    const filterObject: FilterProps = { totalCost: 600 };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([items[0]]);
  });

  it("should filter by cipCode", () => {
    const filterObject: FilterProps = { cipCode: "123" };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([items[0]]);
  });

  it("should filter by online status", () => {
    const filterObject: FilterProps = { online: "true" };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([items[0]]);
  });

  it("should filter by completionTime", () => {
    const filterObject: FilterProps = { completionTime: [12] };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([items[0]]);
  });

  it("should filter by isWheelchairAccessible", () => {
    const filterObject: FilterProps = { isWheelchairAccessible: true };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([items[0]]);
  });

  it("should filter by hasJobPlacementAssistance", () => {
    const filterObject: FilterProps = { hasJobPlacementAssistance: true };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([items[0]]);
  });

  it("should filter by hasChildcareAssistance", () => {
    const filterObject: FilterProps = { hasChildcareAssistance: true };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([items[0]]);
  });

  it("should filter by hasEveningCourses", () => {
    const filterObject: FilterProps = { hasEveningCourses: true };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([items[0]]);
  });

  it("should filter by languages", () => {
    const filterObject: FilterProps = { languages: ["Spanish"] };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([items[0]]);
  });

  it("should filter by socCode", () => {
    const filterObject: FilterProps = { socCode: "SOC1" };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([items[0]]);
  });

  it("should return empty array if no items match the filter criteria", () => {
    const filterObject: FilterProps = { zipCode: ["00000"] };
    const result = handleFiltering(items, filterObject);
    expect(result).toEqual([]);
  });
});
