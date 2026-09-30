import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PlayButton } from "./PlayButton";

describe("PlayButton", () => {
  it("is a button named after its video, and works with the keyboard", async () => {
    const onClick = vi.fn();
    render(<PlayButton label="Play the 30-second journey clip" onClick={onClick} />);

    const button = screen.getByRole("button", { name: "Play the 30-second journey clip" });
    await userEvent.tab();
    expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
