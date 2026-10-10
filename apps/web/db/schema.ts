// No `import "server-only"` here on purpose: drizzle-kit loads this file in plain Node to generate
// migrations. It holds table shapes only, no secrets and no queries.
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

const id = () => uuid().primaryKey().defaultRandom();
const createdAt = () => timestamp({ withTimezone: true }).notNull().defaultNow();

/** A person, known by their phone number: the number verified by OTP is the account (handoff §7). */
export const users = pgTable("users", {
  id: id(),
  /** E.164, e.g. +919876543210. */
  phone: text().notNull().unique(),
  name: text(),
  /** Site language last used: "en" or "te". */
  lang: text().notNull().default("en"),
  createdAt: createdAt(),
});

/**
 * One-time codes. Only an HMAC of the code is stored. A code dies at `expiresAt`, after 5 wrong
 * tries, when used (`consumedAt`), or when a newer code is sent to the same phone.
 */
export const otpCodes = pgTable(
  "otp_codes",
  {
    id: id(),
    phone: text().notNull(),
    codeHash: text().notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    attempts: integer().notNull().default(0),
    consumedAt: timestamp({ withTimezone: true }),
    createdAt: createdAt(),
  },
  (table) => [index("otp_codes_phone_idx").on(table.phone, table.createdAt)],
);

/** Login sessions. The cookie holds a random token; only its SHA-256 is stored here. */
export const sessions = pgTable(
  "sessions",
  {
    id: id(),
    tokenHash: text().notNull().unique(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    revokedAt: timestamp({ withTimezone: true }),
    createdAt: createdAt(),
  },
  (table) => [index("sessions_user_idx").on(table.userId)],
);

/** What is for sale. Checkout reads the price from here, never from the browser. Money is in paise. */
export const programs = pgTable("programs", {
  id: id(),
  slug: text().notNull().unique(),
  name: text().notNull(),
  weeks: integer().notNull(),
  pricePaise: integer().notNull(),
  active: boolean().notNull().default(true),
  createdAt: createdAt(),
});

export const orderStatus = pgEnum("order_status", ["created", "paid", "failed", "refunded"]);

/** A purchase attempt. Written by the payments step; `amountPaise` is copied from the program at that moment. */
export const orders = pgTable(
  "orders",
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id),
    programId: uuid()
      .notNull()
      .references(() => programs.id),
    amountPaise: integer().notNull(),
    status: orderStatus().notNull().default("created"),
    razorpayOrderId: text().unique(),
    createdAt: createdAt(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`now()`),
  },
  (table) => [index("orders_user_idx").on(table.userId)],
);

/** Access to a program, granted once per person by a paid order. */
export const enrolments = pgTable(
  "enrolments",
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id),
    programId: uuid()
      .notNull()
      .references(() => programs.id),
    orderId: uuid()
      .notNull()
      .references(() => orders.id),
    grantedAt: createdAt(),
  },
  (table) => [unique("enrolments_user_program_key").on(table.userId, table.programId)],
);
