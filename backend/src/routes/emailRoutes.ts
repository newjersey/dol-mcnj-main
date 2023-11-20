// emailRoutes.ts
import express from 'express';
import AWS from 'aws-sdk';

const router = express.Router();



const pinpoint = new AWS.Pinpoint();

router.post('/submit-email', async (req, res) => {
    const { email } = req.body;

    const params = {
        ApplicationId: process.env.AWS_PINPOINT_PROJECT_ID as string,
        EndpointBatchRequest: {
            Item: [
                {
                    Address: email,
                    ChannelType: 'EMAIL',
                    // Additional attributes can be added here
                },
            ],
        },
    };

    try {
        await pinpoint.updateEndpointsBatch(params).promise();
        res.json({ success: true, message: 'Email submitted to Pinpoint' });
    } catch (error) {
        const errorMessage = (error as Error).message || 'An unknown error occurred';
        res.status(500).json({ success: false, message: 'Failed to submit email', error: errorMessage });    }
});

export default router;
