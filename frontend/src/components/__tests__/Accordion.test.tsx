import { render, fireEvent } from "@testing-library/react";
import { Accordion, AccordionData } from "../Accordion";

// eslint-disable-next-line
const mockContent: any = {
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "paragraph",
      data: {},
      content: [
        {
          nodeType: "text",
          value: "You can watch this ",
          marks: [],
          data: {},
        },
        {
          nodeType: "hyperlink",
          data: {
            uri: "https://youtu.be/WogMsybfQ04",
          },
          content: [
            {
              nodeType: "text",
              value: "video",
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: "text",
          value: " or read instructions on ",
          marks: [],
          data: {},
        },
        {
          nodeType: "hyperlink",
          data: {
            uri: "https://training.njcareers.org/faq/search-help",
          },
          content: [
            {
              nodeType: "text",
              value: "this page",
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: "text",
          value: " for detailed instructions on how to use the search on this site. ",
          marks: [],
          data: {},
        },
      ],
    },
  ],
};

const mockData: AccordionData = {
  title: "Accordion Title",
  content: mockContent,
  keyValue: 0,
};

describe("Accordion", () => {
  it("should render with closed state by default", () => {
    const { getByTestId } = render(<Accordion {...mockData} />);
    const accordion = getByTestId("accordion");
    expect(accordion).toHaveClass("closed");
  });

  it("should open when the button is clicked", () => {
    const { getByTestId } = render(<Accordion {...mockData} />);
    const button = getByTestId("accordion-button");
    fireEvent.click(button);
    const accordion = getByTestId("accordion");
    expect(accordion).toHaveClass("open");
  });

  it("should close when the button is clicked again", () => {
    const { getByTestId } = render(<Accordion {...mockData} />);
    const button = getByTestId("accordion-button");
    fireEvent.click(button);
    fireEvent.click(button);
    const accordion = getByTestId("accordion");
    expect(accordion).toHaveClass("closed");
  });

  it("should render the title and content", () => {
    const { getByText, getByTestId } = render(<Accordion {...mockData} />);
    const title = getByText(mockData.title);
    expect(title).toBeInTheDocument();
    const content = getByTestId("accordion-content");
    expect(content).toHaveTextContent("You can watch this video");
    expect(content).toHaveTextContent(
      "for detailed instructions on how to use the search on this site."
    );
  });
});
