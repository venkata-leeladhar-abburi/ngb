import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { and, eq, gt, isNull } from "drizzle-orm";

import { sessions, users } from "@/db/schema";

import type { Db } from "../db/client";

import { SESSION } from "./limits";

/** Only the SHA-256 of a session token is stored: a database leak does not hand out logins. */
const hashToken = (token: string): string => createHash("sha256").update(token).digest("hex");

export interface SessionUser {
  id: string;
  phone: string;
  name: string | null;
}

/**
 * Starts a session for a user and returns the token for the cookie. Any session the browser already
 * had (`previousToken`) is revoked, so the token changes on every login.
 */
export async function createSession(
  db: Db,
  userId: string,
  now: Date,
  previousToken?: string,
): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(now.getTime() + SESSION.ttlSeconds * 1000);
  await db.transaction(async (tx) => {
    if (previousToken) {
      await tx
        .update(sessions)
        .set({ revokedAt: now })
        .where(and(eq(sessions.tokenHash, hashToken(previousToken)), isNull(sessions.revokedAt)));
    }
    await tx
      .insert(sessions)
      .values({ tokenHash: hashToken(token), userId, expiresAt, createdAt: now });
  });
  return { token, expiresAt };
}

/** The user behind a session token, or null if it is unknown, expired or revoked. */
export async function getSessionUser(
  db: Db,
  token: string | undefined,
  now: Date,
): Promise<SessionUser | null> {
  if (!token) return null;
  const [row] = await db
    .select({ id: users.id, phone: users.phone, name: users.name })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.tokenHash, hashToken(token)),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, now),
      ),
    )
    .limit(1);
  return row ?? null;
}

/** Ends a session on the server (logout). Safe to call with an unknown token. */
export async function revokeSession(db: Db, token: string | undefined, now: Date): Promise<void> {
  if (!token) return;
  await db
    .update(sessions)
    .set({ revokedAt: now })
    .where(and(eq(sessions.tokenHash, hashToken(token)), isNull(sessions.revokedAt)));
}
