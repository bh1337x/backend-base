import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { command } from '../../../core/cli';
import { logger } from '../..';

export default command({
  name: 'validate',
  description: 'Validate the environment',
  handler: {
    options: {
      dotEnv: {
        flags: '--dot-env <path|false>',
        description: 'Load the .env file from root',
        defaultValue: 'false',
      },
    },
    async action({ dotEnv }) {
      if (dotEnv !== 'false') {
        const envFilePath = path.resolve(process.cwd(), dotEnv);

        logger.info(`Loading env file from ${envFilePath}`);
        if (!fs.existsSync(envFilePath)) {
          logger.error('The env file was not found');
          process.exit(1);
        }

        dotenv.config({ path: envFilePath });
      }

      await import('../../../core/env');
    },
  },
});
