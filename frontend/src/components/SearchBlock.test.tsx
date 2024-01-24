import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { SearchBlock } from "./SearchBlock";
import type { ContentfulRichText } from "../types/contentful";

const testDrawerContent = {
  "json": {
    "data": {},
    "content": [{
      "data": {},
      "content": [{
        "data": {},
        "marks": [],
        "value": "SOC code",
        "nodeType": "text"
      }],
      "nodeType": "heading-3"
    },{
      "data": { },
      "content": [{
        "data":{},
        "marks":[],
        "value": "The \"Standard Occupational Classification\" system is used to categorize occupations.",
        "nodeType":"text"
      }],
      "nodeType": "paragraph"
    },{
      "data": {},
      "content": [{
        "data": {},
        "marks": [],
        "value": "You can find a list of SOC codes ","nodeType":"text"
      },{
        "data": {
          "uri": "https://www.bls.gov/oes/current/oes_stru.htm"
        },
        "content": [{
          "data":{},
          "marks":[],
          "value":"here",
          "nodeType":"text"
        }],
        "nodeType":"hyperlink"
      },{
        "data":{},
        "marks":[],
        "value":".",
        "nodeType":"text"
      }],
      "nodeType":"paragraph"
    },{
      "data":{},
      "content":[{
        "data":{},
        "marks":[],
        "value":"",
        "nodeType":"text"
      }],
      "nodeType":"paragraph"
    }],
    "nodeType":"document"},
    "links":{"assets":{"block":[]}}} as ContentfulRichText;

describe("SearchBlock", () => {
  beforeEach(() => {
    act(() => {
      render(
        <SearchBlock
          drawerContent={testDrawerContent}
        />,
      );
    })
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
