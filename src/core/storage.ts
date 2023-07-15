import type { Logger } from 'pino';
import { AsyncLocalStorage } from 'async_hooks';

const storage = new AsyncLocalStorage<{
  logger: Logger;
}>();

export default storage;
