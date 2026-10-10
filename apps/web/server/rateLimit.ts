import "server-only";

export interface RateLimiter {
  /**
   * Counts one hit for `key` in the current window and says whether it is within `limit`.
   * The hit is counted even when it is over the limit.
   */
  hit(
    key: string,
    limit: number,
    windowSeconds: number,
  ): Promise<{ allowed: boolean; count: number }>;
}

/**
 * Fixed-window counters in this process's memory. For local development and tests only: it is not
 * shared between serverless instances, so production must use Redis.
 */
export class MemoryRateLimiter implements RateLimiter {
  private readonly windows = new Map<string, { resetsAt: number; count: number }>();

  constructor(private readonly now: () => Date = () => new Date()) {}

  hit(key: string, limit: number, windowSeconds: number) {
    const time = this.now().getTime();
    const current = this.windows.get(key);
    const window =
      current && current.resetsAt > time
        ? current
        : { resetsAt: time + windowSeconds * 1000, count: 0 };
    window.count += 1;
    this.windows.set(key, window);
    return Promise.resolve({ allowed: window.count <= limit, count: window.count });
  }
}
