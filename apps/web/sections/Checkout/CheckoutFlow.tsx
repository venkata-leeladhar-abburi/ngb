"use client";

import { Button, Heading, OtpInput, ProgressSteps, Text, TextField } from "@ngb/ui";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";

import type { Content, Lang } from "@/content";
import { fill } from "@/lib/format";

type Copy = Content["checkout"];
type Step = "phone" | "code" | "pay";

const STEPS: readonly Step[] = ["phone", "code", "pay"];
const CODE_INPUT_ID = "checkout-code";

interface CheckoutFlowProps {
  copy: Copy;
  lang: Lang;
  /** "₹1,999", formatted on the server from the database price. */
  price: string;
  /** The masked phone of the signed-in visitor, if any: they start at the pay step. */
  signedInPhone: string | null;
}

/** Posts JSON to one of our own endpoints and returns the error code, or null when it worked. */
async function post(path: string, body: Record<string, string>): Promise<string | null> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) return null;
    const data = (await response.json().catch(() => null)) as { error?: { code?: string } } | null;
    return data?.error?.code ?? "unavailable";
  } catch {
    return "network";
  }
}

/**
 * Checkout steps (pages.md: Checkout, screen B6): phone, the 6-digit code, then pay. The phone
 * number verified here becomes the account; no email or password is asked for (handoff §7). The pay
 * step shows the amount but is switched off until payments exist; nothing here moves money.
 */
export function CheckoutFlow({ copy, lang, price, signedInPhone }: CheckoutFlowProps) {
  const [step, setStep] = useState<Step>(signedInPhone ? "pay" : "phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [phoneShown, setPhoneShown] = useState(signedInPhone);

  // After a step change, focus goes to the new step's heading so it is read out. Not on first load.
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [step]);

  const go = (next: Step) => {
    moved.current = true;
    setError(null);
    setCode("");
    setStep(next);
  };

  // An error code this page has no words for (a server error) reads as "not available".
  const message = (failed: string): string =>
    (copy.errors as Record<string, string | undefined>)[failed] ?? copy.errors.unavailable;

  const send = async () => {
    setBusy(true);
    const failed = await post("/api/otp/send", { phone });
    setBusy(false);
    if (failed) {
      setError(message(failed));
      return false;
    }
    return true;
  };

  const submitPhone = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    if (busy) return;
    if (await send()) {
      setPhoneShown(phone.trim());
      go("code");
    }
  };

  const verify = async (value: string) => {
    if (busy) return;
    if (!/^\d{6}$/.test(value)) {
      setError(copy.errors.wrong_code);
      return;
    }
    setBusy(true);
    const failed = await post("/api/otp/verify", { phone, code: value, lang });
    setBusy(false);
    if (failed) {
      // Clear the boxes and put the cursor back, so the next six digits submit on their own.
      setCode("");
      setError(message(failed));
      document.getElementById(CODE_INPUT_ID)?.focus();
      return;
    }
    go("pay");
  };

  const index = STEPS.indexOf(step);

  return (
    <div className="flex flex-col gap-32">
      <ProgressSteps
        label={copy.stepsLabel}
        steps={STEPS.map((name) => copy.steps[name])}
        current={index}
        doneLabel={copy.done}
        counter={(current, total) => fill(copy.counter, { step: current, total })}
      />

      {step === "phone" && (
        <form
          noValidate
          onSubmit={(event) => void submitPhone(event)}
          className="flex flex-col gap-24"
        >
          <Heading as="h2" variant="h2" ref={heading} tabIndex={-1} className="outline-hidden">
            {copy.phoneLabel}
          </Heading>
          <TextField
            name="phone"
            label={copy.phoneLabel}
            hint={copy.phoneHint}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.currentTarget.value);
              setError(null);
            }}
            error={error ?? undefined}
          />
          <Button as="button" type="submit" loading={busy} className="self-start">
            {copy.send}
          </Button>
        </form>
      )}

      {step === "code" && (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void verify(code);
          }}
          className="flex flex-col gap-24"
        >
          <div className="flex flex-col gap-8">
            <Heading as="h2" variant="h2" ref={heading} tabIndex={-1} className="outline-hidden">
              {copy.codeLabel}
            </Heading>
            <Text tone="muted">{fill(copy.codeSent, { phone: phoneShown ?? "" })}</Text>
          </div>
          <OtpInput
            id={CODE_INPUT_ID}
            name="code"
            label={copy.codeLabel}
            value={code}
            onChange={(value) => {
              setCode(value);
              setError(null);
            }}
            onComplete={(value) => void verify(value)}
            error={error ?? undefined}
          />
          <div className="flex flex-wrap gap-16">
            <Button as="button" type="submit" loading={busy}>
              {copy.verify}
            </Button>
            <Button
              as="button"
              variant="secondary"
              disabled={busy}
              onClick={() => {
                setCode("");
                setError(null);
                void send();
              }}
            >
              {copy.resend}
            </Button>
            <Button
              as="button"
              variant="secondary"
              disabled={busy}
              onClick={() => {
                go("phone");
              }}
            >
              {copy.change}
            </Button>
          </div>
        </form>
      )}

      {step === "pay" && (
        <div className="flex flex-col items-start gap-24">
          <div className="flex flex-col gap-8">
            <Heading as="h2" variant="h2" ref={heading} tabIndex={-1} className="outline-hidden">
              {copy.steps.pay}
            </Heading>
            {phoneShown && <Text tone="muted">{fill(copy.signedIn, { phone: phoneShown })}</Text>}
          </div>
          <Text id="pay-note">{copy.payNote}</Text>
          <Button as="button" disabled aria-describedby="pay-note">
            {fill(copy.pay, { price })}
          </Button>
        </div>
      )}
    </div>
  );
}
