export const isValidPhoneNumber = (phoneNumber: string): boolean => {
    if (!phoneNumber || typeof phoneNumber !== "string") {
        console.error("Invalid input: phone number must be a string.");
        return false;
    }

    // Remove non-numeric characters
    const cleanedNumber = phoneNumber.replace(/\D/g, "");

    // Ensure it's exactly 10 digits long
    if (cleanedNumber.length !== 10) {
        console.error("Invalid phone number: must be exactly 10 digits.");
        return false;
    }

    return true;
};