"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContactForm = void 0;
const express_validator_1 = require("express-validator");
exports.validateContactForm = [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    (0, express_validator_1.body)('message')
        .trim()
        .not()
        .isEmpty()
        .withMessage('The message field cannot be empty.'),
    (0, express_validator_1.body)('topic')
        .trim()
        .not()
        .isEmpty()
        .withMessage('The topic field cannot be empty.'),
    (0, express_validator_1.body)('url')
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage('Please provide a valid URL.'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
