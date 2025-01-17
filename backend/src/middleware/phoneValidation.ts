import countryCodes from './countryCodes.json';

type CountryData = {
  code: string;
  minLength: number;
  maxLength: number;
};

type CountryCode = keyof typeof countryCodes;

const isValidPhoneNumber = (phoneNumber: string, countryCode?: CountryCode): boolean => {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        console.error('Invalid input: phoneNumber must be a non-empty string.');
        return false;
    }

    // Remove non-numeric characters except "+" for normalization
    const cleanedNumber = phoneNumber.replace(/[^\d+]/g, '');

    if (!cleanedNumber.startsWith('+')) {
        console.error('Invalid phone number: must start with "+".');
        return false;
    }

    let countryData: CountryData | undefined;

    if (countryCode) {
        // Validate provided country code
        countryData = countryCodes[countryCode];
        console.log(countryData)
        if (!countryData) {
            console.error(`Invalid country code: ${countryCode} is not supported.`);
            return false;
        }
    } else {
        // Detect country code from phone number
        const detectedCountryCode = (Object.keys(countryCodes) as CountryCode[])
            .sort((a, b) => countryCodes[b].code.length - countryCodes[a].code.length) // Sort by length of code (longest first)
            .find(code => cleanedNumber.startsWith(countryCodes[code].code));

        if (!detectedCountryCode) {
            console.error(`No matching country code found for phone number: ${phoneNumber}`);
            return false;
        }

        countryData = countryCodes[detectedCountryCode];
    }

    if (!countryData) {
        console.error(`Failed to detect country data for phone number: ${phoneNumber}`);
        return false;
    }

    const { code: dialCode, minLength, maxLength } = countryData;

    // Remove the detected country code for local number validation
    const localNumber = cleanedNumber.slice(dialCode.length);

    // Validate length and ensure it contains only digits
    const isLengthValid = localNumber.length >= minLength && localNumber.length <= maxLength;
    const isNumeric = /^\d+$/.test(localNumber);

    if (!isLengthValid) {
        console.error(
            `Invalid phone number length: expected between ${minLength} and ${maxLength} digits, got ${localNumber.length}.`
        );
        return false;
    }

    if (!isNumeric) {
        console.error('Invalid phone number: contains non-numeric characters.');
        return false;
    }

    return true;
};

export default isValidPhoneNumber;
