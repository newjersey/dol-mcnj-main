import { ContentfulRichTextProps } from "./types";

export interface OriginalQuestion {
  sys: { id: string };
  question: string;
  answer: ContentfulRichTextProps;
  category: string;
  topic: string;
}

interface TransformedTopic {
  _key: string; // Add unique key
  title: string;
  description: string;
  questions: OriginalQuestion[];
}

interface TransformedCategory {
  _key: string; // Add unique key
  title: string;
  topics: TransformedTopic[];
}

export function transformData(
  inputData: OriginalQuestion[],
): TransformedCategory[] {
  const categories: Record<string, TransformedCategory> = {};

  inputData.forEach((item) => {
    const categoryTitle = item.category || "Uncategorized";
    const topicTitle = item.topic || "Uncategorized";

    if (!categories[categoryTitle]) {
      const categoryKey = Math.random().toString(36).substring(2);
      categories[categoryTitle] = {
        _key: categoryKey,
        title: categoryTitle,
        topics: [],
      };
    }

    const category = categories[categoryTitle];

    if (!category.topics.some((topic) => topic.title === topicTitle)) {
      const topicKey = Math.random().toString(36).substring(2);
      category.topics.push({
        _key: topicKey,
        title: topicTitle,
        description: "", // You can add a description here if you have one.
        questions: [],
      });
    }

    const topic = category.topics.find((t) => t.title === topicTitle);

    if (topic) {
      topic.questions.push({
        sys: { id: item.sys.id },
        question: item.question,
        answer: item.answer,
        category: categoryTitle,
        topic: topicTitle,
      });
    }
  });

  // Convert categories object to an array and sort alphabetically
  const sortedCategories = Object.values(categories).sort((a, b) => {
    if (a.title === "Uncategorized") return 1;
    if (b.title === "Uncategorized") return -1;
    return a.title.localeCompare(b.title);
  });

  // Sort topics alphabetically within each category
  sortedCategories.forEach((category) => {
    category.topics.sort((a, b) => {
      if (a.title === "Uncategorized") return 1;
      if (b.title === "Uncategorized") return -1;
      return a.title.localeCompare(b.title);
    });
  });

  return sortedCategories;
}
