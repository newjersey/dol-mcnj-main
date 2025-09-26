"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndSanitizePII = exports.auditPIIOperation = exports.redactPII = exports.createSafeLogger = void 0;
const tslib_1 = require("tslib");
const crypto = tslib_1.__importStar(require("crypto"));
const createSafeLogger = (originalLogger) => {
    return {
        info: (message, metadata) => {
            const safeMetadata = metadata ? (0, exports.redactPII)(metadata) : {};
            originalLogger(`[INFO] ${message}`, safeMetadata);
        },
        error: (message, error, metadata) => {
            var _a;
            const safeError = error instanceof Error ? {
                name: error.name,
                message: (0, exports.redactPII)(error.message),
                stack: (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n')[0]
            } : 'Unknown error';
            const safeMetadata = metadata ? (0, exports.redactPII)(metadata) : {};
            originalLogger(`[ERROR] ${message}`, Object.assign({ error: safeError }, safeMetadata));
        }
    };
};
exports.createSafeLogger = createSafeLogger;
const redactPII = (input) => {
    if (typeof input === 'string') {
        return input
            .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
            .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE_REDACTED]')
            .replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, '[NAME_REDACTED]');
    }
    if (typeof input === 'object' && input !== null) {
        const redacted = {};
        for (const [key, value] of Object.entries(input)) {
            if (['email', 'fname', 'lname', 'firstName', 'lastName', 'phone'].includes(key.toLowerCase())) {
                redacted[key] = '[REDACTED]';
            }
            else {
                redacted[key] = (0, exports.redactPII)(value);
            }
        }
        return redacted;
    }
    return input;
};
exports.redactPII = redactPII;
const auditPIIOperation = (operation, dataType, success, userId, metadata) => {
    const auditEntry = {
        timestamp: new Date().toISOString(),
        operation,
        dataType,
        success,
        userId: userId || 'anonymous',
        metadata: metadata ? (0, exports.redactPII)(metadata) : {},
        sessionId: crypto.randomUUID()
    };
    console.log('[AUDIT]', auditEntry);
};
exports.auditPIIOperation = auditPIIOperation;
const validateAndSanitizePII = (data) => {
    const MAX_NAME_LENGTH = 100;
    const MAX_EMAIL_LENGTH = 254;
    return {
        firstName: data.firstName && typeof data.firstName === 'string' ?
            data.firstName.trim().substring(0, MAX_NAME_LENGTH) : null,
        lastName: data.lastName && typeof data.lastName === 'string' ?
            data.lastName.trim().substring(0, MAX_NAME_LENGTH) : null,
        email: data.email && typeof data.email === 'string' ?
            data.email.trim().toLowerCase().substring(0, MAX_EMAIL_LENGTH) : null
    };
};
exports.validateAndSanitizePII = validateAndSanitizePII;
