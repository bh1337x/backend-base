import { mkdirSync, existsSync } from 'fs';
import pino from 'pino';
import { inProduction } from '../utils/runtime';
import storage from './storage';

if (!existsSync('logs')) mkdirSync('logs');

const logger = pino({
  transport: {
    targets: [
      {
        level: 'trace',
        target: 'pino/file',
        options: {
          destination: inProduction() ? `logs/server-${Date.now()}.log` : 'logs/server.log',
          append: inProduction(),
        },
      },
      {
        level: 'trace',
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          colorizeObjects: true,
          translateTime: 'SYS:yyyy-mm-dd hh:MM:ss.l TT',
        },
      },
    ],
  },
  redact: {
    paths: [
      'request.headers.authorization',
      'request.body.refreshToken',
      'request.body.password',
      'request.body.confirmPassword',
      'response.body.data.password',
      'response.body.secret',
      'response.body.accessToken',
      'response.body.tokens.accessToken',
      'response.body.tokens.refreshToken',
    ],
    censor: '***',
    remove: false,
  },
});

export function createLogger(name: string, data: any = {}) {
  return logger.child({ name, ...data });
}

export default new Proxy(logger, {
  get: (target, property, receiver) => {
    let logger = storage.getStore()?.logger;
    if (!logger) logger = createLogger('server');

    target = logger;
    return Reflect.get(target, property, receiver);
  },
});
