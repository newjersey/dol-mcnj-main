import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { BetaBanner } from "../BetaBanner";

describe("<BetaBanner />", () => {
  it("accepts a prop for removing the header margin", () => {
    act(() => {
      render(<BetaBanner noHeader={true} />);
    })
    const banner = screen.getByText("Share your feedback!", { exact: false }).parentElement;
    expect(banner).toHaveClass("no-header-margin");
  });

  it("uses default margin if no header prop passed", () => {
    act(() => {
      render(<BetaBanner />);
    })
    const banner = screen.getByText("Share your feedback!", { exact: false }).parentElement;
    expect(banner).not.toHaveClass("no-header-margin");
  });
});
