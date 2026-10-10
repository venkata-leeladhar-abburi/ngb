import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";

import { sessions, users } from "@/db/schema";

import { testServices } from "../testing/services";

import { SESSION } from "./limits";
import { createSession, getSessionUser, revokeSession } from "./session";

let ctx: Awaited<ReturnType<typeof testServices>>;
let userId: string;
beforeEach(async () => {
  ctx = await testServices();
  const [user] = await ctx.services.db
    .insert(users)
    .values({ phone: "+919876543210" })
    .returning({ id: users.id });
  userId = user?.id ?? "";
});

describe("sessions", () => {
  it("creates a session whose token finds the user, storing only a hash", async () => {
    const { db, now } = ctx.services;
    const { token } = await createSession(db, userId, now());

    expect(token).toMatch(/^[\w-]{43}$/);
    expect(await getSessionUser(db, token, now())).toEqual({
      id: userId,
      phone: "+919876543210",
      name: null,
    });
    const [row] = await db.select().from(sessions).where(eq(sessions.userId, userId));
    expect(row?.tokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(row?.tokenHash).not.toBe(token);
  });

  it("rejects unknown and missing tokens", async () => {
    const { db, now } = ctx.services;

    expect(await getSessionUser(db, "not-a-real-token", now())).toBeNull();
    expect(await getSessionUser(db, undefined, now())).toBeNull();
  });

  it("rotates on login: the old token stops working", async () => {
    const { db, now } = ctx.services;
    const first = await createSession(db, userId, now());
    const second = await createSession(db, userId, now(), first.token);

    expect(second.token).not.toBe(first.token);
    expect(await getSessionUser(db, first.token, now())).toBeNull();
    expect((await getSessionUser(db, second.token, now()))?.id).toBe(userId);
  });

  it("ends on logout", async () => {
    const { db, now } = ctx.services;
    const { token } = await createSession(db, userId, now());

    await revokeSession(db, token, now());
    expect(await getSessionUser(db, token, now())).toBeNull();
    // Unknown or missing tokens are not an error.
    await revokeSession(db, "unknown", now());
    await revokeSession(db, undefined, now());
  });

  it("expires after 30 days", async () => {
    const { db, now } = ctx.services;
    const { token, expiresAt } = await createSession(db, userId, now());
    expect(expiresAt.getTime() - now().getTime()).toBe(SESSION.ttlSeconds * 1000);

    ctx.advance(SESSION.ttlSeconds - 1);
    expect((await getSessionUser(db, token, now()))?.id).toBe(userId);
    ctx.advance(1);
    expect(await getSessionUser(db, token, now())).toBeNull();
  });
});
