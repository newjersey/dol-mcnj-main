export function decodeUrlEncodedString(encodedString: string): string {
  try {
    // Use decodeURIComponent to decode the URL-encoded string
    const decodedString = decodeURIComponent(encodedString);
    return decodedString;
  } catch (error) {
    return encodedString; // Return the original string in case of error
  }
}
