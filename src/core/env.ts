import { object, coerce, string, enum as enumeration, infer as inference } from 'zod';
import { createLogger } from './logger';

const logger = createLogger('env');

const schema = object({
  NODE_ENV: enumeration(['development', 'production', 'test']),
  PORT: coerce.number(),
  APP_CORS_ENABLED: enumeration(['true', 'false']),
  APP_CORS_ALLOWED_ORIGINS: string().nonempty(),
  APP_CORS_ALLOWED_METHODS: string().nonempty(),
  APP_CORS_ALLOWED_HEADERS: string().nonempty(),
  APP_REQUEST_BODY_LIMIT: string().nonempty(),
});

logger.info('Validating environment variables');
const result = schema.safeParse(process.env);

if (result.success) {
  logger.info('Environment variables are valid');
  process.env = {
    ...process.env,
    ...result.data,
  } as NodeJS.ProcessEnv;
} else {
  logger.error('Environment variables are invalid');
  logger.error(result.error.issues.map((error) => `${error.path} is ${error.message}`));
  process.exit(1);
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends inference<typeof schema> {}
  }
}
