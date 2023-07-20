import type { Middleware } from '../types/core';
import corsMiddleware from 'cors';
import { Configuration, logger } from '../lib';
import { forbidden } from '../utils/error';

export function cors(): Middleware {
  const allowCredentials = Configuration.get('cors', 'credentials');
  const allowedOrigins = Configuration.get('cors', 'origins');
  const allowedMethods = Configuration.get('cors', 'methods');
  const allowedHeaders = Configuration.get('cors', 'headers');

  const wildcardOrigins = allowedOrigins.filter((allowedOrigin) => allowedOrigin.includes('://*.'));

  if (allowCredentials) {
    logger.info('CORS allows credentials');
  } else {
    logger.info('CORS does not allow credentials');
  }

  logger.info('CORS allowed origins: [ %s ]', allowedOrigins.map((m) => `'${m}'`).join(', '));
  logger.info('CORS allowed methods: [ %s ]', allowedMethods.map((m) => `'${m}'`).join(', '));
  logger.info('CORS allowed headers: [ %s ]', allowedHeaders.map((m) => `'${m}'`).join(', '));

  return corsMiddleware({
    origin: (origin, callback) => {
      if (allowedOrigins.includes('*')) {
        return callback(null, true);
      }

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (wildcardOrigins) {
        for (const wildcardOrigin of wildcardOrigins) {
          const regex = new RegExp(wildcardOrigin.replace(/\*/g, '.*'));
          if (origin.match(regex)) {
            return callback(null, true);
          }
        }
      }

      return callback(forbidden('Not allowed by CORS'));
    },
    allowedHeaders,
    credentials: allowCredentials,
    methods: allowedMethods,
  });
}
