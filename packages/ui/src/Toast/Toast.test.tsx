import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ToastProvider, useToast } from "./Toast";

function CopyLink() {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() => {
        toast("Link copied.", { tone: "good" });
      }}
    >
      Copy link
    </button>
  );
}

describe("Toast", () => {
  it("shows the message in an announced region", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <CopyLink />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Copy link" }));
    expect(await screen.findByText("Link copied.")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /Notifications/ })).toBeInTheDocument();
  });

  it("explains how to fix a missing provider", () => {
    expect(() => render(<CopyLink />)).toThrow("useToast must be used inside <ToastProvider>");
  });
});
