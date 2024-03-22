import { rateLimit } from 'express-rate-limit' 


export const rateLimiter = (intervalInSeconds: number, limit: number) => rateLimit({
	windowMs: intervalInSeconds * 1000, // in seconds
	limit: limit,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
})