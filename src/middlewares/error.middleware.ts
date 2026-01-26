import type { Request, Response } from 'express';
import { AppError } from '../errors/AppError';

export function errorMiddleware(err: unknown, _req: Request, res: Response) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details ?? null,
    });
  }

  console.error(err);
  return res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'Unexpected error',
  });
}
