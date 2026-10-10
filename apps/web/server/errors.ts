import "server-only";

/** A dependency (database, rate limiter, SMS) is not configured or not reachable: answer 503. */
export class ServiceUnavailableError extends Error {
  constructor(what: string) {
    super(`${what} is not available`);
    this.name = "ServiceUnavailableError";
  }
}
