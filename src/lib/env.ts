import { object, coerce, string } from 'zod';
import { createLogger } from './logger';

const logger = createLogger('environment');

export const EnvironmentSchema = object({
  NODE_ENV: string().refine((value) => {
    return ['development', 'production', 'test'].includes(value);
  }, "Should be one of 'development', 'production' or 'test'"),
  PORT: coerce.number().refine((value) => {
    return value >= 1024 && value <= 49151;
  }, 'Should be a number between 1024 and 49151'),
  CORS_ENABLED: string().refine((value) => {
    return ['true', 'false'].includes(value);
  }, "Should be one of 'true' or 'false'"),
});

export async function loadEnvironment() {
  logger.info('Validating the environment variables');
  const result = EnvironmentSchema.safeParse(process.env);

  if (result.success) {
    logger.info('The environment variables have been validated');
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
}
