export interface Heading {
  title: string;
  elementId: string;
  items?: Heading[];
}

export function parseHeadingsToNestedArray(
  rootElement: HTMLElement,
): Heading[] {
  const headings: Heading[] = [];
  let currentH2: Heading | null = null;

  const processHeading = (element: HTMLElement) => {
    const title = element.textContent || ""; // Use textContent instead of innerText
    const elementId = element.id;
    const heading: Heading = { title, elementId };

    if (element.tagName === "H2") {
      currentH2 = heading;
      headings.push(heading);
    } else if (element.tagName === "H3" && currentH2) {
      if (!currentH2.items) {
        currentH2.items = [];
      }
      currentH2.items.push(heading);
    }
  };

  const elements = rootElement.querySelectorAll("h2, h3");

  elements.forEach((element) => {
    processHeading(element as HTMLElement);
  });

  return headings;
}
