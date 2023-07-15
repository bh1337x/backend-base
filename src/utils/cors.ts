export function corsEnabled() {
  return process.env.SERVER_CORS_ENABLED === 'true';
}

export function corsAllowCredentials() {
  return process.env.SERVER_CORS_ALLOW_CREDENTIALS === 'true';
}

export function corsAllowedOrigins() {
  return process.env.SERVER_CORS_ALLOWED_ORIGINS.split(',');
}

export function corsAllowedMethods() {
  return process.env.SERVER_CORS_ALLOWED_METHODS.split(',');
}

export function corsAllowedHeaders() {
  return process.env.SERVER_CORS_ALLOWED_HEADERS.split(',');
}
