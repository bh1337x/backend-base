import { mkdirSync, existsSync } from 'fs';
import pino from 'pino';
import { inProduction } from '../utils/runtime';
import storage from '../core/storage';

if (!existsSync('logs')) mkdirSync('logs');

const LoggerInstance = pino({
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

export const logger = new Proxy(LoggerInstance, {
  get: (target, property, receiver) => {
    const store = storage.getStore();
    target = store ? store.logger : createLogger('server');
    return Reflect.get(target, property, receiver);
  },
});

export function createLogger(name: string, data: any = {}) {
  return LoggerInstance.child({ name, ...data });
}
