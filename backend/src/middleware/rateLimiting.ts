import { Request, Response, NextFunction } from "express";
import { createSafeLogger } from "../utils/piiSafety";

const logger = createSafeLogger(console.log);

// Simple in-memory rate limiting (for production, use Redis or similar)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // 5 signup attempts per 15 minutes

/**
 * Rate limiting middleware for signup endpoints
 * - Prevents abuse and brute force attacks
 * - Uses IP-based limiting with safe logging
 * - Includes automatic cleanup of expired entries
 */
export const signupRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to run cleanup
    for (const [ip, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }
  
  const entry = rateLimitMap.get(clientIp);
  
  if (!entry || now > entry.resetTime) {
    // First request or expired window - reset counter
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
    // Rate limit exceeded
    const remainingTime = Math.ceil((entry.resetTime - now) / 1000 / 60); // minutes
    
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
  
  // Increment counter
  entry.count += 1;
  rateLimitMap.set(clientIp, entry);
  
  logger.info("Rate limit: request counted", { 
    hasClientIp: !!clientIp,
    count: entry.count,
    limit: MAX_REQUESTS_PER_WINDOW 
  });
  
  next();
};

/**
 * Get current rate limit status for monitoring
 */
export const getRateLimitStatus = () => {
  const now = Date.now();
  const activeEntries = Array.from(rateLimitMap.entries())
    .filter(([, entry]) => now <= entry.resetTime)
    .map(([ip, entry]) => ({
      ip: ip.substring(0, 8) + '***', // Partially redact IP for privacy
      count: entry.count,
      resetInMinutes: Math.ceil((entry.resetTime - now) / 1000 / 60)
    }));
    
  return {
    totalActiveIPs: activeEntries.length,
    windowMinutes: RATE_LIMIT_WINDOW_MS / 1000 / 60,
    maxRequestsPerWindow: MAX_REQUESTS_PER_WINDOW
  };
};