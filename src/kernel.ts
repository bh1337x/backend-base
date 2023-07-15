import 'dotenv/config';
import './types';
import './core/env';

import { inDevelopment } from './utils/runtime';
import logger from './core/logger';

process.on('uncaughtException', (err) => {
  logger.fatal('This should have never happened');
  logger.fatal(err);
  if (inDevelopment()) {
    process.exit(-1);
  }
});
