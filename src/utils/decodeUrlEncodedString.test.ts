import { decodeUrlEncodedString } from "./decodeUrlEncodedString";

describe("decodeUrlEncodedString", () => {
  it("decodes a simple URL-encoded string", () => {
    const encodedString = "Hello%20World";
    const result = decodeUrlEncodedString(encodedString);
    expect(result).toBe("Hello World");
  });

  it("decodes a URL-encoded string with special characters", () => {
    const encodedString = "%C3%A9%20%26%20%C3%B1";
    const result = decodeUrlEncodedString(encodedString);
    expect(result).toBe("é & ñ");
  });

  it("returns the original string if decoding fails", () => {
    const invalidEncodedString = "%E0%A4%A"; // Invalid percent-encoding
    const result = decodeUrlEncodedString(invalidEncodedString);
    expect(result).toBe(invalidEncodedString);
  });

  it("decodes a complex URL-encoded string", () => {
    const encodedString =
      "%F0%9F%98%81%20Hello%2C%20%F0%9F%91%8B%20%F0%9F%92%95%20%26%20%C3%BC%C3%B6%C3%A4";
    const result = decodeUrlEncodedString(encodedString);
    expect(result).toBe("😁 Hello, 👋 💕 & üöä");
  });

  it("returns an empty string if input is empty", () => {
    const encodedString = "";
    const result = decodeUrlEncodedString(encodedString);
    expect(result).toBe("");
  });

  it("decodes a URL-encoded string with spaces and punctuation", () => {
    const encodedString = "Hello%2C%20world%21%20How%20are%20you%3F";
    const result = decodeUrlEncodedString(encodedString);
    expect(result).toBe("Hello, world! How are you?");
  });
});
