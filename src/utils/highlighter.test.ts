import { highlighter } from "./highlighter";
import { sanitizeString } from "./sanitizeString";
import { noOrphans } from "./noOrphans";

jest.mock("./sanitizeString");
jest.mock("./noOrphans");

describe("highlighter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the string without modifications if no brackets are present", () => {
    (sanitizeString as jest.Mock).mockImplementation((str) => str);
    (noOrphans as jest.Mock).mockImplementation((str) => str);

    const input = "This is a test string.";
    const result = highlighter(input);

    expect(sanitizeString).toHaveBeenCalledTimes(5);
    expect(noOrphans).toHaveBeenCalledWith("This is a test string.");
    expect(result).toBe("This is a test string.");
  });

  it("highlights words in double square brackets", () => {
    (sanitizeString as jest.Mock).mockImplementation((str) => str);
    (noOrphans as jest.Mock).mockImplementation((str) => str);

    const input = "This is a [[highlighted]] word.";
    const result = highlighter(input);

    expect(sanitizeString).toHaveBeenCalledWith("This");
    expect(sanitizeString).toHaveBeenCalledWith("is");
    expect(sanitizeString).toHaveBeenCalledWith("a");
    expect(sanitizeString).toHaveBeenCalledWith("highlighted");
    expect(sanitizeString).toHaveBeenCalledWith("word.");
    expect(noOrphans).toHaveBeenCalledWith(
      'This is a <span class="highlight">highlighted</span> word.',
    );
    expect(result).toBe(
      'This is a <span class="highlight">highlighted</span> word.',
    );
  });

  it("sanitizes words inside and outside of brackets", () => {
    (sanitizeString as jest.Mock).mockImplementation(
      (str) => `sanitized-${str}`,
    );
    (noOrphans as jest.Mock).mockImplementation((str) => str);

    const input = "This is a [[highlighted]] word.";
    const result = highlighter(input);

    expect(result).toBe(
      'sanitized-This sanitized-is sanitized-a <span class="highlight">sanitized-highlighted</span> sanitized-word.',
    );
  });

  it("prevents orphan words at the end of the string", () => {
    (sanitizeString as jest.Mock).mockImplementation((str) => str);
    (noOrphans as jest.Mock).mockImplementation((str) =>
      str.replace(/\s(?=[^\s]*$)/, "\u00A0"),
    );

    const input = "This is a [[highlighted]] word.";
    const result = highlighter(input);

    expect(noOrphans).toHaveBeenCalledWith(
      'This is a <span class="highlight">highlighted</span> word.',
    );
  });

  it("handles multiple highlighted words", () => {
    (sanitizeString as jest.Mock).mockImplementation((str) => str);
    (noOrphans as jest.Mock).mockImplementation((str) => str);

    const input = "This is a [[highlighted]] word and another [[highlighted]].";
    const result = highlighter(input);

    expect(result).toBe(
      'This is a <span class="highlight">highlighted</span> word and another <span class="highlight">highlighted</span>',
    );
  });

  it("handles words with special characters", () => {
    (sanitizeString as jest.Mock).mockImplementation((str) => str);
    (noOrphans as jest.Mock).mockImplementation((str) => str);

    const input = "Special [[characters!]] should be sanitized.";
    const result = highlighter(input);

    expect(result).toBe(
      'Special <span class="highlight">characters!</span> should be sanitized.',
    );
  });
});
