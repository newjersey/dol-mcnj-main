import { getByTestId, render } from "@testing-library/react";
import { PageBanner } from "../PageBanner";

describe("PageBanner", () => {
  it("renders correctly with given props", () => {
    const title = "Test Title";
    const breadcrumbsCollection = {
      items: [
        { sys: { id: "1" }, copy: "Breadcrumb 1", url: "/breadcrumb1" },
        { sys: { id: "2" }, copy: "Breadcrumb 2", url: "/breadcrumb2" },
      ],
    };
    const section = "explore";
    const message = undefined;
    const ctaHeading = "CTA Heading";
    const ctaLinksCollection = {
      items: [
        { sys: { id: "1" }, copy: "CTA Link 1", url: "/cta1" },
        { sys: { id: "2" }, copy: "CTA Link 2", url: "/cta2" },
      ],
    };
    const date = new Date("2023-04-13");

    const { getByTestId, getByText, getAllByRole, getByLabelText } = render(
      <PageBanner
        title={title}
        breadcrumbsCollection={breadcrumbsCollection}
        section={section}
        message={message}
        ctaHeading={ctaHeading}
        ctaLinksCollection={ctaLinksCollection}
        date={date}
      />
    );

    // Assert title is rendered
    expect(getByTestId("title")).toBeInTheDocument();

    // Assert breadcrumbs are rendered
    breadcrumbsCollection.items.forEach((crumb) => {
      expect(getByText(crumb.copy)).toHaveAttribute("href", crumb.url);
    });

    // Assert section selector is rendered
    expect(getByLabelText("Breadcrumbs")).toBeInTheDocument();

    // Assert message content is rendered
    expect(getByText("CTA Heading")).toBeInTheDocument();

    // Assert CTA links are rendered
    ctaLinksCollection.items.forEach((link) => {
      expect(getByText(link.copy)).toHaveAttribute("href", link.url);
    });

    // Assert date is rendered
    expect(getByTestId("date")).toBeInTheDocument();
  });
});
