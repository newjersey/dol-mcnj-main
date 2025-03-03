import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.MAILCHIMP_API_KEY || "";
const LIST_ID = process.env.MAILCHIMP_LIST_ID || "";
const DATACENTER = API_KEY.includes("-") ? API_KEY.split("-")[1] : "";

// Validate API configuration at startup
if (!API_KEY) {
  throw new Error("MAILCHIMP_API_KEY is missing in environment variables.");
}

if (!LIST_ID) {
  throw new Error("MAILCHIMP_LIST_ID is missing in environment variables.");
}

if (!DATACENTER) {
  throw new Error("MAILCHIMP_API_KEY format is incorrect. Expected format: 'key-usX' (e.g., '123456-us21').");
}

const MAILCHIMP_URL = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

export const addSubscriberToMailchimp = async (fname: string, lname: string, email: string, phone: string) => {
  if (!email) {
    throw new Error("Email address is required.");
  }

  try {
    const response = await axios.post(
      MAILCHIMP_URL,
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
          PHONE: phone,
        },
      },
      {
        auth: {
          username: "", //required but anystring works here!
          password: API_KEY,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Success response
  } catch (error: unknown) {
    if (error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      throw new Error((error.response as { data?: { detail?: string } }).data?.detail || "Mailchimp API error");
    } else {
      throw new Error("Failed to connect to Mailchimp.");
    }
  }
}
