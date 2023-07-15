import './kernel';
import { createServer } from 'http';
import app from './app';
import logger from './core/logger';

const server = createServer(app);

server.on('request', (request, response) => {
  request.timestamp = Date.now();
  response.hasError = false;

  response.on('finish', () => {
    response.timestamp = Date.now();
  });
});

server.listen(process.env.PORT, () => {
  logger.info(`Server is running at http://localhost:${process.env.PORT} `);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});
