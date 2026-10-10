import "server-only";

type Fields = Record<string, string | number | boolean | null | undefined>;

/**
 * One JSON line per event, with the request id. Never pass a full phone number, an OTP, a token or
 * payment details: mask phones with `maskPhone` first (.claude/rules/server.md).
 */
export function log(level: "info" | "warn" | "error", event: string, fields: Fields = {}): void {
  const line = JSON.stringify({ level, event, ...fields });
  if (level === "info") process.stdout.write(`${line}\n`);
  else if (level === "warn") console.warn(line);
  else console.error(line);
}
