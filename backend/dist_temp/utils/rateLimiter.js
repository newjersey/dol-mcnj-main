"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const rateLimiter = (intervalInSeconds, limit) => (0, express_rate_limit_1.rateLimit)({
    windowMs: intervalInSeconds * 1000,
    limit: limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
exports.rateLimiter = rateLimiter;
