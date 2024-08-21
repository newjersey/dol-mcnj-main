import { sanitizeString } from "./sanitizeString";

describe("sanitizeString function", () => {
  it("should replace special characters with HTML entities", () => {
    // Test case 1: Basic conversion
    expect(sanitizeString("<p>Hello, \"World\" & 'Universe'!</p>")).toBe(
      "&lt;p&gt;Hello, &quot;World&quot; &amp; &#39;Universe&#39;!&lt;&#x2F;p&gt;",
    );

    // Test case 2: Single special character
    expect(sanitizeString("&")).toBe("&amp;");

    // Test case 3: Empty string
    expect(sanitizeString("")).toBe("");

    // Test case 4: No special characters
    expect(sanitizeString("No special characters here!")).toBe(
      "No special characters here!",
    );

    // Test case 5: Special characters mixed with regular text
    expect(
      sanitizeString('<div>&nbsp; Hello & <strong>"World"</strong>!</div>'),
    ).toBe(
      "&lt;div&gt;&amp;nbsp; Hello &amp; &lt;strong&gt;&quot;World&quot;&lt;&#x2F;strong&gt;!&lt;&#x2F;div&gt;",
    );
  });
});
