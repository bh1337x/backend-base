import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { notFound } from '../utils/error';
import { ErrorResponse } from '../types/core';
import { inDevelopment } from '../utils/runtime';

export default class HttpError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const notFoundHandler: RequestHandler = (request, response, next) => {
  return next(notFound('The requested resource could not be found'));
};

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  const errorResponse: ErrorResponse = {
    status: 0,
    message: error.message,
    method: request.method,
    path: request.path,
    timestamp: Date.now(),
  };

  if (error instanceof HttpError) {
    errorResponse.status = error.status;
    errorResponse.message = error.message;
  } else if (error instanceof ZodError) {
    errorResponse.status = 400;
    errorResponse.message = error.errors
      .map((error) => `${error.path.join('.')} - ${error.message}`)
      .join(', ');
  } else if (error instanceof SyntaxError) {
    errorResponse.status = 400;
    errorResponse.message = 'Invalid JSON';
  } else {
    errorResponse.status = 500;
    errorResponse.message = 'Internal Server Error';
  }

  const errorObject = {
    error: {
      name: error.name,
      original:
        error.message && error.message.includes('\n')
          ? error.message.replace(/"/g, "'").split('\n')
          : error.message,
      processed: errorResponse.message,
    },
  } as Record<string, any>;

  if (inDevelopment() && error.stack) {
    errorObject.stack = error.stack.replace(/"/g, "'").split('\n');
    errorResponse.stack = errorObject.stack;
  }

  response.hasError = true;
  if (request.initialized) {
    request.logger.error(errorObject, 'Error occurred');
  }

  response.status(errorResponse.status).json(errorResponse);
  return next();
};
