import React from "react";
import { render } from "@testing-library/react";
import { BetaBanner } from "./BetaBanner";

describe("<BetaBanner />", () => {
  it("accepts a prop for removing the header margin", () => {
    const subject = render(<BetaBanner noHeader={true} />);
    const banner = subject.getByText("beta", { exact: false });
    expect(banner).toHaveClass("no-header-margin");
  });

  it("uses default margin if no header prop passed", () => {
    const subject = render(<BetaBanner />);
    const banner = subject.getByText("beta", { exact: false });
    expect(banner).not.toHaveClass("no-header-margin");
  });
});
