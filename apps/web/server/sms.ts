import "server-only";

import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export interface SmsSender {
  /** Sends the login code to an E.164 number. Throws if the provider refuses. */
  sendOtp(phone: string, code: string): Promise<void>;
}

/**
 * Local stand-in for the SMS provider: appends each code to a file (one JSON object per line) so a
 * developer or the Playwright journey can read it. Never used on a deployment (server/services.ts).
 */
export class OutboxSmsSender implements SmsSender {
  constructor(private readonly file: string) {}

  async sendOtp(phone: string, code: string) {
    await mkdir(dirname(this.file), { recursive: true });
    await appendFile(
      this.file,
      `${JSON.stringify({ phone, code, at: new Date().toISOString() })}\n`,
    );
  }
}
