import React from "react";
import { render } from "@testing-library/react";
import { BetaBanner } from "./BetaBanner";

describe("<BetaBanner />", () => {
  it("accepts a prop for removing the header margin", () => {
    const subject = render(<BetaBanner noHeader={true} />);
    const banner = subject.getByText("feedback", { exact: false });
    expect(banner).toHaveClass("no-header-margin");
  });
});
