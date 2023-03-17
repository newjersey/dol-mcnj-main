import { fireEvent, render, screen } from "@testing-library/react";
import { FaqCollection } from "../FaqCollection";

// eslint-disable-next-line
const mockFaqTopics: any[] = [
  {
    sys: { id: "1" },
    topic: "Topic 1",
    itemsCollection: {
      items: [
        {
          sys: { id: "1" },
          question: "Question 1",
          answer: { json: { nodeType: "document", content: [] } },
        },
        {
          sys: { id: "2" },
          question: "Question 2",
          answer: { json: { nodeType: "document", content: [] } },
        },
      ],
    },
  },
  {
    sys: { id: "2" },
    topic: "Topic 2",
    itemsCollection: {
      items: [
        {
          sys: { id: "3" },
          question: "Question 3",
          answer: { json: { nodeType: "document", content: [] } },
        },
        {
          sys: { id: "4" },
          question: "Question 4",
          answer: { json: { nodeType: "document", content: [] } },
        },
      ],
    },
  },
];

describe("FaqCollection", () => {
  it("renders the topic selector button", () => {
    render(<FaqCollection items={mockFaqTopics} />);
    expect(screen.getByTestId("topic-selector")).toBeInTheDocument();
  });
  it("renders the questions and answers", () => {
    render(<FaqCollection items={mockFaqTopics} />);
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Question 2")).toBeInTheDocument();
  });
  it("renders the children", () => {
    render(<FaqCollection items={mockFaqTopics}>Some children</FaqCollection>);
    expect(screen.getByText("Some children")).toBeInTheDocument();
  });
  it("updates the active topic when a different topic is clicked", () => {
    render(<FaqCollection items={mockFaqTopics} />);
    const topic2Button = screen.getByText("Topic 2");
    fireEvent.click(topic2Button);
    expect(screen.getByText("Question 3")).toBeInTheDocument();
  });
});
