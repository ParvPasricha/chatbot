import { NextFunction, Request, Response } from 'express';
import { logger } from './logger';

export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: Record<string, unknown>) {
    super(message);
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err.message || 'Internal server error';
  if (status >= 500) {
    logger.error({ err }, 'Unhandled error');
  } else {
    logger.warn({ err }, 'Handled error');
  }

  res.status(status).json({ success: false, message, details: err instanceof HttpError ? err.details : undefined });
};
