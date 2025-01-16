import { isValidPhone } from './phoneValidation';
import { isValidPhoneNumber } from 'libphonenumber-js';

jest.mock('libphonenumber-js', () => ({
  isValidPhoneNumber: jest.fn(),
}));

describe('isValidPhone', () => {
  it('should return true for a valid phone number', () => {
    // Mock the isValidPhoneNumber function
    (isValidPhoneNumber as jest.Mock).mockReturnValue(true);

    const result = isValidPhone('+1 981 123 1111');
    expect(isValidPhoneNumber).toHaveBeenCalledWith('+1 981 123 1111');
    expect(result).toBe(true);
  });

  it('should return false for an invalid phone number', () => {
    // Mock the isValidPhoneNumber function
    (isValidPhoneNumber as jest.Mock).mockReturnValue(false);

    const result = isValidPhone('12345');
    expect(isValidPhoneNumber).toHaveBeenCalledWith('12345');
    expect(result).toBe(false);
  });

  it('should handle empty phone numbers gracefully', () => {
    // Mock the isValidPhoneNumber function
    (isValidPhoneNumber as jest.Mock).mockReturnValue(false);

    const result = isValidPhone('');
    expect(isValidPhoneNumber).toHaveBeenCalledWith('');
    expect(result).toBe(false);
  });

  it('should handle phone numbers with extra spaces', () => {
    // Mock the isValidPhoneNumber function
    (isValidPhoneNumber as jest.Mock).mockReturnValue(true);

    const result = isValidPhone('  +1 981 123 1111  ');
    expect(isValidPhoneNumber).toHaveBeenCalledWith('  +1 981 123 1111  ');
    expect(result).toBe(true);
  });

  it('should return false for undefined input', () => {
    // Mock the isValidPhoneNumber function
    (isValidPhoneNumber as jest.Mock).mockReturnValue(false);

    const result = isValidPhone(undefined as unknown as string);
    expect(isValidPhoneNumber).toHaveBeenCalledWith(undefined as unknown as string);
    expect(result).toBe(false);
  });
});
