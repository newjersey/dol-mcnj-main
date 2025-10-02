import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ReferenceCards } from "./ReferenceCards";

// Define MediaCardProps type for testing
interface MediaCardProps {
  title: string;
  description?: string;
}

// Mock MediaCard component
jest.mock("../../../components/modules/MediaCard", () => ({
  MediaCard: ({ title, description, button }: any) => (
    <div data-testid="media-card">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {button && (
        <button
          onClick={button.onClick}
          data-testid={button.label.toLowerCase().replace(/\s+/g, "-")}
          data-button-type={button.type}
          data-icon={button.iconSuffix}
          data-style={button.defaultStyle}
        >
          {button.label}
        </button>
      )}
    </div>
  ),
}));

// Mock SectionHeading component
jest.mock("../../../components/modules/SectionHeading", () => ({
  SectionHeading: ({ heading, description, withIds, noDivider }: any) => (
    <div data-testid="section-heading">
      <h2>{heading}</h2>
      {description && <p>{description}</p>}
      <span data-with-ids={withIds} data-no-divider={noDivider} />
    </div>
  ),
}));

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

describe("ReferenceCards", () => {
  const mockProps = {
    heading: "Brand Assets",
    description: "Download our logos and color palette",
    logoCard: {
      title: "Logo Downloads",
      description: "Get our official logos in various formats",
    } as MediaCardProps,
    colorCard: {
      title: "Color Palette",
      description:
        "Primary: #005EA2<br>Secondary: #E52207<br>Tertiary: #112E51",
    } as MediaCardProps,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders correctly with all props", () => {
    render(<ReferenceCards {...mockProps} />);

    expect(screen.getByTestId("section-heading")).toBeInTheDocument();
    expect(screen.getByText("Brand Assets")).toBeInTheDocument();
    expect(
      screen.getByText("Download our logos and color palette")
    ).toBeInTheDocument();

    const mediaCards = screen.getAllByTestId("media-card");
    expect(mediaCards).toHaveLength(2);
  });

  it("renders logo card with download button", () => {
    render(<ReferenceCards {...mockProps} />);

    expect(screen.getByText("Logo Downloads")).toBeInTheDocument();
    expect(
      screen.getByText("Get our official logos in various formats")
    ).toBeInTheDocument();

    const downloadButton = screen.getByTestId("download-logos");
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toHaveAttribute("data-button-type", "link");
    expect(downloadButton).toHaveAttribute("data-icon", "DownloadSimple");
  });

  it("renders color card with copy button", () => {
    render(<ReferenceCards {...mockProps} />);

    expect(screen.getByText("Color Palette")).toBeInTheDocument();
    // The HTML is escaped, so we need to check for the actual rendered text
    expect(
      screen.getByText("Primary: #005EA2<br>Secondary: #E52207<br>Tertiary: #112E51")
    ).toBeInTheDocument();

    const copyButton = screen.getByTestId("copy-colors");
    expect(copyButton).toBeInTheDocument();
    expect(copyButton).toHaveAttribute("data-button-type", "button");
    expect(copyButton).toHaveAttribute("data-icon", "Copy");
    expect(copyButton).toHaveAttribute("data-style", "primary");
  });

  it("copies color text to clipboard when copy button is clicked", async () => {
    render(<ReferenceCards {...mockProps} />);

    const copyButton = screen.getByTestId("copy-colors");
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "Primary: #005EA2Secondary: #E52207Tertiary: #112E51"
    );
  });

  it("shows success state after copying", async () => {
    render(<ReferenceCards {...mockProps} />);

    const copyButton = screen.getByTestId("copy-colors");
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(copyButton).toHaveAttribute("data-icon", "Check");
      expect(copyButton).toHaveAttribute("data-style", "secondary");
    });
  });

  it("resets copy success state after 2 seconds", async () => {
    render(<ReferenceCards {...mockProps} />);

    const copyButton = screen.getByTestId("copy-colors");
    fireEvent.click(copyButton);

    // Should show success state
    await waitFor(() => {
      expect(copyButton).toHaveAttribute("data-icon", "Check");
      expect(copyButton).toHaveAttribute("data-style", "secondary");
    });

    // Fast-forward 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(copyButton).toHaveAttribute("data-icon", "Copy");
      expect(copyButton).toHaveAttribute("data-style", "primary");
    });
  });

  it("handles empty color card description gracefully", () => {
    const propsWithEmptyDescription = {
      ...mockProps,
      colorCard: {
        ...mockProps.colorCard,
        description: "",
      },
    };

    render(<ReferenceCards {...propsWithEmptyDescription} />);

    const copyButton = screen.getByTestId("copy-colors");
    fireEvent.click(copyButton);

    // Should not call clipboard API if description is empty
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it("handles undefined color card description gracefully", () => {
    const propsWithUndefinedDescription = {
      ...mockProps,
      colorCard: {
        ...mockProps.colorCard,
        description: undefined,
      },
    };

    render(<ReferenceCards {...propsWithUndefinedDescription} />);

    const copyButton = screen.getByTestId("copy-colors");
    fireEvent.click(copyButton);

    // Should not call clipboard API if description is undefined
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it("strips HTML tags from copied text", () => {
    const propsWithHtmlDescription = {
      ...mockProps,
      colorCard: {
        ...mockProps.colorCard,
        description:
          "<strong>Primary:</strong> #005EA2<br><em>Secondary:</em> #E52207",
      },
    };

    render(<ReferenceCards {...propsWithHtmlDescription} />);

    const copyButton = screen.getByTestId("copy-colors");
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "Primary: #005EA2Secondary: #E52207"
    );
  });

  it("passes correct props to SectionHeading", () => {
    render(<ReferenceCards {...mockProps} />);

    const sectionHeading = screen.getByTestId("section-heading");
    expect(
      sectionHeading.querySelector("[data-with-ids='true']")
    ).toBeInTheDocument();
    expect(
      sectionHeading.querySelector("[data-no-divider='true']")
    ).toBeInTheDocument();
  });

  it("applies correct CSS classes to container", () => {
    const { container } = render(<ReferenceCards {...mockProps} />);

    const section = container.querySelector("section");
    expect(section).toHaveClass("container");

    const cardGrid = container.querySelector("div.grid");
    expect(cardGrid).toHaveClass(
      "grid",
      "grid-cols-1",
      "tablet:grid-cols-2",
      "items-start",
      "tabletLg:grid-cols-3",
      "gap-8"
    );
  });

  it("handles multiple clicks on copy button correctly", async () => {
    render(<ReferenceCards {...mockProps} />);

    const copyButton = screen.getByTestId("copy-colors");

    // First click
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);

    // Second click while in success state
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(2);

    // Should still show success state
    await waitFor(() => {
      expect(copyButton).toHaveAttribute("data-icon", "Check");
    });
  });
});
