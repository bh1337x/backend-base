import type { Routes } from '../types/core';
import { hello } from '../controllers';

export default {
  '/hello': {
    GET: hello.helloWorld,
    '/{name}': hello.helloUser,
  },
} satisfies Routes;
