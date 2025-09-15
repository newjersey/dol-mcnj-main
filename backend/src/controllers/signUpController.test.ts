import { submitSignupForm } from "./signUpController";
import { addSubscriberToDynamoEncrypted } from "../dynamodb/writeSignupEmailsEncrypted";
import { Request, Response } from "express";

// Mock DynamoDB function
jest.mock("../dynamodb/writeSignupEmailsEncrypted", () => ({
  addSubscriberToDynamoEncrypted: jest.fn(),
}));

// Mock PII safety utilities
jest.mock("../utils/piiSafety", () => ({
  createSafeLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
  })),
  auditPIIOperation: jest.fn(),
  validateAndSanitizePII: jest.fn((data) => ({
    firstName: data.firstName || null,
    lastName: data.lastName || null,
    email: data.email || null,
  })),
}));

describe("submitSignupForm Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
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
      
      (addSubscriberToDynamoEncrypted as jest.Mock).mockResolvedValueOnce(mockSubscriberData);

      mockReq.body = {
        firstName: "TestFirst",
        lastName: "TestLast",
        email: "user@domain.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamoEncrypted).toHaveBeenCalledWith("TestFirst", "TestLast", "user@domain.com");
      expect(addSubscriberToDynamoEncrypted).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Signup successful",
      });
    });

    test("should handle missing first name", async () => {
      (addSubscriberToDynamoEncrypted as jest.Mock).mockResolvedValueOnce({});

      mockReq.body = {
        lastName: "Doe",
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamoEncrypted).toHaveBeenCalledWith("", "Doe", "test@example.com");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test("should handle missing last name", async () => {
      (addSubscriberToDynamoEncrypted as jest.Mock).mockResolvedValueOnce({});

      mockReq.body = {
        firstName: "John",
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamoEncrypted).toHaveBeenCalledWith("John", "", "test@example.com");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test("should handle empty string names", async () => {
      (addSubscriberToDynamoEncrypted as jest.Mock).mockResolvedValueOnce({});

      mockReq.body = {
        firstName: "",
        lastName: "",
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamoEncrypted).toHaveBeenCalledWith("", "", "test@example.com");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("error handling", () => {
    test("should return 400 if email is already registered", async () => {
      (addSubscriberToDynamoEncrypted as jest.Mock).mockRejectedValueOnce(
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
      (addSubscriberToDynamoEncrypted as jest.Mock).mockRejectedValueOnce(new Error("invalid email"));

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
      (addSubscriberToDynamoEncrypted as jest.Mock).mockRejectedValueOnce(
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

    test("should handle DynamoDB service errors gracefully", async () => {
      (addSubscriberToDynamoEncrypted as jest.Mock).mockRejectedValueOnce(
        new Error("DynamoDB service unavailable"),
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

    test("should handle network timeout errors", async () => {
      const timeoutError = new Error("Request timeout");
      timeoutError.name = "TimeoutError";
      (addSubscriberToDynamoEncrypted as jest.Mock).mockRejectedValueOnce(timeoutError);

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

    test("should handle non-Error exceptions", async () => {
      (addSubscriberToDynamoEncrypted as jest.Mock).mockRejectedValueOnce("String error");

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

  describe("error message specificity", () => {
    test("should handle case-insensitive duplicate email error", async () => {
      (addSubscriberToDynamoEncrypted as jest.Mock).mockRejectedValueOnce(
        new Error("Email IS ALREADY A LIST MEMBER"),
      );

      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "DUPLICATE@EXAMPLE.COM",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith({
        error: "This email address is already registered for My Career NJ updates. If you believe this is an error or need assistance, please contact support.",
      });
    });

    test("should handle case-insensitive invalid email error", async () => {
      (addSubscriberToDynamoEncrypted as jest.Mock).mockRejectedValueOnce(
        new Error("INVALID EMAIL address format"),
      );

      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "not-an-email",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith({
        error: "The email address provided is not valid. Please check for typos and try again.",
      });
    });
  });

  describe("request structure validation", () => {
    test("should handle missing request body", async () => {
      mockReq.body = undefined;

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamoEncrypted).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Email address is required.",
      });
    });

    test("should handle empty request body", async () => {
      mockReq.body = {};

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamoEncrypted).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Email address is required.",
      });
    });

    test("should handle null values in body", async () => {
      mockReq.body = {
        firstName: null,
        lastName: null,
        email: null,
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamoEncrypted).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Email address is required.",
      });
    });
  });

  describe("special characters and edge cases", () => {
    test("should handle special characters in names and emails", async () => {
      (addSubscriberToDynamoEncrypted as jest.Mock).mockResolvedValueOnce({});

      mockReq.body = {
        firstName: "José-María",
        lastName: "O'Connor-Smith",
        email: "user+tag@sub-domain.example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamoEncrypted).toHaveBeenCalledWith(
        "José-María",
        "O'Connor-Smith",
        "user+tag@sub-domain.example.com"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test("should handle very long names", async () => {
      (addSubscriberToDynamoEncrypted as jest.Mock).mockResolvedValueOnce({});
      
      const longName = "a".repeat(255);
      mockReq.body = {
        firstName: longName,
        lastName: longName,
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamoEncrypted).toHaveBeenCalledWith(longName, longName, "test@example.com");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test("should handle whitespace in names", async () => {
      (addSubscriberToDynamoEncrypted as jest.Mock).mockResolvedValueOnce({});

      mockReq.body = {
        firstName: "  John  ",
        lastName: "  Doe  ",
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamoEncrypted).toHaveBeenCalledWith("  John  ", "  Doe  ", "test@example.com");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});
