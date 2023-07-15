import type { Validator } from '../types/core';
import { number, object, string } from 'zod';

export const helloWorld = {
  response: object({
    message: string(),
  }),
} satisfies Validator;

export const helloUser = {
  params: object({
    name: number(),
  }),
  response: object({
    message: string(),
  }),
} satisfies Validator;
