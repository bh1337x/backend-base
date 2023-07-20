import type { Application } from 'express';
import type { Validator, Controller, Route } from '../types/core';
import { logger } from '../lib';

export function _<T extends Validator>(handler: Controller<T>, validator?: T): Controller<T> {
  if (!validator) {
    return handler;
  }

  return async function (request, response, next) {
    const bodyValidation = validator.body
      ? validator.body.strict().parseAsync(request.body)
      : Promise.resolve(request.body);

    const queryValidation = validator.query
      ? validator.query.strict().parseAsync(request.query)
      : Promise.resolve(request.query);

    const paramsValidation = validator.params
      ? validator.params.strict().parseAsync(request.params)
      : Promise.resolve(request.params);

    const [body, query, params] = await Promise.all([
      bodyValidation,
      queryValidation,
      paramsValidation,
    ]);

    request.body = body;
    request.query = query;
    request.params = params;

    if (validator.response) {
      const originalJson = response.json.bind(response);
      response.json = function (body: any) {
        response.body = body;
        if (response.hasError) return originalJson(body);
        validator.response!.parseAsync(body).then(originalJson).catch(next);
      } as any;
    }

    const ret: any = handler(request, response, next);

    if (ret && ret.catch) {
      ret.catch(next);
    }
  };
}

export function attach(app: Application, parentPath: string, childPath: string, route: Route) {
  const fullPath = `${parentPath}${childPath}`;
  if (typeof route === 'function') {
    if (!isValidPath(childPath)) {
      throw new Error(`Invalid path: '${childPath}' in '${parentPath}'`);
    }

    logger.info(`\tGET\t\t ${fullPath}`);
    app.get(transformPath(fullPath), route);
  }

  if (typeof route === 'object') {
    if (!isValidPath(fullPath)) {
      throw new Error(`Invalid path: ${fullPath}`);
    }

    for (const [key, value] of Object.entries(route)) {
      if (['GET', 'POST', 'PUT', 'DELETE'].includes(key)) {
        logger.info(`\t${key}\t\t ${fullPath}`);
        switch (key) {
          case 'GET':
            app.get(transformPath(fullPath), value as any);
            break;
          case 'POST':
            app.post(transformPath(fullPath), value as any);
            break;
          case 'PUT':
            app.put(transformPath(fullPath), value as any);
            break;
          case 'DELETE':
            app.delete(transformPath(fullPath), value as any);
            break;
        }
      } else {
        if (!isValidPath(key)) {
          throw new Error(`Invalid path: '${key}' in '${fullPath}'`);
        }
        attach(app, fullPath, key, value);
      }
    }
  }
}

function isValidPath(path: string) {
  return path.startsWith('/') && !path.endsWith('/') && !path.includes('//');
}

function transformPath(path: string) {
  return path.replace(/{/g, ':').replace(/}/g, '');
}
