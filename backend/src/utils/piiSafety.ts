// PII-Safe Error Handling and Logging Recommendations
import crypto from "crypto";

// 1. Create a PII-safe logging utility
export const createSafeLogger = (originalLogger: typeof console.log) => {
  return {
    // Safe logging that redacts PII
    info: (message: string, metadata?: Record<string, unknown>) => {
      const safeMetadata = metadata ? redactPII(metadata) : {};
      originalLogger(`[INFO] ${message}`, safeMetadata);
    },
    
    error: (message: string, error?: unknown, metadata?: Record<string, unknown>) => {
      const safeError = error instanceof Error ? {
        name: error.name,
        message: redactPII(error.message),
        stack: error.stack?.split('\n')[0] // Only first line, no file paths
      } : 'Unknown error';
      
      const safeMetadata = metadata ? redactPII(metadata) as Record<string, unknown> : {};
      originalLogger(`[ERROR] ${message}`, { error: safeError, ...safeMetadata });
    }
  };
};

// 2. PII redaction utility
export const redactPII = (input: unknown): unknown => {
  if (typeof input === 'string') {
    return input
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
      .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE_REDACTED]')
      .replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, '[NAME_REDACTED]');
  }
  
  if (typeof input === 'object' && input !== null) {
    const redacted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      if (['email', 'fname', 'lname', 'firstName', 'lastName', 'phone'].includes(key.toLowerCase())) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redactPII(value);
      }
    }
    return redacted;
  }
  
  return input;
};

// 3. Create audit logging for PII operations
export const auditPIIOperation = (
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'VALIDATION',
  dataType: 'EMAIL' | 'NAME' | 'PHONE',
  success: boolean,
  userId?: string,
  metadata?: Record<string, unknown>
) => {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    operation,
    dataType,
    success,
    userId: userId || 'anonymous',
    metadata: metadata ? redactPII(metadata) : {},
    sessionId: crypto.randomUUID() // Generate unique session ID
  };
  
  // Send to dedicated audit log system (not console)
  // In production, send auditEntry to your audit logging service
  console.log('[AUDIT]', auditEntry);
};

// 4. Input validation with length limits
export const validateAndSanitizePII = (data: Record<string, unknown>) => {
  const MAX_NAME_LENGTH = 100;
  const MAX_EMAIL_LENGTH = 254; // RFC 5321 limit
  
  return {
    firstName: data.firstName && typeof data.firstName === 'string' ? 
      data.firstName.trim().substring(0, MAX_NAME_LENGTH) : null,
    lastName: data.lastName && typeof data.lastName === 'string' ? 
      data.lastName.trim().substring(0, MAX_NAME_LENGTH) : null,
    email: data.email && typeof data.email === 'string' ? 
      data.email.trim().toLowerCase().substring(0, MAX_EMAIL_LENGTH) : null
  };
};