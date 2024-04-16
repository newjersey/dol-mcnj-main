import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateContactForm = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('message')
    .trim()
    .not()
    .isEmpty()
    .withMessage('The message field cannot be empty.'),

  body('topic')
    .trim()
    .not()
    .isEmpty()
    .withMessage('The topic field cannot be empty.'),

  body('url')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Please provide a valid URL.'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
