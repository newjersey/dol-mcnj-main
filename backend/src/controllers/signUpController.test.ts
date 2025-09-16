import { submitSignupForm } from "./signUpController";
import { addSubscriberToDynamoEncrypted } from "../dynamodb/writeSignupEmailsEncrypted";
import { validateAndSanitizePII } from "../utils/piiSafety";
import { Request, Response } from "express";

// Mock DynamoDB function using proper Jest mock
jest.mock("../dynamodb/writeSignupEmailsEncrypted", () => ({
  addSubscriberToDynamoEncrypted: jest.fn(),
}));

const mockAddSubscriberToDynamoEncrypted = addSubscriberToDynamoEncrypted as jest.MockedFunction<typeof addSubscriberToDynamoEncrypted>;

// Mock PII safety utilities
jest.mock("../utils/piiSafety", () => ({
  createSafeLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
  })),
  auditPIIOperation: jest.fn(),
  validateAndSanitizePII: jest.fn(),
}));

const mockValidateAndSanitizePII = validateAndSanitizePII as jest.MockedFunction<typeof validateAndSanitizePII>;

describe("submitSignupForm Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Reset all mocks
    jest.clearAllMocks();
    
    // Set up the default implementation for validateAndSanitizePII
    mockValidateAndSanitizePII.mockImplementation((data: Record<string, unknown>) => {
      const MAX_NAME_LENGTH = 100;
      const MAX_EMAIL_LENGTH = 254;
      
      return {
        firstName: data.firstName && typeof data.firstName === 'string' ? 
          data.firstName.trim().substring(0, MAX_NAME_LENGTH) : null,
        lastName: data.lastName && typeof data.lastName === 'string' ? 
          data.lastName.trim().substring(0, MAX_NAME_LENGTH) : null,
        email: data.email && typeof data.email === 'string' ? 
          data.email.trim().toLowerCase().substring(0, MAX_EMAIL_LENGTH) : null
      };
    });
  });

  describe("successful submissions", () => {
    test("should return 200 if signup is successful", async () => {
      const mockSubscriberData = {
        email: "user@domain.com",
        fname: "TestFirst",
        lname: "TestLast",
        status: "subscribed",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
      };
      
      mockAddSubscriberToDynamoEncrypted.mockResolvedValueOnce(mockSubscriberData);

      mockReq.body = {
        firstName: "TestFirst",
        lastName: "TestLast",
        email: "user@domain.com",
      };

      const originalConsoleError = console.error;
      const consoleErrorSpy = jest.fn();
      console.error = consoleErrorSpy;

      await submitSignupForm(mockReq as Request, mockRes as Response);
      
      console.error = originalConsoleError;

      expect(mockAddSubscriberToDynamoEncrypted).toHaveBeenCalledWith("TestFirst", "TestLast", "user@domain.com");
      expect(mockAddSubscriberToDynamoEncrypted).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Signup successful",
      });
    });

    test("should handle missing first name", async () => {
      mockAddSubscriberToDynamoEncrypted.mockResolvedValueOnce({});

      mockReq.body = {
        lastName: "Doe",
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(mockAddSubscriberToDynamoEncrypted).toHaveBeenCalledWith("", "Doe", "test@example.com");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test("should handle missing last name", async () => {
      mockAddSubscriberToDynamoEncrypted.mockResolvedValueOnce({});

      mockReq.body = {
        firstName: "John",
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(mockAddSubscriberToDynamoEncrypted).toHaveBeenCalledWith("John", "", "test@example.com");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("error handling", () => {
    test("should return 400 if email is already registered", async () => {
      mockAddSubscriberToDynamoEncrypted.mockRejectedValueOnce(
        new Error("is already a list member"),
      );

      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "This email address is already registered for My Career NJ updates. If you believe this is an error or need assistance, please contact support.",
      });
    });

    test("should return 400 for an invalid email", async () => {
      mockAddSubscriberToDynamoEncrypted.mockRejectedValueOnce(new Error("invalid email"));

      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "The email address provided is not valid. Please check for typos and try again.",
      });
    });

    test("should return 400 for an unexpected error", async () => {
      mockAddSubscriberToDynamoEncrypted.mockRejectedValueOnce(
        new Error("Some unexpected error"),
      );

      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "An unexpected error occurred. Please try again later.",
      });
    });
  });

  describe("request structure validation", () => {
    test("should handle missing request body", async () => {
      mockReq.body = undefined;

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(mockAddSubscriberToDynamoEncrypted).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Email address is required.",
      });
    });

    test("should handle empty request body", async () => {
      mockReq.body = {};

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(mockAddSubscriberToDynamoEncrypted).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Email address is required.",
      });
    });
  });

  describe("special characters and edge cases", () => {
    test("should handle special characters in names and emails", async () => {
      mockAddSubscriberToDynamoEncrypted.mockResolvedValueOnce({});

      mockReq.body = {
        firstName: "José-María",
        lastName: "O'Connor-Smith",
        email: "user+tag@sub-domain.example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(mockAddSubscriberToDynamoEncrypted).toHaveBeenCalledWith(
        "José-María",
        "O'Connor-Smith",
        "user+tag@sub-domain.example.com"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});
