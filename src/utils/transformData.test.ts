// transformData.test.ts
import { transformData, OriginalQuestion } from "./transformData"; // Adjust the path accordingly
import { ContentfulRichTextProps } from "./types";

describe("transformData", () => {
  it("should transform input data into categories and topics", () => {
    const inputData: OriginalQuestion[] = [
      {
        sys: { id: "1" },
        question: "Question 1",
        answer: { json: {} } as ContentfulRichTextProps,
        category: "Category 1",
        topic: "Topic 1",
      },
      {
        sys: { id: "2" },
        question: "Question 2",
        answer: { json: {} } as ContentfulRichTextProps,
        category: "Category 1",
        topic: "Topic 2",
      },
      {
        sys: { id: "3" },
        question: "Question 3",
        answer: { json: {} } as ContentfulRichTextProps,
        category: "Category 2",
        topic: "Topic 1",
      },
    ];

    const result = transformData(inputData);

    expect(result).toHaveLength(2);

    expect(result[0].title).toBe("Category 1");
    expect(result[0].topics).toHaveLength(2);
    expect(result[0].topics[0].title).toBe("Topic 1");
    expect(result[0].topics[0].questions).toHaveLength(1);
    expect(result[0].topics[1].title).toBe("Topic 2");
    expect(result[0].topics[1].questions).toHaveLength(1);

    expect(result[1].title).toBe("Category 2");
    expect(result[1].topics).toHaveLength(1);
    expect(result[1].topics[0].title).toBe("Topic 1");
    expect(result[1].topics[0].questions).toHaveLength(1);
  });

  it("should handle empty input data", () => {
    const inputData: OriginalQuestion[] = [];

    const result = transformData(inputData);

    expect(result).toEqual([]);
  });

  it('should place items with no category or topic in "Uncategorized"', () => {
    const inputData: OriginalQuestion[] = [
      {
        sys: { id: "1" },
        question: "Question 1",
        answer: { json: {} } as ContentfulRichTextProps,
        category: "",
        topic: "",
      },
    ];

    const result = transformData(inputData);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Uncategorized");
    expect(result[0].topics).toHaveLength(1);
    expect(result[0].topics[0].title).toBe("Uncategorized");
    expect(result[0].topics[0].questions).toHaveLength(1);
  });

  it('should sort categories and topics alphabetically, placing "Uncategorized" at the end', () => {
    const inputData: OriginalQuestion[] = [
      {
        sys: { id: "1" },
        question: "Question 1",
        answer: { json: {} } as ContentfulRichTextProps,
        category: "Category B",
        topic: "Topic 2",
      },
      {
        sys: { id: "2" },
        question: "Question 2",
        answer: { json: {} } as ContentfulRichTextProps,
        category: "Category A",
        topic: "Topic 1",
      },
      {
        sys: { id: "3" },
        question: "Question 3",
        answer: { json: {} } as ContentfulRichTextProps,
        category: "",
        topic: "",
      },
    ];

    const result = transformData(inputData);

    expect(result).toHaveLength(3);
    expect(result[0].title).toBe("Category A");
    expect(result[1].title).toBe("Category B");
    expect(result[2].title).toBe("Uncategorized");
  });
});
