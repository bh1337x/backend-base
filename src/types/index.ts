import type { Logger } from 'pino';

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
