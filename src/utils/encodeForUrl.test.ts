// encodeForUrl.test.ts
import { encodeForUrl } from "./encodeForUrl"; // Adjust the path accordingly

describe("encodeForUrl", () => {
  it("should encode spaces as +", () => {
    expect(encodeForUrl("hello world")).toBe("hello+world");
  });

  it("should encode special characters", () => {
    expect(encodeForUrl("hello@world.com")).toBe("hello%40world.com");
  });

  it("should handle a mix of spaces and special characters", () => {
    expect(encodeForUrl("hello world@example.com")).toBe(
      "hello+world%40example.com",
    );
  });

  it("should encode multiple spaces", () => {
    expect(encodeForUrl("hello   world")).toBe("hello+++world");
  });

  it("should encode empty string", () => {
    expect(encodeForUrl("")).toBe("");
  });

  it("should handle a string with no spaces or special characters", () => {
    expect(encodeForUrl("helloworld")).toBe("helloworld");
  });

  it("should encode characters that are already encoded", () => {
    expect(encodeForUrl("hello%20world")).toBe("hello%2520world");
  });

  it("should encode non-alphanumeric characters", () => {
    expect(encodeForUrl("!@#$%^&*()")).toBe("%21%40%23%24%25%5E%26%2A%28%29");
  });
});
