import isValidPhoneNumber from './phoneValidation';
import countryCodes from './countryCodes.json';

type CountryCode = keyof typeof countryCodes;

describe('isValidPhoneNumber', () => {
    const testCases = [
        { phoneNumber: '+14155552671', countryCode: 'US', expected: true },
        { phoneNumber: '+447911123456', countryCode: 'GB', expected: true },
        { phoneNumber: '+919876543210', countryCode: 'IN', expected: true },
        { phoneNumber: '+33123456789', countryCode: 'FR', expected: true },
        { phoneNumber: '+61234567890', countryCode: 'AU', expected: true },
        { phoneNumber: '+1415555267', countryCode: 'US', expected: false }, // Too short
        { phoneNumber: '+44791112345678', countryCode: 'GB', expected: false }, // Too long
        { phoneNumber: '14155552671', countryCode: 'US', expected: false }, // Missing "+"
        { phoneNumber: '+91987654321O', countryCode: 'IN', expected: false } // Contains non-numeric
    ];

    testCases.forEach(({ phoneNumber, countryCode, expected }) => {
        it(`should return ${expected} for phoneNumber="${phoneNumber}" with countryCode="${countryCode}"`, () => {
            const result = isValidPhoneNumber(phoneNumber, countryCode as CountryCode);
            expect(result).toBe(expected);
        });
    });

    it('should detect country codes automatically when no countryCode is provided', () => {
        const autoDetectCases = [
            { phoneNumber: '+14155552671', expected: true },
            { phoneNumber: '+447911123456', expected: true },
            { phoneNumber: '+919876543210', expected: true },
            { phoneNumber: '+33123456789', expected: true },
            { phoneNumber: '+61234567890', expected: true },
            { phoneNumber: '+1415555267', expected: false }, // Too short
            { phoneNumber: '+44791112345678', expected: false } // Too long
        ];

        autoDetectCases.forEach(({ phoneNumber, expected }) => {
            const result = isValidPhoneNumber(phoneNumber);
            expect(result).toBe(expected);
        });
    });
});
