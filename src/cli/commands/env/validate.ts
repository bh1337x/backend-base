import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { command, logger } from '../../../core/cli';
import { loadEnvironment } from '../../../lib';

export default command({
  name: 'validate',
  description: 'Validate the environment',
  handler: {
    options: {
      file: {
        flags: '-f, --file <path>',
        description: 'Load the .env file from root',
        defaultValue: '',
      },
    },
    async action({ file }) {
      if (file) {
        const envFilePath = path.resolve(process.cwd(), file);

        logger.info(`Loading env file from ${envFilePath}`);
        if (!fs.existsSync(envFilePath)) {
          logger.error('The env file was not found');
          process.exit(1);
        }

        dotenv.config({ path: envFilePath });
      }

      await loadEnvironment();
    },
  },
});
