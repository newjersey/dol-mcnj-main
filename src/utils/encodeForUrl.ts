export function encodeForUrl(input: string): string {
  return encodeURIComponent(input)
    .replace(/%20/g, "+")
    .replace(
      /[!*'()]/g,
      (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
    );
}
