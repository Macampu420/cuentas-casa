export function assertBasicAuth(
  authorizationHeader: string | null | undefined
): void {
  const expectedUser = process.env.APP_USER;
  const expectedPassword = process.env.APP_PASSWORD;
  if (!expectedUser || !expectedPassword) {
    throw new Error("APP_USER/APP_PASSWORD are not configured");
  }

  if (!authorizationHeader?.startsWith("Basic ")) {
    throw new Error("Missing Authorization header");
  }
  const base64 = authorizationHeader.slice("Basic ".length);
  const [user, password] = Buffer.from(base64, "base64")
    .toString("utf8")
    .split(":");
  if (user !== expectedUser || password !== expectedPassword) {
    throw new Error("Invalid credentials");
  }
}
