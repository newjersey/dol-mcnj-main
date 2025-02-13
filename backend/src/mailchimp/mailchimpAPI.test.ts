// Mock environment variables before importing the module
process.env.MAILCHIMP_API_KEY = 'dummy-us11';
process.env.MAILCHIMP_LIST_ID = 'test123';

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

import axios from 'axios';
import { addSubscriberToMailchimp } from './mailchimpAPI';

// Mock axios module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('addSubscriberToMailchimp', () => {
  const MOCK_URL = 'https://us11.api.mailchimp.com/3.0/lists/test123/members';
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should successfully add a subscriber', async () => {
    const mockResponse = {
      data: {
        id: '123',
        email_address: 'test@example.com',
        status: 'subscribed',
        merge_fields: {
          FNAME: 'John',
          LNAME: 'Doe',
          PHONE: '1234567890'
        }
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const result = await addSubscriberToMailchimp(
      'John',
      'Doe',
      'test@example.com',
      '1234567890'
    );

    expect(result).toEqual(mockResponse.data);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      MOCK_URL,
      {
        email_address: 'test@example.com',
        status: 'subscribed',
        merge_fields: {
          FNAME: 'John',
          LNAME: 'Doe',
          PHONE: '1234567890'
        }
      },
      {
        auth: {
          username: '',
          password: 'dummy-us11'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  });

  it('should throw error when email is missing', async () => {
    await expect(addSubscriberToMailchimp('John', 'Doe', '', '1234567890'))
      .rejects
      .toThrow('Email address is required.');
  });

  it('should handle Mailchimp API error', async () => {
    
    const errorMessage = 'Invalid email address';
    const axiosError = new Error(errorMessage) as Error & {
      response: {
        data: {
          detail: string;
        };
      };
    };
    axiosError.response = {
      data: {
        detail: errorMessage
      }
    };
    
    mockedAxios.post.mockRejectedValueOnce(axiosError);

    await expect(addSubscriberToMailchimp(
      'John',
      'Doe',
      'invalid-email',
      '1234567890'
    )).rejects.toThrow(errorMessage);
  });

  it('should handle network error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

    await expect(addSubscriberToMailchimp(
      'John',
      'Doe',
      'test@example.com',
      '1234567890'
    )).rejects.toThrow('Failed to connect to Mailchimp.');
  });
});