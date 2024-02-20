import { fireEvent, render, screen } from "@testing-library/react";
import { waitForEffect, renderWithRouter } from "../../test-objects/helpers";

import { FaqCollection } from "../FaqCollection";

// eslint-disable-next-line
const mockFaqTopics: any[] = [
  {
    sys: {
      id: "1",
    },
    title: "Category 1",
    topics: {
      items: [
        {
          sys: {
            id: "12",
          },
          topic: "Topic 1",
          itemsCollection: {
            items: [
              {
                sys: {
                  id: "121",
                },
                question: "Question 1",
                answer: {
                  json: {
                    content: [],
                    nodeType: "document",
                  },
                },
              },
              {
                sys: {
                  id: "122",
                },
                question: "Question 2",
                answer: {
                  json: {
                    content: [],
                    nodeType: "document",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    sys: {
      id: "2",
    },
    title: "Category 2",
    topics: {
      items: [
        {
          sys: {
            id: "21",
          },
          topic: "Topic 2",
          itemsCollection: {
            items: [
              {
                sys: {
                  id: "221",
                },
                question: "Question 3",
                answer: {
                  json: {
                    content: [],
                    nodeType: "document",
                  },
                },
              },
              {
                sys: {
                  id: "222",
                },
                question: "Question 4",
                answer: {
                  json: {
                    content: [],
                    nodeType: "document",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
];

describe("FaqCollection", () => {
  it("renders the topic selector button", async () => {
    const { history } = renderWithRouter(<FaqCollection items={mockFaqTopics} />);
    await history.navigate("/faq");
    expect(screen.getByTestId("topic-selector")).toBeInTheDocument();
  });
  it("renders the questions and answers", async () => {
    const { history } = renderWithRouter(<FaqCollection items={mockFaqTopics} />);
    await history.navigate("/faq");
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Question 2")).toBeInTheDocument();
  });
  it("renders the children", async () => {
    const { history } = renderWithRouter(<FaqCollection items={mockFaqTopics}>Some children</FaqCollection>);
    await history.navigate("/faq");
    expect(screen.getByText("Some children")).toBeInTheDocument();
  });
  it("updates the active topic when a different topic is clicked", async () => {
    const { history } = renderWithRouter(<FaqCollection items={mockFaqTopics} />);
    await history.navigate("/faq");
    const topic2Button = screen.getByText("Category 2");
    fireEvent.click(topic2Button);
    expect(screen.getByText("Topic 2")).toBeInTheDocument();
  });
});
