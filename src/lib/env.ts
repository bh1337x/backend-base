import { object, coerce, string } from 'zod';
import { createLogger } from './logger';

const logger = createLogger('env');

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

export class Environment {
  static async load() {
    logger.info('Validating the environment');
    const result = EnvironmentSchema.safeParse(process.env);

    if (result.success) {
      logger.info('The environment has been validated');
      process.env = {
        ...process.env,
        ...result.data,
      } as NodeJS.ProcessEnv;
    } else {
      logger.error(
        `The following variables are invalid:\n${result.error.issues
          .map((issue, index) => `${index + 1}) ${issue.path} - ${issue.message}`)
          .join('\n')}`
      );
      process.exit(1);
    }
  }
}
