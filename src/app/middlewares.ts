import type { Middlewares } from '../types/core';
import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import { context, identifier, logging, cors } from '../middlewares';
import { logger, getConfiguration } from '../lib';

const corsEnabled = process.env.CORS_ENABLED === 'true';
const bodyLimit = getConfiguration('body', 'limit');

const middlewares: Middlewares = [
  methodOverride('X-HTTP-Method-Override', {
    methods: ['POST'],
  }),
  express.json({
    limit: bodyLimit,
    verify: (request, response, buffer) => (request.rawBody = buffer),
    strict: true,
  }),
  express.urlencoded({
    extended: true,
    limit: bodyLimit,
    verify: (request, response, buffer) => (request.rawBody = buffer),
  }),
  cookieParser(),
  identifier,
  logging,
  context,
];

if (corsEnabled) {
  logger.info('CORS has been enabled');
  middlewares.unshift(cors());
} else {
  logger.info('CORS has been disabled');
}

export default middlewares;
