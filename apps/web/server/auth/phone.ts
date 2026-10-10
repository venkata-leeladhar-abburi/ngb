import "server-only";

/**
 * Reads an Indian mobile number however it was typed ("98765 43210", "+91-9876543210",
 * "09876543210") and returns it in E.164, or null. Indian mobiles are 10 digits starting 6 to 9.
 * Other countries arrive with the NRI flow.
 */
export function parseIndianMobile(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, "");
  const match = /^(?:\+91|91|0)?([6-9]\d{9})$/.exec(digits);
  return match?.[1] ? `+91${match[1]}` : null;
}

/** For logs: the country code and the last two digits only. */
export const maskPhone = (phone: string): string =>
  `${phone.slice(0, 3)}${"*".repeat(Math.max(0, phone.length - 5))}${phone.slice(-2)}`;
