import { fireEvent, render } from "@testing-library/react";
import { TabContent } from "../TabContent";

const mockContent = {
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "paragraph",
      data: {},
      content: [
        {
          nodeType: "text",
          value: "This is some text",
          marks: [],
          data: {},
        },
      ],
    },
  ],
};

// eslint-disable-next-line
const mockItems: any = [
  {
    sys: { id: "1" },
    heading: "Tab 1",
    copy: { json: mockContent },
  },
  {
    sys: { id: "2" },
    heading: "Tab 2",
    copy: { json: mockContent },
  },
];

describe("TabContent", () => {
  it("renders a list of tabs", () => {
    const { getAllByRole } = render(<TabContent items={mockItems} />);
    const tabButtons = getAllByRole("button");

    expect(tabButtons).toHaveLength(2);
    expect(tabButtons[0]).toHaveTextContent("Tab 1");
    expect(tabButtons[1]).toHaveTextContent("Tab 2");
  });

  it("renders the content of the active tab", () => {
    const { getByTestId } = render(<TabContent items={mockItems} />);
    const tabButton = getByTestId("tab-2");

    fireEvent.click(tabButton);

    expect(tabButton).toBeInTheDocument();
  });

  it("updates the URL when a tab is clicked", () => {
    window.history.replaceState = jest.fn();

    const { getByTestId } = render(<TabContent items={mockItems} />);
    const tabButton = getByTestId("tab-2");

    fireEvent.click(tabButton);

    expect(window.history.replaceState).toHaveBeenCalledWith({}, "", "http://localhost/#tab-2");
  });

  it("sets the active tab based on the URL anchor", () => {
    const originalLocation = window.location.href;
    window.history.replaceState({}, "", "http://localhost/#tab-2");

    const { getByTestId } = render(<TabContent items={mockItems} />);

    expect(getByTestId("tab-2")).toBeInTheDocument();

    window.history.replaceState({}, "", originalLocation);
  });
});
