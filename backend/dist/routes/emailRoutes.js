"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
const router = express_1.default.Router();
const pinpointConfig = {
    region: process.env.AWS_REGION
};
if (process.env.AWS_PINPOINT_ENDPOINT) {
    pinpointConfig.endpoint = process.env.AWS_PINPOINT_ENDPOINT;
}
const pinpoint = new aws_sdk_1.default.Pinpoint(pinpointConfig);
router.post("/submit-email", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { email, description } = req.body;
    const includeDescription = process.env.SHOW_PINPOINT_SEGMENTS === 'true';
    const params = {
        ApplicationId: process.env.AWS_PINPOINT_PROJECT_ID,
        EndpointBatchRequest: {
            Item: [
                {
                    Address: email,
                    ChannelType: "EMAIL",
                    Attributes: Object.assign({}, (includeDescription && { Description: [description] })),
                },
            ],
        },
    };
    try {
        yield pinpoint.updateEndpointsBatch(params).promise();
        res.json({ success: true, message: "Email and description submitted to Pinpoint with description" });
    }
    catch (error) {
        const errorMessage = error.message || "An unknown error occurred";
        res
            .status(500)
            .json({ success: false, message: "Failed to submit email with description", error: errorMessage });
    }
}));
exports.default = router;
