import 'express-async-errors';

import express from 'express';
import logger from '../core/logger';
import { attach } from '../core/controller';
import { errorHandler, notFoundHandler } from './error';
import middlewares from './middlewares';
import routes from './routes';

const app = express();

app.disable('x-powered-by');
app.disable('etag');
app.enable('trust proxy');

app.use(middlewares);
logger.info(
  'Registered middlewares: [ %s\n]',
  middlewares.map((m) => `\n\t'${m.name}'`).join(', ')
);

logger.info('Registered routes:');
logger.info('\t--------\t ------');
logger.info('\t|METHOD|\t |PATH|');
logger.info('\t--------\t ------');
try {
  for (const [key, value] of Object.entries(routes)) {
    attach(app, '/api', key, value);
  }
} catch (error: any) {
  logger.error(error.message);
  process.exit(1);
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
