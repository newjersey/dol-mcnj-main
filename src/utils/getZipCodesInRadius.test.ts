import { getZipCodesInRadius } from "./getZipCodesInRadius";

// Mock data for zipCodeToCoordinates
jest.mock("./zipCodeCoordinates", () => ({
  zipCodeToCoordinates: {
    "12345": [40.7128, -74.006], // Example coordinates (New York)
    "23456": [34.0522, -118.2437], // Example coordinates (Los Angeles)
    "34567": [41.8781, -87.6298], // Example coordinates (Chicago)
    "45678": [29.7604, -95.3698], // Example coordinates (Houston)
    "56789": [39.7392, -104.9903], // Example coordinates (Denver)
  },
}));

describe("getZipCodesInRadius", () => {
  it("should return an empty array if the zip code is not in zipCodeToCoordinates", () => {
    const result = getZipCodesInRadius("00000", 10);
    expect(result).toEqual([]);
  });

  it("should return an empty array if there are no zip codes within the specified radius", () => {
    const result = getZipCodesInRadius("12345", -1); // radius too small
    expect(result).toEqual([]);
  });

  it("should return zip codes within the specified radius", () => {
    // Adjust radius to ensure it includes other coordinates
    const result = getZipCodesInRadius("12345", 3000);
    expect(result).toEqual(expect.arrayContaining(["34567", "45678", "56789"]));
  });

  it("should include the original zip code if within radius", () => {
    const result = getZipCodesInRadius("12345", 3000);
    expect(result).toContain("12345");
  });

  it("should handle a radius of zero", () => {
    const result = getZipCodesInRadius("12345", 0);
    expect(result).toEqual(["12345"]);
  });

  it("should handle a large radius to include all coordinates", () => {
    const result = getZipCodesInRadius("12345", 10000);
    expect(result).toEqual(["12345", "23456", "34567", "45678", "56789"]);
  });
});
