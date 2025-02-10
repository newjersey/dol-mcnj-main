import { validateSignupForm } from "./signUpValidations";
import { isValidEmail } from "../helpers/emailValidator";
import { isValidPhoneNumber } from "../helpers/phoneValidator";
import { isValidName } from "../helpers/nameValidator";
import { Request, Response, NextFunction } from "express";

// Mock validation helper functions
jest.mock("../helpers/emailValidator", () => ({
  isValidEmail: jest.fn(),
}));

jest.mock("../helpers/phoneValidator", () => ({
  isValidPhoneNumber: jest.fn(),
}));

jest.mock("../helpers/nameValidator", () => ({
  isValidName: jest.fn(),
}));

describe("validateSignupForm Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("should call next() if all fields are valid", async () => {
    (isValidEmail as jest.Mock).mockResolvedValue(true);
    (isValidName as jest.Mock).mockReturnValue(true);
    (isValidPhoneNumber as jest.Mock).mockReturnValue(true);

    mockReq.body = {
      email: "test@example.com",
      phone: "1234567890",
      fname: "John",
      lname: "Doe",
    };

    await validateSignupForm(mockReq as Request, mockRes as Response, next);

    expect(next).toHaveBeenCalled();
  });

  test("should return 400 if email is missing or invalid", async () => {
    (isValidEmail as jest.Mock).mockResolvedValue(false);

    mockReq.body = { email: "invalid-email" };

    await validateSignupForm(mockReq as Request, mockRes as Response, next);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "This email address seems invalid. Please check for typos or try a different one." });
  });

  test("should return 400 if first name is invalid", async () => {
    (isValidEmail as jest.Mock).mockResolvedValue(true);
    (isValidName as jest.Mock).mockReturnValue(false);

    mockReq.body = {
      email: "test@example.com",
      fname: "J0hn!", // Invalid name
    };

    await validateSignupForm(mockReq as Request, mockRes as Response, next);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid first name" });
  });

  test("should return 400 if last name is invalid", async () => {
    (isValidEmail as jest.Mock).mockResolvedValue(true);
    (isValidName as jest.Mock).mockReturnValue(false);

    mockReq.body = {
      email: "test@example.com",
      lname: "D0e!", // Invalid last name
    };

    await validateSignupForm(mockReq as Request, mockRes as Response, next);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid last name" });
  });

  test("should return 400 if phone number is invalid", async () => {
    (isValidEmail as jest.Mock).mockResolvedValue(true);
    (isValidName as jest.Mock).mockReturnValue(true);
    (isValidPhoneNumber as jest.Mock).mockReturnValue(false);

    mockReq.body = {
      email: "test@example.com",
      phone: "123", // Invalid phone number
    };

    await validateSignupForm(mockReq as Request, mockRes as Response, next);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid phone number format" });
  });

  test("should allow missing optional fields (fname, lname, phone)", async () => {
    (isValidEmail as jest.Mock).mockResolvedValue(true);

    mockReq.body = {
      email: "test@example.com",
    };

    await validateSignupForm(mockReq as Request, mockRes as Response, next);

    expect(next).toHaveBeenCalled();
  });
});
