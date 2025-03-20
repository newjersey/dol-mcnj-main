import { submitSignupForm } from "./signUpController"; 
import { addSubscriberToMailchimp } from "../mailchimp/mailchimpAPI";
import { Request, Response } from "express";

// Mock Mailchimp function
jest.mock("../mailchimp/mailchimpAPI", () => ({
  addSubscriberToMailchimp: jest.fn(),
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
  });

  test("should return 200 if signup is successful", async () => {
    (addSubscriberToMailchimp as jest.Mock).mockResolvedValueOnce(undefined);

    mockReq.body = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phone: "1234567890",
    };

    await submitSignupForm(mockReq as Request, mockRes as Response);

    expect(addSubscriberToMailchimp).toHaveBeenCalledWith("John", "Doe", "test@example.com", "1234567890");
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Signup successful" });
  });

  test("should return 400 if email is already registered", async () => {
    (addSubscriberToMailchimp as jest.Mock).mockRejectedValueOnce(new Error("is already a list member"));

    mockReq.body = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phone: "1234567890",
    };

    await submitSignupForm(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: `The email "test@example.com" is already registered for My Career NJ updates. If you believe this is an error or need assistance, please contact support.`,
    });
  });

  test("should return 400 for an invalid email", async () => {
    (addSubscriberToMailchimp as jest.Mock).mockRejectedValueOnce(new Error("invalid email"));

    mockReq.body = {
      firstName: "John",
      lastName: "Doe",
      email: "invalid-email",
      phone: "1234567890",
    };

    await submitSignupForm(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: `The email address "invalid-email" is not valid. Please check for typos and try again.`,
    });
  });

  test("should return 400 for an invalid phone number", async () => {
    (addSubscriberToMailchimp as jest.Mock).mockRejectedValueOnce(new Error("phone number invalid"));

    mockReq.body = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phone: "123",
    };

    await submitSignupForm(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: `The phone number "123" is not valid. Please enter a US phone number in the format XXX-XXX-XXXX.`,
    });
  });

  test("should return 400 for an unexpected error", async () => {
    (addSubscriberToMailchimp as jest.Mock).mockRejectedValueOnce(new Error("Some unexpected error"));

    mockReq.body = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phone: "1234567890",
    };

    await submitSignupForm(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "An unexpected error occurred. Please try again later.",
    });
  });
});
