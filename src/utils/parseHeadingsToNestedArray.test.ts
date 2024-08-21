import {
  parseHeadingsToNestedArray,
  Heading,
} from "./parseHeadingsToNestedArray";

describe("parseHeadingsToNestedArray", () => {
  let rootElement: HTMLElement;

  beforeEach(() => {
    rootElement = document.createElement("div");
  });

  it("parses H2 headings correctly", () => {
    rootElement.innerHTML = `
      <h2 id="h2-1">Heading 1</h2>
      <h2 id="h2-2">Heading 2</h2>
    `;
    const result: Heading[] = parseHeadingsToNestedArray(rootElement);
    const expected: Heading[] = [
      { title: "Heading 1", elementId: "h2-1" },
      { title: "Heading 2", elementId: "h2-2" },
    ];
    expect(result).toEqual(expected);
  });

  it("parses H2 and H3 headings correctly", () => {
    rootElement.innerHTML = `
      <h2 id="h2-1">Heading 1</h2>
      <h3 id="h3-1">Subheading 1.1</h3>
      <h2 id="h2-2">Heading 2</h2>
      <h3 id="h3-2">Subheading 2.1</h3>
    `;
    const result: Heading[] = parseHeadingsToNestedArray(rootElement);
    const expected: Heading[] = [
      {
        title: "Heading 1",
        elementId: "h2-1",
        items: [{ title: "Subheading 1.1", elementId: "h3-1" }],
      },
      {
        title: "Heading 2",
        elementId: "h2-2",
        items: [{ title: "Subheading 2.1", elementId: "h3-2" }],
      },
    ];
    expect(result).toEqual(expected);
  });

  it("ignores H3 without preceding H2", () => {
    rootElement.innerHTML = `
      <h3 id="h3-1">Subheading 1.1</h3>
      <h2 id="h2-1">Heading 1</h2>
      <h3 id="h3-2">Subheading 1.2</h3>
    `;
    const result: Heading[] = parseHeadingsToNestedArray(rootElement);
    const expected: Heading[] = [
      {
        title: "Heading 1",
        elementId: "h2-1",
        items: [{ title: "Subheading 1.2", elementId: "h3-2" }],
      },
    ];
    expect(result).toEqual(expected);
  });

  it("handles nested H3 headings correctly", () => {
    rootElement.innerHTML = `
      <h2 id="h2-1">Heading 1</h2>
      <h3 id="h3-1">Subheading 1.1</h3>
      <h3 id="h3-2">Subheading 1.2</h3>
      <h2 id="h2-2">Heading 2</h2>
      <h3 id="h3-3">Subheading 2.1</h3>
    `;
    const result: Heading[] = parseHeadingsToNestedArray(rootElement);
    const expected: Heading[] = [
      {
        title: "Heading 1",
        elementId: "h2-1",
        items: [
          { title: "Subheading 1.1", elementId: "h3-1" },
          { title: "Subheading 1.2", elementId: "h3-2" },
        ],
      },
      {
        title: "Heading 2",
        elementId: "h2-2",
        items: [{ title: "Subheading 2.1", elementId: "h3-3" }],
      },
    ];
    expect(result).toEqual(expected);
  });

  it("handles empty root element", () => {
    const result: Heading[] = parseHeadingsToNestedArray(rootElement);
    expect(result).toEqual([]);
  });
});
