import type { Middleware } from '../types/core';
import { randomUUID } from 'crypto';
import { inProduction } from '../utils/runtime';

export const identifier: Middleware = (request, response, next) => {
  request.ipAddress = request.header('X-Real-IP') || '127.0.0.1';
  request.id = request.cookies.id || randomUUID();

  response.setHeader('X-Request-Id', randomUUID());
  if (!request.cookies.id) {
    response.cookie('id', request.id, {
      httpOnly: true,
      sameSite: 'strict',
      secure: inProduction(),
    });
  }

  return next();
};
