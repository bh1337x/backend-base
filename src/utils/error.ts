import HttpError from '../app/error';

export function createError(status: number, message: string) {
  return new HttpError(status, message);
}

export function badRequest(message: string) {
  return createError(400, message);
}

export function unauthorized(message: string) {
  return createError(401, message);
}

export function forbidden(message: string) {
  return createError(403, message);
}

export function notFound(message: string) {
  return createError(404, message);
}

export function internalServerError(message: string) {
  return createError(500, message);
}
