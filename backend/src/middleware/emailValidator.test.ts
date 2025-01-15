import { isValidEmail } from './emailValidator'; 
import dns from 'dns';

jest.mock('dns');

const mockedDns = dns as jest.Mocked<typeof dns>;

describe('isValidEmail Function', () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should return false for an invalid email format', async () => {
        const result = await isValidEmail('invalid-email');
        expect(result).toBe(false);
    });

    test('should return true for a valid email with MX records (full domain)', async () => {
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

    test('should return true for a valid email with MX records (root domain fallback)', async () => {
        mockedDns.resolveMx.mockImplementation((domain, callback) => {
            if (domain === 'subdomain.example.com') {
                callback(null, []);
            } else if (domain === 'example.com') {
                callback(null, [{ exchange: 'mail.example.com', priority: 20 }]);
            } else {
                callback(null, []);
            }
        });

        const result = await isValidEmail('test@subdomain.example.com');
        expect(result).toBe(true);
    });

    test('should return false for a valid email but no MX records in either domain', async () => {
        mockedDns.resolveMx.mockImplementation((domain, callback) => {
            callback(null, []);
        });

        const result = await isValidEmail('test@nodns.com');
        expect(result).toBe(false);
    });

    test('should return false for a domain with an error during MX lookup (full domain)', async () => {
        mockedDns.resolveMx.mockImplementation((domain, callback) => {
            if (domain === 'fakeexample.com') {
                callback(new Error('Domain not found'), []);
            } else {
                callback(null, []);
            }
        });

        const result = await isValidEmail('test@fakeexample.com');
        expect(result).toBe(false);
    });

    test('should return false for a domain with an error during MX lookup (root domain fallback)', async () => {
        mockedDns.resolveMx.mockImplementation((domain, callback) => {
            if (domain === 'subdomain.fakeexample.com') {
                callback(new Error('Domain not found'), []);
            } else if (domain === 'fakeexample.com') {
                callback(new Error('Domain not found'), []);
            } else {
                callback(null, []);
            }
        });

        const result = await isValidEmail('test@subdomain.fakeexample.com');
        expect(result).toBe(false);
    });
});
