import type { Validations } from '../types/core';
import { object, string } from 'zod';

export const hello = {
  helloWorld: {
    response: object({
      message: string(),
    }),
  },
  helloUser: {
    params: object({
      name: string(),
    }),
    response: object({
      message: string(),
    }),
  },
} satisfies Validations;
