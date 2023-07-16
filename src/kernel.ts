import './types';

import { inDevelopment, inProduction } from './utils/runtime';
import { loadEnvironment, loadConfiguration, logger } from './lib';

process.on('uncaughtException', (error, origin) => {
  logger.fatal(
    error,
    `${origin === 'uncaughtException' ? 'Uncaught Exception' : 'Unhandled Promise Rejection'}!`
  );
  if (inDevelopment()) {
    process.exit(-1);
  }
});

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    logger.info('Shutting the server down');
    process.exit(0);
  });
});

export async function boot() {
  logger.info('Booting the server up');

  if (!inProduction()) {
    await import('dotenv/config');
  }

  await loadEnvironment();
  await loadConfiguration();
}
