import 'dotenv/config';
import './types';
import './core/env';

import { inDevelopment } from './utils/runtime';
import logger from './core/logger';

process.on('uncaughtException', (error, origin) => {
  logger.fatal(
    error,
    `${origin === 'uncaughtException' ? 'Uncaught Exception' : 'Unhandled Promise Rejection'}!`
  );
  if (inDevelopment()) {
    process.exit(-1);
  }
});
