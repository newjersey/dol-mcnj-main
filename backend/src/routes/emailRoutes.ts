import express from "express";
import AWS from "aws-sdk";

const router = express.Router();

// Configure AWS Pinpoint client
const pinpointConfig: AWS.Pinpoint.ClientConfiguration = {
  region: process.env.AWS_REGION as string // Ensure AWS_REGION is set
};

// Conditionally set the endpoint
if (process.env.AWS_PINPOINT_ENDPOINT) {
  pinpointConfig.endpoint = process.env.AWS_PINPOINT_ENDPOINT;
}

const pinpoint = new AWS.Pinpoint(pinpointConfig);

router.post("/submit-email", async (req, res) => {
  const { email, description } = req.body;
  const includeDescription = process.env.SHOW_PINPOINT_SEGMENTS === 'true';

  const params = {
    ApplicationId: process.env.AWS_PINPOINT_PROJECT_ID as string,
    EndpointBatchRequest: {
      Item: [
        {
          Address: email,
          ChannelType: "EMAIL",
          Attributes: {
            // Assuming "Description" is a custom attribute you've defined in Pinpoint
            ...(includeDescription && { Description: [description] }), // Conditionally add Description attribute
          },
        },
      ],
    },
  };

  try {
    await pinpoint.updateEndpointsBatch(params).promise();
    res.json({ success: true, message: "Email and description submitted to Pinpoint with description" });
  } catch (error) {
    const errorMessage = (error as Error).message || "An unknown error occurred";
    res
        .status(500)
        .json({ success: false, message: "Failed to submit email with description", error: errorMessage });
  }
});
export default router;