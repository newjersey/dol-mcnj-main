import { isValidEmail } from './emailValidator'; 
import dns from 'dns';

jest.mock('dns');

const mockedDns = dns as jest.Mocked<typeof dns>;

describe('isValidEmail Function (Full and Root Domain Validation)', () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should return false for an invalid email format', async () => {
        const result = await isValidEmail('invalid-email');
        expect(result).toBe(false);
    });

    test('should return true for a valid email with MX records on the full domain', async () => {
        mockedDns.resolveMx.mockImplementation((domain, callback) => {
            if (domain === 'gmail.com') {
                callback(null, [{ exchange: 'mail.google.com', priority: 10 }]);
            } else {
                callback(null, []);
            }
        });

        const result = await isValidEmail('test@gmail.com');
        expect(result).toBe(true);
    });

    test('should return true for a valid email where MX records exist on the root domain', async () => {
        mockedDns.resolveMx.mockImplementation((domain, callback) => {
            if (domain === 'subdomain.example.com') {
                callback(null, []);
            } else if (domain === 'example.com') {
                callback(null, [{ exchange: 'mail.example.com', priority: 20 }]);
            }
        });

        const result = await isValidEmail('test@subdomain.example.com');
        expect(result).toBe(true);
    });

    test('should return false when neither the full nor root domain has MX records', async () => {
        mockedDns.resolveMx.mockImplementation((domain, callback) => {
            callback(null, []);
        });

        const result = await isValidEmail('test@nodns.com');
        expect(result).toBe(false);
    });

    test('should return false when an error occurs during full domain lookup and no MX records exist on root', async () => {
        mockedDns.resolveMx.mockImplementation((domain, callback) => {
            if (domain === 'subdomain.fakeexample.com') {
                callback(new Error('Domain not found'), []);
            } else {
                callback(null, []);
            }
        });

        const result = await isValidEmail('test@subdomain.fakeexample.com');
        expect(result).toBe(false);
    });

    test('should return false when an error occurs during both full and root domain lookups', async () => {
        mockedDns.resolveMx.mockImplementation((domain, callback) => {
            callback(new Error('Domain not found'), []);
        });

        const result = await isValidEmail('test@error.com');
        expect(result).toBe(false);
    });
});
