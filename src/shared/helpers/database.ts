export function getMongoURI(
  username: string,
  password: string,
  host: string,
  port: string,
  databaseName: string,
): string {
  const hasAuth = Boolean(username && password);

  if (!hasAuth) {
    return `mongodb://${host}:${port}/${databaseName}`;
  }

  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;
}
