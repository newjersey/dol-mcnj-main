import { submitSignupForm } from "./signUpController";
import { addSubscriberToDynamo } from "../dynamodb/writeSignupEmails";
import { Request, Response } from "express";

// Mock DynamoDB function (updated from Mailchimp)
jest.mock("../dynamodb/writeSignupEmails", () => ({
  addSubscriberToDynamo: jest.fn(),
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
        email: "test@example.com",
        fname: "John",
        lname: "Doe",
        status: "subscribed",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
      };
      
      (addSubscriberToDynamo as jest.Mock).mockResolvedValueOnce(mockSubscriberData);

      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamo).toHaveBeenCalledWith("John", "Doe", "test@example.com");
      expect(addSubscriberToDynamo).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Signup successful" });
    });

    test("should handle missing first name", async () => {
      (addSubscriberToDynamo as jest.Mock).mockResolvedValueOnce({});

      mockReq.body = {
        lastName: "Doe",
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamo).toHaveBeenCalledWith(undefined, "Doe", "test@example.com");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test("should handle missing last name", async () => {
      (addSubscriberToDynamo as jest.Mock).mockResolvedValueOnce({});

      mockReq.body = {
        firstName: "John",
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamo).toHaveBeenCalledWith("John", undefined, "test@example.com");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test("should handle empty string names", async () => {
      (addSubscriberToDynamo as jest.Mock).mockResolvedValueOnce({});

      mockReq.body = {
        firstName: "",
        lastName: "",
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamo).toHaveBeenCalledWith("", "", "test@example.com");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("error handling", () => {
    test("should return 400 if email is already registered", async () => {
      (addSubscriberToDynamo as jest.Mock).mockRejectedValueOnce(
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
        error: `The email "test@example.com" is already registered for My Career NJ updates. If you believe this is an error or need assistance, please contact support.`,
      });
    });

    test("should return 400 for an invalid email", async () => {
      (addSubscriberToDynamo as jest.Mock).mockRejectedValueOnce(new Error("invalid email"));

      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: `The email address "invalid-email" is not valid. Please check for typos and try again.`,
      });
    });

    test("should return 400 for an unexpected error", async () => {
      (addSubscriberToDynamo as jest.Mock).mockRejectedValueOnce(
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
      (addSubscriberToDynamo as jest.Mock).mockRejectedValueOnce(
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
      (addSubscriberToDynamo as jest.Mock).mockRejectedValueOnce(timeoutError);

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
      (addSubscriberToDynamo as jest.Mock).mockRejectedValueOnce("String error");

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
      (addSubscriberToDynamo as jest.Mock).mockRejectedValueOnce(
        new Error("Email IS ALREADY A LIST MEMBER"),
      );

      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "DUPLICATE@EXAMPLE.COM",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith({
        error: `The email "DUPLICATE@EXAMPLE.COM" is already registered for My Career NJ updates. If you believe this is an error or need assistance, please contact support.`,
      });
    });

    test("should handle case-insensitive invalid email error", async () => {
      (addSubscriberToDynamo as jest.Mock).mockRejectedValueOnce(
        new Error("INVALID EMAIL address format"),
      );

      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "not-an-email",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith({
        error: `The email address "not-an-email" is not valid. Please check for typos and try again.`,
      });
    });
  });

  describe("request structure validation", () => {
    test("should handle missing request body", async () => {
      mockReq.body = undefined;

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamo).toHaveBeenCalledWith(undefined, undefined, undefined);
    });

    test("should handle empty request body", async () => {
      mockReq.body = {};

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamo).toHaveBeenCalledWith(undefined, undefined, undefined);
    });

    test("should handle null values in body", async () => {
      mockReq.body = {
        firstName: null,
        lastName: null,
        email: null,
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamo).toHaveBeenCalledWith(null, null, null);
    });
  });

  describe("special characters and edge cases", () => {
    test("should handle special characters in names and emails", async () => {
      (addSubscriberToDynamo as jest.Mock).mockResolvedValueOnce({});

      mockReq.body = {
        firstName: "José-María",
        lastName: "O'Connor-Smith",
        email: "user+tag@sub-domain.example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamo).toHaveBeenCalledWith(
        "José-María",
        "O'Connor-Smith",
        "user+tag@sub-domain.example.com"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test("should handle very long names", async () => {
      (addSubscriberToDynamo as jest.Mock).mockResolvedValueOnce({});
      
      const longName = "a".repeat(255);
      mockReq.body = {
        firstName: longName,
        lastName: longName,
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamo).toHaveBeenCalledWith(longName, longName, "test@example.com");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test("should handle whitespace in names", async () => {
      (addSubscriberToDynamo as jest.Mock).mockResolvedValueOnce({});

      mockReq.body = {
        firstName: "  John  ",
        lastName: "  Doe  ",
        email: "test@example.com",
      };

      await submitSignupForm(mockReq as Request, mockRes as Response);

      expect(addSubscriberToDynamo).toHaveBeenCalledWith("  John  ", "  Doe  ", "test@example.com");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});
