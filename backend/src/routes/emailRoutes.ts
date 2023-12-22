// emailRoutes.ts
import express from "express";
import AWS from "aws-sdk";

const router = express.Router();
const pinpoint = new AWS.Pinpoint();

router.post("/submit-email", async (req, res) => {
  const { email } = req.body;
  const applicationId = process.env.AWS_PINPOINT_PROJECT_ID as string;

  // Create or update the endpoint in Pinpoint
  const endpointParams = {
    ApplicationId: applicationId,
    EndpointBatchRequest: {
      Item: [
        {
          Address: email,
          ChannelType: "EMAIL",
          OptOut: 'NONE',
        },
      ],
    },
  };

  // Define the parameters for sending the email using a template
  const emailParams = {
    ApplicationId: applicationId,
    MessageRequest: {
      Addresses: {
        [email]: {
          ChannelType: 'EMAIL',
        },
      },
      MessageConfiguration: {
        EmailMessage: {
          FromAddress: process.env.AWS_PINPOINT_FROM_ADDRESS,
          TemplateConfiguration: {
            EmailTemplate: {
              Name: 'signup_confirmation', // Your template name
              TemplateData: '{}' // Any dynamic data for the template if needed
            }
          }
        },
      },
    },
  };


  try {
    // Update the endpoint
    await pinpoint.updateEndpointsBatch(endpointParams).promise();
    console.log("Endpoint updated in Pinpoint for:", email); // Log success of endpoint update

    // Send the email
    await pinpoint.sendMessages(emailParams).promise();
    console.log("Email sent via Pinpoint for:", email); // Log success of email sent

    res.json({ success: true, message: "Email submitted and notification sent via Pinpoint" });
  } catch (error) {
    const errorMessage = (error as Error).message || "An unknown error occurred";
    res
        .status(500)
        .json({ success: false, message: "Failed to submit email or send notification", error: errorMessage });
  }
});

export default router;