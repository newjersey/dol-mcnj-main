import { render } from "@testing-library/react";
import { PageBanner } from "../PageBanner";

describe("PageBanner", () => {
  it("renders the heading and subheading", () => {
    const heading = "Page Title";
    const subheading = "Page subtitle";
    const { getByText } = render(<PageBanner heading={heading} subheading={subheading} />);
    expect(getByText(heading)).toBeInTheDocument();
    expect(getByText(subheading)).toBeInTheDocument();
  });

  it("renders the breadcrumb links", () => {
    const breadCrumbs = [
      { text: "Home", href: "/" },
      { text: "Products", href: "/products" },
      { text: "Product 1" },
    ];
    const { getByText } = render(<PageBanner heading="Page Title" breadCrumbs={breadCrumbs} />);
    breadCrumbs.forEach((crumb) => {
      const breadcrumbLink = getByText(crumb.text);
      if (crumb.href) {
        expect(breadcrumbLink).toHaveAttribute("href", crumb.href);
      }
    });
  });

  it("does not render the subheading when it is not provided", () => {
    const heading = "Page Title";
    const { queryByText } = render(<PageBanner heading={heading} />);
    expect(queryByText("Page subtitle")).toBeNull();
  });

  it("does not render the breadcrumb list when it is not provided", () => {
    const heading = "Page Title";
    const { queryByText } = render(<PageBanner heading={heading} />);
    expect(queryByText("Home")).toBeNull();
    expect(queryByText("Products")).toBeNull();
    expect(queryByText("Product 1")).toBeNull();
  });
});
