export function corsEnabled() {
  return process.env.APP_CORS_ENABLED === 'true';
}

export function corsAllowedOrigins() {
  return process.env.APP_CORS_ALLOWED_ORIGINS.split(',');
}

export function corsAllowedMethods() {
  return process.env.APP_CORS_ALLOWED_METHODS.split(',');
}

export function corsAllowedHeaders() {
  return process.env.APP_CORS_ALLOWED_HEADERS.split(',');
}
