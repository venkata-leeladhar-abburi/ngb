import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { OtpInput } from "./OtpInput";

describe("OtpInput", () => {
  it("is one labelled field set up for SMS autofill", () => {
    render(<OtpInput label="Enter OTP" />);

    const input = screen.getByRole("textbox", { name: "Enter OTP" });
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(document.querySelectorAll("[data-otp-box]")).toHaveLength(6);
  });

  it("keeps digits only, shows them in the boxes and completes once", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<OtpInput label="Enter OTP" onComplete={onComplete} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "4a8 2");
    expect(input).toHaveValue("482");
    expect(document.querySelector('[data-otp-box="2"]')).toHaveTextContent("2");
    expect(document.querySelector('[data-otp-box="3"]')).toHaveAttribute("data-active", "true");

    await user.type(input, "9157");
    expect(input).toHaveValue("482915");
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith("482915");
  });

  it("accepts a pasted code written with a space, as SMS messages often do", async () => {
    const user = userEvent.setup();
    render(<OtpInput label="Enter OTP" />);

    await user.click(screen.getByRole("textbox"));
    await user.paste("123 456");
    expect(screen.getByRole("textbox")).toHaveValue("123456");
  });

  it("reports errors in words", () => {
    render(<OtpInput label="Enter OTP" error="That code did not match." />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("That code did not match.");
  });
});
