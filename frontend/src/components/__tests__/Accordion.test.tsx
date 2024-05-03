import { render, fireEvent, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
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
    act(() => {
      render(<Accordion {...mockData} />);
    })
    const accordion = screen.getByTestId("accordion-0");
    expect(accordion).toHaveClass("closed");
  });

  it("should open when the button is clicked", () => {
    act(() => {
      render(<Accordion {...mockData} />);
    })
    const button = screen.getByTestId("accordion-button");
    fireEvent.click(button);
    const accordion = screen.getByTestId("accordion-0");
    expect(accordion).toHaveClass("open");
  });

  it("should close when the button is clicked again", () => {
    act(() => {
      render(<Accordion {...mockData} />);
    })
    const button = screen.getByTestId("accordion-button");
    fireEvent.click(button);
    fireEvent.click(button);
    const accordion = screen.getByTestId("accordion-0");
    expect(accordion).toHaveClass("closed");
  });

  it("should render the title and content", () => {
    act(() => {
      render(<Accordion {...mockData} />);
    })
    // const title = screen.getByText(mockData.title);
    // expect(title).toBeInTheDocument();
    const content = screen.getByTestId("accordion-content-0");
    expect(content).toHaveTextContent("You can watch this video");
    expect(content).toHaveTextContent(
      "for detailed instructions on how to use the search on this site.",
    );
  });
});
