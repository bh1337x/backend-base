import type { Middlewares } from '../types/core';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { context, identifier, logging } from '../middlewares';
import { forbidden } from '../utils/error';
import {
  corsAllowedHeaders,
  corsAllowedMethods,
  corsAllowedOrigins,
  corsAllowCredentials,
  corsEnabled,
} from '../utils/cors';
import logger from '../core/logger';

const middlewares: Middlewares = [
  express.json({
    limit: process.env.SERVER_REQUEST_BODY_LIMIT,
    verify: (request, response, buffer) => {
      request.rawBody = buffer;
    },
  }),
  express.urlencoded({
    extended: true,
    limit: process.env.SERVER_REQUEST_BODY_LIMIT,
    verify: (request, response, buffer) => {
      request.rawBody = buffer;
    },
  }),
  cookieParser(),
  identifier,
  logging,
  context,
];

if (corsEnabled()) {
  const allowCredentials = corsAllowCredentials();
  const allowedOrigins = corsAllowedOrigins();
  const allowedMethods = corsAllowedMethods();
  const allowedHeaders = corsAllowedHeaders();

  const wildcardOrigins = allowedOrigins.filter((allowedOrigin) => allowedOrigin.includes('://*.'));

  logger.info('CORS is enabled');

  if (allowCredentials) {
    logger.info('CORS allows credentials');
  } else {
    logger.info('CORS does not allow credentials');
  }

  logger.info('CORS allowed origins: [ %s ]', allowedOrigins.map((m) => `'${m}'`).join(', '));
  logger.info('CORS allowed methods: [ %s ]', allowedMethods.map((m) => `'${m}'`).join(', '));
  logger.info('CORS allowed headers: [ %s ]', allowedHeaders.map((m) => `'${m}'`).join(', '));

  middlewares.unshift(
    cors({
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
    })
  );
} else {
  logger.info('CORS is disabled');
}

export default middlewares;
