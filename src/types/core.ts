import type { AnyZodObject, z } from 'zod';
import type { RequestHandler } from 'express';

type Schema = AnyZodObject;

export type Validator = {
  params?: Schema;
  query?: Schema;
  body?: Schema;
  response?: Schema;
};

export type Validations = {
  [key: string]: Validator;
};

export type Controller<T extends Validator> = RequestHandler<
  z.infer<T['params'] extends Schema ? T['params'] : any>,
  z.infer<T['response'] extends Schema ? T['response'] : any>,
  z.infer<T['body'] extends Schema ? T['body'] : any>,
  z.infer<T['query'] extends Schema ? T['query'] : any>
>;

export type Controllers = {
  GET?: Controller<Validator>;
  POST?: Controller<Validator>;
  PUT?: Controller<Validator>;
  DELETE?: Controller<Validator>;
};

export type Middleware = RequestHandler;

export type Middlewares = Middleware[];

export type Route =
  | {
      [key: string]: Route;
    }
  | Controllers
  | Controller<Validator>;

export type Routes = {
  [key: string]: Route;
};

export type ErrorResponse = {
  status: number;
  message: string;
  stack?: string;
  method: string;
  path: string;
  timestamp: number;
};

export type CommandOptions = {
  [key: string]: {
    flags: string;
    description: string;
    defaultValue?: string;
  };
};

export type CommandDirectory = {
  name: string;
  description: string;
};

export type CommandFile<T extends CommandOptions | undefined> = {
  name: string;
  description: string;
  handler: T extends CommandOptions
    ? {
        options: T;
        action: (options: { [key in keyof T]: string }) => Promise<void>;
      }
    : {
        action: () => Promise<void>;
      };
};

export type CommandDirectoryEntry = {
  isDirectory: true;
  meta: CommandDirectory;
};

export type CommandFileEntry<T extends CommandOptions | undefined> = {
  isDirectory: false;
  meta: CommandFile<T>;
};

export type CommandEntry = CommandDirectoryEntry | CommandFileEntry<CommandOptions | undefined>;
