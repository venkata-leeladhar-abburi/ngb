import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "../Button";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("opens a named modal, closes with Escape and returns focus", async () => {
    const user = userEvent.setup();
    render(
      <Dialog
        trigger={<Button variant="secondary">Share my result</Button>}
        title="Share my result"
      >
        <p>Story card</p>
      </Dialog>,
    );

    const trigger = screen.getByRole("button", { name: "Share my result" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Share my result" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveFocus();
  });
});
