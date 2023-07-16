import { object, coerce, string, infer as inference } from 'zod';
import { createLogger } from './logger';

const logger = createLogger('environment');

const schema = object({
  NODE_ENV: string().refine((value) => {
    return ['development', 'production', 'test'].includes(value);
  }, "Should be one of 'development', 'production' or 'test'"),
  PORT: coerce.number().refine((value) => {
    return value >= 1024 && value <= 49151;
  }, 'Should be a number between 1024 and 49151'),
  SERVER_CORS_ENABLED: string().refine((value) => {
    return ['true', 'false'].includes(value);
  }, "Should be one of 'true' or 'false'"),
  SERVER_CORS_ALLOW_CREDENTIALS: string().refine((value) => {
    return ['true', 'false'].includes(value);
  }, "Should be one of 'true' or 'false'"),
  SERVER_CORS_ALLOWED_ORIGINS: string().refine((value) => {
    if (value === '*') return true;
    return value
      .split(',')
      .every(
        (origin) =>
          (origin.startsWith('http://') || origin.startsWith('https://')) && !origin.endsWith('/')
      );
  }, 'Should be a comma separated list of origins, must not contain any whitespace, must include protocol and must not include trailing slash'),
  SERVER_CORS_ALLOWED_METHODS: string().refine((value) => {
    return value
      .split(',')
      .every((method) =>
        ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(method)
      );
  }, 'Should be a comma separated list, must not contain any whitespace and include from the following:\n\tGET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS'),
  SERVER_CORS_ALLOWED_HEADERS: string().refine((value) => {
    return value
      .split(',')
      .every((header) => /^[a-z0-9-]+$/i.test(header.trim()) && !header.trim().includes(' '));
  }),
  SERVER_REQUEST_BODY_LIMIT: string().refine((value) => {
    return value.match(/^[1-9][0-9]*(K|M)B$/i);
  }, 'Should not begin with 0, must not contain any whitespace and must end with KB or MB'),
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
  logger.error(
    `The following environment variables are invalid:\n${result.error.issues
      .map((issue, index) => `${index + 1}) ${issue.path} - ${issue.message}`)
      .join('\n')}`
  );
  process.exit(1);
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends inference<typeof schema> {}
  }
}
