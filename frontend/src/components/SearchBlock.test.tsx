// Import necessary libraries and types
import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {SearchBlock} from './SearchBlock';
import type {ContentfulRichText} from '../types/contentful';
import {BLOCKS} from "@contentful/rich-text-types";


// Define the test data for the drawer content
const testDrawerContent: ContentfulRichText = {
  json: {
    data: {},
    content: [{
      data: {},
      content: [{
        data: {},
        marks: [],
        value: "SOC code",
        nodeType: "text"
      }],
      nodeType: BLOCKS.HEADING_3
    }, {
      data: {},
      content: [{
        data: {},
        marks: [],
        value: "The \"Standard Occupational Classification\" system is used to categorize occupations.",
        nodeType: "text"
      }],
      nodeType: BLOCKS.PARAGRAPH
    }, {
      data: {},
      content: [{
        data: {},
        marks: [],
        value: "You can find a list of SOC codes ",
        nodeType: "text"
      }, {
        data: {
          uri: "https://www.bls.gov/oes/current/oes_stru.htm"
        },
        content: [{
          data: {},
          marks: [],
          value: "here",
          nodeType: "text"
        }],
        nodeType: BLOCKS.PARAGRAPH
      }, {
        data: {},
        marks: [],
        value: ".",
        nodeType: "text"
      }],
      nodeType: BLOCKS.PARAGRAPH
    }, {
      data: {},
      content: [{
        data: {},
        marks: [],
        value: "",
        nodeType: "text"
      }],
      nodeType: BLOCKS.PARAGRAPH
    }],
    nodeType: BLOCKS.DOCUMENT
  },
  links: { assets: { block: [] } }
};

describe("SearchBlock", () => {
  let originalLocation: Location;

  // Mock assign function
  let assignMock: jest.Mock;


  beforeAll(() => {
    // Save the original location
    originalLocation = window.location;

    // Mock the window.location with a jest.fn() for each function you need, for example, assign
    // Use Object.defineProperty to bypass the type error without using 'as any'
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        assign: jest.fn(),
      },
      writable: true,
    });

    assignMock = window.location.assign as jest.Mock;
  });

  beforeEach(() => {
    assignMock.mockClear();
    act(() => {
      render(<SearchBlock drawerContent={testDrawerContent} />);
    });
  });

  afterEach(() => {
    assignMock.mockClear();
  });

  afterAll(() => {
    // Restore window.location to its original state
    window.location = originalLocation;
  });

  test("renders search input correctly", () => {
    const searchInput = screen.getByTestId("search-input") as HTMLInputElement;
    expect(searchInput).toBeInTheDocument();
  });

  test("updates search term correctly", () => {
    const searchInput = screen.getByTestId("search-input") as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(searchInput.value).toBe("test");
  });

  test("clears all inputs correctly", () => {
    const searchInput = screen.getByTestId("search-input") as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "test" } });

    const clearAllButton = screen.getByText("Clear All");
    fireEvent.click(clearAllButton);

    expect(searchInput.value).toBe("");
  });

  test("submits search form correctly", () => {
    const searchInput = screen.getByTestId("search-input") as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "test" } });

    const form = screen.getByTestId("search-form");
    const submitMock = jest.fn();
    form.onsubmit = submitMock;

    const searchSubmitButton = screen.getByTestId("search-submit");
    fireEvent.click(searchSubmitButton);

    expect(submitMock).toHaveBeenCalled();
  });
});
