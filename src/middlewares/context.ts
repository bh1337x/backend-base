import type { Middleware } from '../types/core';
import storage from '../core/storage';

export const context: Middleware = (request, response, next) => {
  request.initialized = true;
  storage.enterWith({
    logger: request.logger,
  });

  return next();
};
