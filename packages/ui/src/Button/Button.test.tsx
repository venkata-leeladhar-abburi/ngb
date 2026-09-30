import { InstagramLogoIcon } from "@phosphor-icons/react/ssr";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("is a real button named by its label, with a decorative caret", () => {
    render(<Button>Start my plan</Button>);

    const button = screen.getByRole("button", { name: "Start my plan" });
    expect(button).toHaveAttribute("type", "button");
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("runs onClick from a mouse click, Enter and Space", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Start my plan</Button>);

    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("keeps a submit type when one is given", () => {
    render(<Button type="submit">Send my plan</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("does nothing when disabled and leaves the tab order", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Start my plan
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await user.click(button);
    await user.tab();
    expect(onClick).not.toHaveBeenCalled();
    expect(button).not.toHaveFocus();
  });

  it("while loading keeps its name and focus but ignores clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Start my plan
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Start my plan" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders as a link for navigation", async () => {
    const user = userEvent.setup();
    render(
      <Button as="a" href="/programs">
        Start my plan
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Start my plan" });
    expect(link).toHaveAttribute("href", "/programs");
    expect(link).not.toHaveAttribute("type");
    await user.tab();
    expect(link).toHaveFocus();
  });

  it("blocks a disabled link without removing it", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button as="a" href="/programs" disabled onClick={onClick}>
        Start my plan
      </Button>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-disabled", "true");
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("uses the bone focus ring on a red ground, for every variant", () => {
    const { container } = render(
      <>
        <Button variant="secondary">Dark</Button>
        <Button variant="secondary" ground="red">
          Red
        </Button>
      </>,
    );
    const rings = container.querySelectorAll('[class*="focus-ring-color-on-red"]');
    expect(rings).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Red" }).contains(rings[0] ?? null)).toBe(true);
  });

  it("shows the caret on primary and on red, not on secondary, unless told otherwise", () => {
    render(
      <>
        <Button variant="secondary">Try free tools</Button>
        <Button variant="onRed">Start my plan</Button>
        <Button variant="secondary" arrow>
          Show my number
        </Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Try free tools" }).querySelector("svg")).toBeNull();
    expect(
      screen.getByRole("button", { name: "Start my plan" }).querySelector("svg"),
    ).not.toBeNull();
    expect(
      screen.getByRole("button", { name: "Show my number" }).querySelector("svg"),
    ).not.toBeNull();
  });

  it("hides the caret while disabled or loading", () => {
    render(
      <>
        <Button disabled>Unavailable</Button>
        <Button loading>Start my plan</Button>
      </>,
    );

    for (const button of screen.getAllByRole("button")) {
      expect(button.querySelector("svg")).toBeNull();
    }
  });

  it("draws the secondary border, and drops it when disabled", () => {
    const { rerender } = render(<Button variant="secondary">Try free tools</Button>);
    expect(screen.getByRole("button").querySelector('[data-chamfer="border"]')).not.toBeNull();

    rerender(
      <Button variant="secondary" disabled>
        Try free tools
      </Button>,
    );
    expect(screen.getByRole("button").querySelector('[data-chamfer="border"]')).toBeNull();
  });

  it("lifts on hover only when it can be used", () => {
    const { rerender } = render(<Button>Start my plan</Button>);
    expect(screen.getByRole("button").className).toContain(
      "hover:-translate-y-(--motion-lift-button)",
    );

    rerender(<Button disabled>Start my plan</Button>);
    expect(screen.getByRole("button").className).not.toContain("hover:-translate-y");
  });

  it("keeps a leading icon decorative, so the label alone names the button", () => {
    render(
      <Button as="a" href="#instagram" variant="secondary" icon={InstagramLogoIcon}>
        Instagram
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Instagram" });
    expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("blocks a disabled link even without an onClick of its own", async () => {
    let prevented: boolean | undefined;
    document.addEventListener("click", (event) => (prevented = event.defaultPrevented), {
      once: true,
    });
    render(
      <Button as="a" href="/programs" disabled>
        Start my plan
      </Button>,
    );

    await userEvent.click(screen.getByRole("link", { name: "Start my plan" }));
    expect(prevented).toBe(true);
  });
});
