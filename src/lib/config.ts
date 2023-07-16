import type { ConfigData } from '../types/core';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { createLogger } from './logger';

const logger = createLogger('config');
const configFolder = path.resolve(process.cwd(), 'config');
const env = process.env.NODE_ENV!;

let data: ConfigData = null as any;

export async function loadConfiguration() {
  const configFile = path.resolve(configFolder, `${env}.json`);
  logger.info(`Loading the configuration from ${configFile}`);

  if (!fs.existsSync(configFile)) {
    throw new Error(`Could not find the configuration file`);
  }

  const config = await fsPromises.readFile(configFile, 'utf-8');
  data = JSON.parse(config);
  logger.info('The configuration has been loaded');
}

export function getConfiguration<P extends keyof ConfigData, C extends keyof ConfigData[P]>(
  parent: P,
  child: C
): ConfigData[P][C] {
  if (!data) {
    throw new Error('The configuration has not been loaded');
  }

  return data[parent][child];
}
