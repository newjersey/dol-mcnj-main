"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRateLimitStatus = exports.signupRateLimit = void 0;
const piiSafety_1 = require("../utils/piiSafety");
const logger = (0, piiSafety_1.createSafeLogger)(console.log);
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const signupRateLimit = (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    if (Math.random() < 0.01) {
        for (const [ip, entry] of rateLimitMap.entries()) {
            if (now > entry.resetTime) {
                rateLimitMap.delete(ip);
            }
        }
    }
    const entry = rateLimitMap.get(clientIp);
    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(clientIp, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW_MS
        });
        logger.info("Rate limit: new window started", {
            hasClientIp: !!clientIp,
            count: 1,
            resetIn: RATE_LIMIT_WINDOW_MS
        });
        return next();
    }
    if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
        const remainingTime = Math.ceil((entry.resetTime - now) / 1000 / 60);
        logger.info("Rate limit exceeded", {
            hasClientIp: !!clientIp,
            count: entry.count,
            limit: MAX_REQUESTS_PER_WINDOW,
            resetInMinutes: remainingTime
        });
        return res.status(429).json({
            error: "Too many signup attempts. Please try again later.",
            retryAfterMinutes: remainingTime
        });
    }
    entry.count += 1;
    rateLimitMap.set(clientIp, entry);
    logger.info("Rate limit: request counted", {
        hasClientIp: !!clientIp,
        count: entry.count,
        limit: MAX_REQUESTS_PER_WINDOW
    });
    next();
};
exports.signupRateLimit = signupRateLimit;
const getRateLimitStatus = () => {
    const now = Date.now();
    const activeEntries = Array.from(rateLimitMap.entries())
        .filter(([, entry]) => now <= entry.resetTime)
        .map(([ip, entry]) => ({
        ip: ip.substring(0, 8) + '***',
        count: entry.count,
        resetInMinutes: Math.ceil((entry.resetTime - now) / 1000 / 60)
    }));
    return {
        totalActiveIPs: activeEntries.length,
        windowMinutes: RATE_LIMIT_WINDOW_MS / 1000 / 60,
        maxRequestsPerWindow: MAX_REQUESTS_PER_WINDOW
    };
};
exports.getRateLimitStatus = getRateLimitStatus;
