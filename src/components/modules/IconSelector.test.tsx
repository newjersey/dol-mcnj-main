import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { IconSelector, removeSecondBold } from "./IconSelector";
import * as Icon from "@phosphor-icons/react";
import * as Svg from "../svgs";

// Mock the Icon and Svg imports
jest.mock("@phosphor-icons/react", () => ({
  // Add relevant icon mock implementations if needed
}));

jest.mock("../svgs", () => ({
  // Add relevant svg mock implementations if needed
}));

describe("removeSecondBold function", () => {
  it('removes the second occurrence of "Bold" from the string', () => {
    const input = removeSecondBold("trainingBoldBold");
    const expectedOutput = "trainingBold";
    expect(removeSecondBold(input)).toBe(expectedOutput);
  });

  it('returns the same string if "Bold" occurs less than twice', () => {
    const input = "ExampleBoldString";
    expect(removeSecondBold(input)).toBe(input);
  });

  it('returns the same string if "Bold" does not occur', () => {
    const input = "ExampleString";
    expect(removeSecondBold(input)).toBe(input);
  });
});
