import "server-only";

/** OTP and session limits in one place (.claude/rules/server.md, Auth). */
export const OTP = {
  digits: 6,
  /** A code is valid for 5 minutes. */
  ttlSeconds: 5 * 60,
  /** Wrong tries before the code is dead. */
  maxAttempts: 5,
} as const;

export const SEND_LIMITS = {
  /** Sends to one phone before the bot challenge is required. */
  perPhone: { limit: 3, windowSeconds: 15 * 60 },
  /** One device cookie. */
  perDevice: { limit: 6, windowSeconds: 60 * 60 },
  /** One IP address (a hostel or office shares one, so this is looser). */
  perIp: { limit: 20, windowSeconds: 60 * 60 },
  /** Every send, site-wide: the daily SMS spend cap. [CONFIRM] the number with the SMS budget. */
  daily: { limit: 2000, windowSeconds: 24 * 60 * 60 },
} as const;

export const VERIFY_LIMITS = {
  /** Verify calls from one IP, on top of the 5 tries each code allows. */
  perIp: { limit: 30, windowSeconds: 15 * 60 },
} as const;

export const SESSION = {
  cookie: "ngb_session",
  /** 30 days. */
  ttlSeconds: 30 * 24 * 60 * 60,
} as const;

/** A random id per browser, so sends can be limited per device as well as per phone and IP. */
export const DEVICE_COOKIE = "ngb_device";
