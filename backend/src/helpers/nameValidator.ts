export const isValidName = (name: string): boolean => {
    // Ensure name is a string and does not contain suspicious characters
    const nameRegex = /^[a-zA-Z\s'-]{1,50}$/; // Allows letters, spaces, hyphens, and apostrophes
    return typeof name === "string" && nameRegex.test(name);
  };