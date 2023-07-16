import type { Validator } from '../types/core';
import { object, string } from 'zod';

export const helloWorld = {
  response: object({
    message: string(),
  }),
} satisfies Validator;

export const helloUser = {
  params: object({
    name: string(),
  }),
  response: object({
    message: string(),
  }),
} satisfies Validator;
