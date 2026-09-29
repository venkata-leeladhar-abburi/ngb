---
paths:
  - "apps/web/server/**"
  - "apps/web/app/api/**"
  - "apps/web/cms/**"
  - "apps/web/db/**"
---

# Server, data, payments and CMS

## General
- Every file here starts with `import "server-only"` (route handlers excepted).
- Validate every request body, query and webhook payload with Zod. Reject unknown fields.
- Return typed errors: `{ error: { code, message } }` with correct HTTP status. Never leak stack traces.
- Log with a request ID; never log phone numbers in full, OTPs, tokens, card or UPI details.
- Functions run in `bom1`; keep database and Redis in or near Mumbai.

## Database
- Drizzle schema in `apps/web/db/schema.ts`; every change is a new migration (`pnpm db:generate`). Never edit an applied migration.
- Index every column used in a lookup (phone, order ID, Razorpay payment ID, program slug).
- Use pooled connections. Wrap enrolment grants in a transaction.
- Store money as integer paise, never floats.

## Auth (phone + OTP)
- OTP: 6 digits, 5-minute expiry, hashed at rest, max 5 verify attempts.
- Rate limits in Redis: per phone, per IP, per device fingerprint; bot challenge after 3 sends; daily SMS spend cap with an alert.
- Sessions: secure, http-only, same-site cookies; rotate on login; server-side revocation.

## Payments (Razorpay)
- Create the order on the server from the program slug; the price comes from the database, never the client.
- Verify the checkout signature and the webhook signature (`X-Razorpay-Signature`) before doing anything.
- Idempotency: store each webhook event ID with a unique constraint; a duplicate event returns 200 and does nothing.
- Grant access, record the invoice and queue the receipt in one transaction plus one queued job.
- Hourly reconciliation job: compare captured Razorpay payments with enrolments and alert on any mismatch.
- Tests required: success, failed payment, duplicate webhook, bad signature, amount mismatch.

## Jobs and WhatsApp
- All WhatsApp messages, receipts and retries go through the queue with retries and a dead-letter alert.
- Send marketing messages only to numbers with a recorded opt-in (timestamp, source, text shown).
- The 7-day starter sequence is defined in `docs/strategy/handoff.md` section 5; do not invent new messages.

## CMS (Payload)
- Collections: Programs, Tools (copy only, logic stays in code), Results (requires a consent file and approval before publish), FAQ, Pages, Media.
- Every text field is localised `en` and `te`.
- Publishing revalidates the affected cache tags; drafts never reach the public site.
- Admin users require 2-factor login; roles: admin, editor, reviewer.

## Privacy (DPDP Act 2023)
- Keep consent records; provide export and delete-my-data endpoints.
- Progress photos in a private bucket; access only through short-lived signed URLs.
- Retention: delete unconverted leads after 12 months unless the person re-engages.
