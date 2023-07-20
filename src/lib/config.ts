import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import Ajv from 'ajv';
import betterAjvErrors from 'better-ajv-errors';
import { array, boolean, object, string, z } from 'zod';
import { createLogger } from './logger';

const ConfigurationSchema = object({
  cors: object({
    origins: array(string()),
    methods: array(string()),
    headers: array(string()),
    credentials: boolean(),
  }),
  api: object({
    prefix: string(),
    bodyLimit: string(),
  }),
});

const logger = createLogger('config');

type ConfigData = z.infer<typeof ConfigurationSchema>;
export class Configuration {
  private static data: ConfigData | null = null;

  public static async load() {
    const configFolder = path.resolve(process.cwd(), 'config');

    const schemaFile = path.resolve(configFolder, 'schema.json');
    const configFile = path.resolve(configFolder, `${process.env.NODE_ENV}.json`);
    logger.info(`Configuration file: ${configFile}`);

    if (!fs.existsSync(schemaFile)) {
      throw new Error(`Could not find the configuration schema file`);
    }

    if (!fs.existsSync(configFile)) {
      throw new Error(`Could not find the configuration file`);
    }

    const schemaData = await fsPromises.readFile(schemaFile, 'utf-8');
    const schema = JSON.parse(schemaData);
    const validate = new Ajv().compile(schema);

    const configData = await fsPromises.readFile(configFile, 'utf-8');
    const rawConfig = JSON.parse(configData);

    const valid = validate(rawConfig);
    if (!valid) {
      const errors = betterAjvErrors(schema, rawConfig, validate.errors!, {
        indent: 2,
        json: configData,
      });
      logger.error(`The following configurations are invalid:\n${errors}`);
      process.exit(1);
    }

    const result = ConfigurationSchema.safeParse(rawConfig);
    if (result.success) {
      logger.info('The configuration has been validated');
      this.data = result.data;
    } else {
      logger.error(
        `The following configurations are invalid:\n${result.error.issues
          .map((issue, index) => `${index + 1}) ${issue.path} - ${issue.message}`)
          .join('\n')}`
      );
      process.exit(1);
    }
  }

  public static get<P extends keyof ConfigData, C extends keyof ConfigData[P]>(
    parent: P,
    child: C
  ): ConfigData[P][C] {
    if (!this.data) {
      throw new Error('The configuration has not been loaded');
    }

    if (!this.data[parent]) {
      throw new Error(`The configuration parent key '${parent}' does not exist`);
    }

    if (!this.data[parent][child]) {
      throw new Error(`The configuration key '${parent}.${child as string}' does not exist`);
    }

    return this.data[parent][child];
  }
}
