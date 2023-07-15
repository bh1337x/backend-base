import type { Middleware } from '../types/core';
import { createLogger } from '../core/logger';

export const logging: Middleware = (request, response, next) => {
  request.logger = createLogger('request', {
    request: {
      method: request.method,
      path: request.path,
      ip: request.ipAddress,
      id: request.id,
    },
  });

  request.logger.info(
    {
      request: {
        ip: request.ipAddress,
        id: request.id,
        headers: request.headers,
        query: request.query,
        params: request.params,
        body: request.body,
      },
    },
    `${request.method} ${request.path} - Received`
  );

  response.on('close', () => {
    let method: 'info' | 'warn' | 'error' = 'info';

    if (response.statusCode >= 400 && response.statusCode < 500) {
      method = 'warn';
    } else if (response.statusCode >= 500) {
      method = 'error';
    }

    request.logger[method](
      {
        request: {
          ip: request.ipAddress,
          id: request.id,
        },
        response: {
          status: response.statusCode,
          headers: response.getHeaders(),
          body: response.body,
        },
        timeTaken: response.timestamp - request.timestamp,
      },
      `${request.method} ${request.path} - Resolved`
    );
  });

  return next();
};
