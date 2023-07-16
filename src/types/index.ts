import type { Logger } from 'pino';
import z from 'zod';
import { EnvironmentSchema } from '../lib/env';

declare module 'http' {
  interface IncomingMessage {
    timestamp: number;
    ipAddress: string;
    id: string;
    logger: Logger;
    rawBody: Buffer;
    initialized: boolean;
  }
  interface ServerResponse {
    timestamp: number;
    body: any;
    hasError: boolean;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof EnvironmentSchema> {}
  }
}
