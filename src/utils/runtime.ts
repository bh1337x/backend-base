export function inDevelopment() {
  return process.env.NODE_ENV === 'development';
}

export function inProduction() {
  return process.env.NODE_ENV === 'production';
}

export function inTest() {
  return process.env.NODE_ENV === 'test';
}
