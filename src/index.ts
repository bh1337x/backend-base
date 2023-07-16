import { createServer } from 'http';
import { boot } from './kernel';
import { logger } from './lib';

async function main() {
  const { default: app } = await import('./app');
  const server = createServer(app);

  server.on('request', (request, response) => {
    request.timestamp = Date.now();
    response.hasError = false;

    response.on('finish', () => {
      response.timestamp = Date.now();
    });
  });

  server.on('error', (error) => {
    logger.error(error);
  });

  server.listen(process.env.PORT, () => {
    logger.info(`Server has been listening at http://localhost:${process.env.PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
  });
}

if (require.main === module) {
  boot()
    .then(() => {
      return main();
    })
    .catch((error) => {
      logger.fatal('Could not start server');
      logger.fatal(error);
      process.exit(-1);
    });
}
