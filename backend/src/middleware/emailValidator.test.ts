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

    test('should return true for a valid email with MX records', async () => {
        mockedDns.resolveMx.mockImplementation((domain, callback) => {
            callback(null, [{ exchange: 'mail.google.com', priority: 10 }]);
        });
        
        const result = await isValidEmail('test@gmail.com');
        expect(result).toBe(true);
    });

    test('should return false for a valid email but no MX records', async () => {
        mockedDns.resolveMx.mockImplementation((domain, callback) => {
            callback(null, []);
        });
        
        const result = await isValidEmail('test@nodns.com');
        expect(result).toBe(false);
    });

    test('should return false for a domain with an error during MX lookup', async () => {
        mockedDns.resolveMx.mockImplementation((domain, callback) => {
            callback(new Error('Domain not found'), []);
        });
        
        const result = await isValidEmail('test@fakeexample.com');
        expect(result).toBe(false);
    });
});
